const express = require('express');
const router = express.Router();
const collegeController = require('../controllers/collegeController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Every route here requires a valid JWT AND the COLLEGE role.
router.use(verifyToken, checkRole(['COLLEGE']));

router.get('/me', collegeController.getMyCollege);
router.post('/create-mentor', collegeController.createMentor);
router.get('/mentors', collegeController.listMentors);

module.exports = router;
