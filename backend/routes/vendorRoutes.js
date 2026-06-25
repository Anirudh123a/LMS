const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Every route here requires a valid JWT AND the VENDOR role.
router.use(verifyToken, checkRole(['VENDOR']));

router.post('/create-college', vendorController.createCollege);
router.get('/colleges', vendorController.listMyColleges);

module.exports = router;