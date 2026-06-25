const bcrypt = require('bcrypt');
const db = require('../config/db');

const SALT_ROUNDS = 12;

// ---------------------------------------------------------------------------
// Helper: resolve the college row owned by the logged-in COLLEGE user
// ---------------------------------------------------------------------------
async function getOwnCollege(userId) {
    const [rows] = await db.execute('SELECT * FROM colleges WHERE user_id = ?', [userId]);
    return rows[0] || null;
}

// ---------------------------------------------------------------------------
// GET /api/college/me
// ---------------------------------------------------------------------------
exports.getMyCollege = async (req, res) => {
    try {
        const college = await getOwnCollege(req.user.id);
        if (!college) return res.status(404).json({ message: 'College profile not found.' });
        return res.status(200).json({ college });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch college profile.', error: err.message });
    }
};

// ---------------------------------------------------------------------------
// POST /api/college/create-mentor
// A COLLEGE user creates a MENTOR account tied to their own college.
// ---------------------------------------------------------------------------
exports.createMentor = async (req, res) => {
    // Destructured parameters matching your database columns (specialization over department)
    const { username, email, password, mentorName, mobile, specialization } = req.body;
    const collegeUserId = req.user.id;

    if (!email || !password || !mentorName) {
        return res.status(400).json({ message: 'mentorName, email and password are required fields.' });
    }

    try {
        const college = await getOwnCollege(collegeUserId);
        if (!college) return res.status(404).json({ message: 'College profile not found for this account.' });

        const cleanEmail = email.trim().toLowerCase();
        const fallbackUsername = username || cleanEmail.split('@')[0];

        // Ensure email isn't duplicated
        const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [cleanEmail]);
        if (existing.length) {
            return res.status(409).json({ message: 'A user with this email already exists.' });
        }

        // Hash password natively before invoking stored procedure
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Execute using your safe transactional database procedure
        await db.execute('SET @o_user_id = 0;');
        await db.execute(
            'CALL sp_CreateMentor(?, ?, ?, ?, ?, ?, ?, @o_user_id)',
            [
                fallbackUsername,
                cleanEmail,
                hashedPassword,
                mentorName,
                mobile || null,
                specialization || null,
                collegeUserId
            ]
        );

        const [resultId] = await db.execute('SELECT @o_user_id AS created_user_id');
        const newMentorUserId = resultId[0]?.created_user_id;

        return res.status(201).json({ 
            message: 'Mentor created successfully using database stored procedure.', 
            mentorId: newMentorUserId 
        });

    } catch (err) {
        return res.status(500).json({ message: 'Failed to create mentor.', error: err.message });
    }
};

// ---------------------------------------------------------------------------
// GET /api/college/mentors
// Lists mentors that belong to the logged-in college.
// ---------------------------------------------------------------------------
exports.listMentors = async (req, res) => {
    try {
        const college = await getOwnCollege(req.user.id);
        if (!college) return res.status(404).json({ message: 'College profile not found.' });

        // Optimized query directly selecting data from your structured database view
        const [mentors] = await db.execute(
            `SELECT user_id, username, email, status, mentor_name, mobile, specialization, role_label, account_created 
             FROM vw_mentor_logins 
             WHERE college_name = ?
             ORDER BY account_created DESC`,
            [college.college_name]
        );
        
        return res.status(200).json({ mentors });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch mentors.', error: err.message });
    }
};