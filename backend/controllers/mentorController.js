// backend/controllers/mentorController.js
const db = require("../config/db");
const bcrypt = require("bcrypt");

// ── CREATE MENTOR ─────────────────────────────────────────────────────────────
const createMentor = async (req, res) => {
  console.log('[createMentor] req.body:', req.body);
  console.log('[createMentor] req.user:', req.user);

  // ✅ Accept both mentorName (frontend) and mentor_name (API style)
  const {
    username,
    email,
    password,
    mentorName,
    mentor_name,
    mobile,
    specialization,
    assigned_batch,
    role_label
  } = req.body;

  const finalMentorName = mentorName || mentor_name;

  if (!username || !email || !password || !finalMentorName || !mobile) {
    return res.status(400).json({ 
      message: "username, email, password, mentor_name and mobile are required.",
      received: { username, email, finalMentorName, mobile }
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    // ✅ 7 IN params + 1 OUT — matches sp_CreateMentor exactly
    await db.query(
      `CALL sp_CreateMentor(?, ?, ?, ?, ?, ?, ?, @o_user_id)`,
      [
        username,
        email,
        hashedPassword,
        finalMentorName,
        mobile,
        specialization || null,
        req.user.id          // ✅ creator_id = logged-in college user
      ]
    );

    const [[{ o_user_id }]] = await db.query(`SELECT @o_user_id AS o_user_id`);

    if (assigned_batch || role_label) {
      await db.query(
        `UPDATE mentors SET assigned_batch = ?, role_label = ? WHERE user_id = ?`,
        [assigned_batch || null, role_label || "Co-Mentor", o_user_id]
      );
    }

    return res.status(201).json({
      message: "Mentor account created successfully.",
      user_id: o_user_id,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email or username already exists." });
    }
    console.error("createMentor error:", err);
    return res.status(500).json({ message: "Internal server error.", error: err.message });
  }
};

// ── SET MENTOR STATUS ─────────────────────────────────────────────────────────
const setMentorStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowed = ["ACTIVE", "DISABLED", "LOCKED"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: `status must be one of: ${allowed.join(", ")}` });
  }

  try {
    await db.query(`CALL sp_SetMentorStatus(?, ?)`, [id, status]);
    return res.status(200).json({ message: "Mentor status updated.", status });
  } catch (err) {
    console.error("setMentorStatus error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ── RESET MENTOR PASSWORD ─────────────────────────────────────────────────────
const resetMentorPassword = async (req, res) => {
  const { id } = req.params;
  const { new_password } = req.body;

  if (!new_password || new_password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }

  try {
    const hashedPassword = await bcrypt.hash(new_password, 12);
    await db.query(`CALL sp_ResetMentorPassword(?, ?)`, [id, hashedPassword]);
    return res.status(200).json({ message: "Password reset successfully." });
  } catch (err) {
    console.error("resetMentorPassword error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ── GET ALL MENTORS ───────────────────────────────────────────────────────────
const getAllMentors = async (req, res) => {
  try {
    const [mentors] = await db.query(`SELECT * FROM vw_mentor_logins`);
    return res.status(200).json({ mentors });
  } catch (err) {
    console.error("getAllMentors error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { createMentor, setMentorStatus, resetMentorPassword, getAllMentors };