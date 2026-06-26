const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { sendMail } = require('../services/emailService');

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'fallback_secret_key';
const JWT_EXPIRES = '24h';

const generateNumericOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Synchronized Routing Map to cleanly resolve dashboards matching frontend specifications
const DASHBOARD_PATHS = {
    SUPER_ADMIN: '/dashboard/super-admin',
    ADMIN: '/dashboard/admin',
    VENDOR: '/dashboard/vendor',
    COLLEGE: '/dashboard/college',
    MENTOR: '/dashboard/mentor',
    STUDENT: '/dashboard/student'
};

// ─────────────────────────────────────────────────────────────
// GET /api/auth/colleges (Public — used to populate Register.jsx dropdown)
// ─────────────────────────────────────────────────────────────
exports.listActiveColleges = async (req, res) => {
    try {
        const [colleges] = await db.execute(
            "SELECT id, college_name, college_code FROM colleges ORDER BY college_name ASC"
        );
        return res.status(200).json({ colleges });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch colleges.', error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────
// POST /api/auth/register (Student Self-Registration)
// ─────────────────────────────────────────────────────────────
exports.registerStudent = async (req, res) => {
    const { rollNo, studentName, email, mobile, password, college, course, year, semester } = req.body;
    
    try {
      const cleanEmail = email.trim().toLowerCase();
const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [cleanEmail]);
if (existing.length) {
    return res.status(400).json({ message: 'This email address is already registered.' });
}

const hashedPassword = await bcrypt.hash(password, 12);
const username = cleanEmail.split('@')[0]; // or use rollNo if you prefer

const [userResult] = await db.execute(
    'INSERT INTO users (username, email, password, role, is_verified, status) VALUES (?, ?, ?, "STUDENT", 0, "PENDING")',
    [username, cleanEmail, hashedPassword]
);
const userId = userResult.insertId;
        const mappedCollegeId = isNaN(college) ? 1 : parseInt(college);
        const mappedYearId = isNaN(year) ? 1 : parseInt(year);
        const mappedSemesterId = isNaN(semester) ? 1 : parseInt(semester);
        
        let mappedCourseId = 1;
        if (course === 'mca') mappedCourseId = 1;
        if (course === 'be') mappedCourseId = 2;

        // FIXED: Column name changed from college_id to college_profile_id to match DB schema
        await db.execute(
            'INSERT INTO students (user_id, roll_no, student_name, mobile, college_profile_id, course_id, year_id, semester_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, rollNo, studentName, mobile, mappedCollegeId, mappedCourseId, mappedYearId, mappedSemesterId]
        );

        const otp = generateNumericOTP();
        const expiry = new Date(Date.now() + 5 * 60 * 1000); 

        await db.execute(
            'INSERT INTO otp_verification (email, otp, purpose, expiry) VALUES (?, ?, "REGISTER", ?)',
            [cleanEmail, otp, expiry]
        );

        // Optional non-blocking fallback context if mail provider variables are missing
        try {
            await sendMail(
                cleanEmail, 
                "Verify your LMS Account", 
                `<p>Hello ${studentName},</p><h3>Your Verification OTP code is: ${otp}</h3><p>This code expires in 5 minutes.</p>`
            );
        } catch (mailError) {
            console.log(`[Email Service Offline fallback] Verification OTP Code: ${otp}`);
        }

        return res.status(201).json({ message: 'Registration initiated! An OTP code has been sent to your email.' });
    } catch (err) {
        console.error("--- REGISTRATION CRASH LOG ---", err);
        return res.status(500).json({ message: `Server Error: ${err.message}` });
    }
};

// ─────────────────────────────────────────────────────────────
// POST /api/auth/verify-otp (OTP Code Verification Handler)
// ─────────────────────────────────────────────────────────────
exports.verifyOtp = async (req, res) => {
    const { email, otp, purpose } = req.body;
    try {
        const cleanEmail = email.trim().toLowerCase();
        const [records] = await db.execute(
            'SELECT * FROM otp_verification WHERE email = ? AND otp = ? AND purpose = ? AND is_used = 0 AND expiry > NOW()',
            [cleanEmail, otp, purpose]
        );

        if (!records.length) {
            return res.status(400).json({ message: 'Invalid or expired verification code.' });
        }

        await db.execute('UPDATE otp_verification SET is_used = 1 WHERE id = ?', [records[0].id]);

        if (purpose === 'REGISTER') {
            await db.execute('UPDATE users SET is_verified = 1, status = "ACTIVE" WHERE email = ?', [cleanEmail]);
        }

        return res.status(200).json({ message: 'Email verified successfully!' });
    } catch (err) {
        return res.status(500).json({ message: 'An error occurred during verification.', error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────
// POST /api/auth/login (Unified Core Authentication Gateway)
// ─────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
    const identity = req.body.identity || req.body.usernameOrEmail || req.body.email;
    const { password } = req.body;

    if (!identity || !password) {
        return res.status(400).json({ message: 'Username/Email and password are required.' });
    }

    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ? OR username = ?', [identity, identity]);
        if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

        const user = rows[0];

        if (user.status === 'DISABLED') {
            return res.status(403).json({ message: 'This account has been deactivated. Contact your administrator.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        if (!user.is_verified) {
            return res.status(403).json({ message: 'Please verify your email address to log in.', unverified: true });
        }

        let displayName = user.email;
        if (user.role === 'SUPER_ADMIN') {
            displayName = 'Super Admin';
        } else if (user.role === 'ADMIN') {
            const [r] = await db.execute('SELECT admin_name FROM admins WHERE user_id = ?', [user.id]);
            if (r.length) displayName = r[0].admin_name;
        } else if (user.role === 'VENDOR') {
            const [r] = await db.execute('SELECT vendor_name FROM vendors WHERE user_id = ?', [user.id]);
            if (r.length) displayName = r[0].vendor_name;
        } else if (user.role === 'COLLEGE') {
            const [r] = await db.execute('SELECT college_name FROM colleges WHERE user_id = ?', [user.id]);
            if (r.length) displayName = r[0].college_name;
        } else if (user.role === 'MENTOR') {
            const [r] = await db.execute('SELECT mentor_name FROM mentors WHERE user_id = ?', [user.id]);
            if (r.length) displayName = r[0].mentor_name;
        } else if (user.role === 'STUDENT') {
            const [r] = await db.execute('SELECT student_name FROM students WHERE user_id = ?', [user.id]);
            if (r.length) displayName = r[0].student_name;
        }

        const accessToken = jwt.sign(
            { id: user.id, role: user.role.toUpperCase(), name: displayName, email: user.email }, 
            JWT_SECRET, 
            { expiresIn: JWT_EXPIRES }
        );
        
        return res.status(200).json({
            accessToken,
            role: user.role.toUpperCase(), 
            dashboard: DASHBOARD_PATHS[user.role.toUpperCase()] || '/auth/login',
            user: { id: user.id, username: user.username, email: user.email, role: user.role.toUpperCase(), name: displayName }
        });
    } catch (err) {
        return res.status(500).json({ message: 'An internal server error occurred during login.', error: err.message });
    }
};

exports.logout = (req, res) => {
    return res.status(200).json({ message: 'Logged out successfully.' });
};

exports.getCurrentUser = async (req, res) => {
    return res.status(200).json({ user: req.user });
};

// ─────────────────────────────────────────────────────────────
// POST /api/auth/forgot-password
// ─────────────────────────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    try {
        const cleanEmail = email.trim().toLowerCase();
        const [users] = await db.execute('SELECT id, email, status FROM users WHERE email = ?', [cleanEmail]);

        if (!users.length) {
            return res.status(200).json({ message: 'If an account exists for this email, a reset code has been sent.' });
        }

        const user = users[0];
        if (user.status === 'DISABLED') {
            return res.status(403).json({ message: 'This account has been deactivated. Contact your administrator.' });
        }

        const otp = generateNumericOTP();
        const expiry = new Date(Date.now() + 5 * 60 * 1000);

        await db.execute(
            'INSERT INTO otp_verification (email, otp, purpose, expiry) VALUES (?, ?, "FORGOT_PASSWORD", ?)',
            [cleanEmail, otp, expiry]
        );

        try {
            await sendMail(
                cleanEmail,
                'Reset your LMS Password',
                `<p>Hello,</p><h3>Your password reset code is: ${otp}</h3><p>This code expires in 5 minutes.</p>`
            );
        } catch (mailError) {
            console.log(`[Email Service Offline fallback] Forgot-Password OTP Code: ${otp}`);
        }

        return res.status(200).json({ message: 'If an account exists for this email, a reset code has been sent.' });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to process forgot-password request.', error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────
// POST /api/auth/reset-password
// ─────────────────────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: 'Email, OTP and newPassword are required.' });
    }

    try {
        const cleanEmail = email.trim().toLowerCase();
        const [records] = await db.execute(
            'SELECT * FROM otp_verification WHERE email = ? AND otp = ? AND purpose = "FORGOT_PASSWORD" AND is_used = 0 AND expiry > NOW()',
            [cleanEmail, otp]
        );
        if (!records.length) {
            return res.status(400).json({ message: 'Invalid or expired reset code.' });
        }

        const [users] = await db.execute('SELECT id FROM users WHERE email = ?', [cleanEmail]);
        if (!users.length) {
            return res.status(404).json({ message: 'No account found for this email.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await db.execute(
            'UPDATE users SET password = ?, status = "ACTIVE" WHERE id = ?',
            [hashedPassword, users[0].id]
        );
        await db.execute('UPDATE otp_verification SET is_used = 1 WHERE id = ?', [records[0].id]);

        return res.status(200).json({ message: 'Password reset successfully. You can now log in.' });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to reset password.', error: err.message });
    }
};