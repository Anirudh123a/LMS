const express = require("express");
const router = express.Router();

const mentorController = require("../controllers/mentorController");
const { verifyToken, checkRole } = require("../middleware/auth");

router.use(verifyToken);

// Temporary debug middleware
router.use((req, res, next) => {
    console.log('[mentorRoutes] user:', req.user);
        console.log('[mentorRoutes] role:', req.user?.role);  // ← add this
    next();
});

router.get(
    "/", 
    checkRole(["COLLEGE", "SUPER_ADMIN", "ADMIN"]), 
    mentorController.getAllMentors
);

router.post(
    "/create", 
    checkRole(["COLLEGE", "SUPER_ADMIN", "ADMIN"]), 
    mentorController.createMentor
);

router.patch(
    "/:id/status",
    checkRole(["COLLEGE", "SUPER_ADMIN", "ADMIN"]),
    mentorController.setMentorStatus
);

router.patch(
    "/:id/reset-password",
    checkRole(["COLLEGE", "SUPER_ADMIN", "ADMIN"]),
    mentorController.resetMentorPassword
);

module.exports = router;