const bcrypt = require('bcrypt');
const db = require('../config/db');

const SALT_ROUNDS = 12;

// Map UI role labels → DB enum values
// NOTE: keys must match the labels used by the frontend CreateAdminModal / constants.js
const ROLE_MAP = {
    'Restricted Super Admin': 'ADMIN',
    'Org Admin': 'ORGANIZATION',
    'Vendor Admin':           'VENDOR',
    'ADMIN':                  'ADMIN',
    'VENDOR':                 'VENDOR',
    'COLLEGE':                'COLLEGE',
};

// ─────────────────────────────────────────────────────────────
// POST /api/superadmin/create-admin
// ─────────────────────────────────────────────────────────────
exports.createAdmin = async (req, res) => {
    const { firstName, lastName, email, password, role, org, collegeId } = req.body;
    const creatorId = req.user?.id || null;

    if (!firstName || !lastName || !email || !password || !role) {
        return res.status(400).json({ message: 'firstName, lastName, email, password, and role are required.' });
    }

    const dbRole = ROLE_MAP[role] || 'ADMIN';
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const cleanEmail = email.trim().toLowerCase();

    try {
        const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [cleanEmail]);
        if (existing.length) {
            return res.status(409).json({ message: 'A user with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            // 1. Insert into users table with correct role
            const [userResult] = await conn.execute(
                `INSERT INTO users (username, email, password, role, created_by, status, is_verified)
                 VALUES (?, ?, ?, ?, ?, 'ACTIVE', 1)`,
                [cleanEmail.split('@')[0], cleanEmail, hashedPassword, dbRole, creatorId]
            );
            const userId = userResult.insertId;

            // 2. Insert into correct sub-table based on role
            if (dbRole === 'ADMIN') {
                // College Admin → admins table
                await conn.execute(
                    'INSERT INTO admins (user_id, admin_name) VALUES (?, ?)',
                    [userId, fullName]
                );
            } else if (dbRole === 'VENDOR') {
                // Vendor Admin → vendors table
                await conn.execute(
                    'INSERT INTO vendors (user_id, vendor_name) VALUES (?, ?)',
                    [userId, org || fullName]
                );
            }

            await conn.commit();

            return res.status(201).json({
                message: `${role} "${fullName}" created successfully.`,
                user: { id: userId, email: cleanEmail, role: dbRole }
            });

        } catch (txErr) {
            await conn.rollback();
            throw txErr;
        } finally {
            conn.release();
        }

    } catch (err) {
        console.error('[superAdminController.createAdmin]', err);
        return res.status(500).json({ message: 'Failed to create admin.', error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────
// POST /api/superadmin/create-vendor
// ─────────────────────────────────────────────────────────────
exports.createVendor = async (req, res) => {
    const { vendorName, username, email, password } = req.body;
    const creatorId = req.user?.id || null;

    if (!vendorName || !email || !password) {
        return res.status(400).json({ message: 'vendorName, email and password are required.' });
    }

    try {
        const [existing] = await db.execute(
            'SELECT id FROM users WHERE email = ? OR username = ?',
            [email, username || null]
        );
        if (existing.length) {
            return res.status(400).json({ message: 'A user with this email or username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const [userResult] = await db.execute(
            `INSERT INTO users (username, email, password, role, created_by, status, is_verified)
             VALUES (?, ?, ?, 'VENDOR', ?, 'ACTIVE', 1)`,
            [username || null, email, hashedPassword, creatorId]
        );
        const userId = userResult.insertId;

        await db.execute(
            'INSERT INTO vendors (user_id, vendor_name) VALUES (?, ?)',
            [userId, vendorName]
        );

        return res.status(201).json({ message: 'Vendor created successfully.', vendorId: userId });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to create vendor.', error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────
// POST /api/superadmin/create-college
// Creates the college record AND a COLLEGE login account (users + colleges)
// ─────────────────────────────────────────────────────────────
exports.createCollege = async (req, res) => {
    const { collegeName, collegeCode, address, email, phone, password } = req.body;
    const creatorId = req.user?.id || null;

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

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const [userResult] = await conn.execute(
                `INSERT INTO users (username, email, password, role, created_by, status, is_verified)
                 VALUES (?, ?, ?, 'COLLEGE', ?, 'ACTIVE', 1)`,
                [collegeCode, cleanEmail, hashedPassword, creatorId]
            );
            const userId = userResult.insertId;

            const [result] = await conn.execute(
                `INSERT INTO colleges (college_name, college_code, address, email, phone, created_by, user_id, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
                [collegeName, collegeCode, address || null, cleanEmail, phone || null, creatorId, userId]
            );

            await conn.commit();
            return res.status(201).json({ message: 'College created successfully.', collegeId: result.insertId, userId });
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

// ─────────────────────────────────────────────────────────────
// POST /api/superadmin/assign-vendor
// ─────────────────────────────────────────────────────────────
exports.assignVendor = async (req, res) => {
    const { vendorId, collegeId, collegeIds } = req.body;
    const ids = collegeIds && Array.isArray(collegeIds) ? collegeIds : (collegeId ? [collegeId] : []);

    if (!vendorId || !ids.length) {
        return res.status(400).json({ message: 'vendorId and at least one collegeId are required.' });
    }

    try {
        const [vendor] = await db.execute(
            "SELECT id FROM users WHERE id = ? AND role = 'VENDOR'",
            [vendorId]
        );
        if (!vendor.length) return res.status(404).json({ message: 'Vendor not found.' });

        for (const cid of ids) {
            await db.execute(
                'INSERT INTO vendor_colleges (vendor_id, college_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE assigned_at = assigned_at',
                [vendorId, cid]
            );
        }

        return res.status(200).json({ message: 'Vendor assigned successfully.' });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to assign vendor.', error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────
// POST /api/superadmin/assign-admin
// ─────────────────────────────────────────────────────────────
exports.assignAdmin = async (req, res) => {
    const { adminId, collegeId } = req.body;

    if (!adminId || !collegeId) {
        return res.status(400).json({ message: 'adminId and collegeId are required.' });
    }

    try {
        const [admin] = await db.execute(
            "SELECT id FROM users WHERE id = ? AND role = 'ADMIN'",
            [adminId]
        );
        if (!admin.length) return res.status(404).json({ message: 'Admin not found.' });

        const [college] = await db.execute('SELECT id FROM colleges WHERE id = ?', [collegeId]);
        if (!college.length) return res.status(404).json({ message: 'College not found.' });

        await db.execute('UPDATE colleges SET assigned_admin = ? WHERE id = ?', [adminId, collegeId]);

        return res.status(200).json({ message: 'Admin assigned successfully.' });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to assign admin.', error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────
// POST /api/superadmin/reset-password
// ─────────────────────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
        return res.status(400).json({ message: 'userId and newPassword are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        const [result] = await db.execute(
            'UPDATE users SET password = ?, failed_attempts = 0, lock_until = NULL WHERE id = ?',
            [hashedPassword, userId]
        );
        if (!result.affectedRows) return res.status(404).json({ message: 'User not found.' });

        return res.status(200).json({ message: 'Password reset successfully.' });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to reset password.', error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────
// POST /api/superadmin/toggle-status
// ─────────────────────────────────────────────────────────────
exports.toggleStatus = async (req, res) => {
    const { userId, status } = req.body;

    if (!userId || !['ACTIVE', 'DISABLED'].includes(status)) {
        return res.status(400).json({ message: "userId and valid status required." });
    }

    try {
        const [rows] = await db.execute('SELECT role FROM users WHERE id = ?', [userId]);
        if (!rows.length) return res.status(404).json({ message: 'User not found.' });
        if (rows[0].role === 'SUPER_ADMIN') {
            return res.status(403).json({ message: 'Super Admin cannot be modified.' });
        }

        await db.execute('UPDATE users SET status = ? WHERE id = ?', [status, userId]);
        return res.status(200).json({ message: `User status updated to ${status}.` });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to update status.', error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/superadmin/users
// ─────────────────────────────────────────────────────────────
exports.listUsers = async (req, res) => {
    const { role } = req.query;

    try {
        let query = 'SELECT id, username, email, role, status, created_by, created_at FROM users';
        const params = [];
        if (role) {
            query += ' WHERE role = ?';
            params.push(role);
        }
        query += ' ORDER BY created_at DESC';

        const [users] = await db.execute(query, params);
        return res.status(200).json({ users });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch users.', error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/superadmin/admins
// ─────────────────────────────────────────────────────────────
exports.getAdmins = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT u.id, u.email, u.role, u.status, a.admin_name AS name, u.created_at
            FROM users u
            JOIN admins a ON u.id = a.user_id
            WHERE u.role = 'ADMIN'
            ORDER BY u.id DESC
        `);
        return res.status(200).json({ users: rows });
    } catch (err) {
        console.error('[superAdminController.getAdmins]', err);
        return res.status(500).json({ message: 'Server error fetching admins.' });
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/superadmin/organizations
// ─────────────────────────────────────────────────────────────
exports.getOrganizations = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT u.id, u.email, u.role, u.status, 
                   o.organization_name AS name, o.org_code, o.created_at
            FROM users u
            JOIN organizations o ON u.id = o.user_id
            WHERE u.role = 'ORGANIZATION'
            ORDER BY u.id DESC
        `);
        return res.status(200).json({ organizations: rows });
    } catch (err) {
        console.error('[superAdminController.getOrganizations]', err);
        return res.status(500).json({ message: 'Server error fetching organizations.' });
    }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/superadmin/users/:id
// ─────────────────────────────────────────────────────────────
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.execute('SELECT role FROM users WHERE id = ?', [id]);
        if (!rows.length) return res.status(404).json({ message: 'User not found.' });
        if (rows[0].role === 'SUPER_ADMIN') {
            return res.status(403).json({ message: 'Super Admin cannot be deleted.' });
        }

        await db.execute('DELETE FROM users WHERE id = ?', [id]);
        return res.status(200).json({ message: 'User deleted successfully.' });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to delete user.', error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/superadmin/colleges
// ─────────────────────────────────────────────────────────────
exports.listColleges = async (req, res) => {
    try {
        const [colleges] = await db.execute('SELECT * FROM colleges ORDER BY created_at DESC');
        return res.status(200).json({ colleges });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch colleges.', error: err.message });
    }
};