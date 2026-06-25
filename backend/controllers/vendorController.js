const db = require('../config/db');
const bcrypt = require('bcrypt');

// ---------------------------------------------------------------------------
// POST /api/vendor/create-college
// Only a logged-in Vendor can hit this; created_by is forced to req.user.id,
// never trusted from the request body. Also creates the COLLEGE login account.
// ---------------------------------------------------------------------------
exports.createCollege = async (req, res) => {
    const { collegeName, collegeCode, address, email, phone, password } = req.body;
    const vendorId = req.user.id;

    if (!collegeName || !collegeCode || !email || !password) {
        return res.status(400).json({ message: 'collegeName, collegeCode, email and password are required.' });
    }

    try {
        const [existingCode] = await db.execute('SELECT id FROM colleges WHERE college_code = ?', [collegeCode]);
        if (existingCode.length) {
            return res.status(400).json({ message: 'A college with this code already exists.' });
        }
        const cleanEmail = email.trim().toLowerCase();
        const [existingUser] = await db.execute('SELECT id FROM users WHERE email = ?', [cleanEmail]);
        if (existingUser.length) {
            return res.status(400).json({ message: 'A user with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const [userResult] = await conn.execute(
                `INSERT INTO users (username, email, password, role, created_by, status, is_verified)
                 VALUES (?, ?, ?, 'COLLEGE', ?, 'ACTIVE', 1)`,
                [collegeCode, cleanEmail, hashedPassword, vendorId]
            );
            const userId = userResult.insertId;

            const [result] = await conn.execute(
                `INSERT INTO colleges (college_name, college_code, address, email, phone, created_by, user_id, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
                [collegeName, collegeCode, address || null, cleanEmail, phone || null, vendorId, userId]
            );
            const collegeId = result.insertId;

            // Automatically link the creating vendor to the college they just made
            await conn.execute(
                'INSERT INTO vendor_colleges (vendor_id, college_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE assigned_at = assigned_at',
                [vendorId, collegeId]
            );

            await conn.commit();
            return res.status(201).json({ message: 'College created successfully.', collegeId, userId });
        } catch (txErr) {
            await conn.rollback();
            throw txErr;
        } finally {
            conn.release();
        }
    } catch (err) {
        return res.status(500).json({ message: 'Failed to create college.', error: err.message });
    }
};

// ---------------------------------------------------------------------------
// GET /api/vendor/colleges
// Returns colleges created by this vendor OR explicitly assigned to them
// by a Super Admin.
// ---------------------------------------------------------------------------
exports.listMyColleges = async (req, res) => {
    const vendorId = req.user.id;

    try {
        const [colleges] = await db.execute(
            `SELECT DISTINCT c.* FROM colleges c
             LEFT JOIN vendor_colleges vc ON vc.college_id = c.id
             WHERE c.created_by = ? OR vc.vendor_id = ?
             ORDER BY c.created_at DESC`,
            [vendorId, vendorId]
        );
        return res.status(200).json({ colleges });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch colleges.', error: err.message });
    }
};