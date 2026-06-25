const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superAdminController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Every route here requires a valid JWT AND the SUPER_ADMIN role.
router.use(verifyToken, checkRole(['SUPER_ADMIN']));

router.post('/create-admin', superAdminController.createAdmin);
router.post('/create-vendor', superAdminController.createVendor);
router.post('/create-college', superAdminController.createCollege);
router.post('/assign-vendor', superAdminController.assignVendor);
router.post('/assign-admin', superAdminController.assignAdmin);
router.post('/reset-password', superAdminController.resetPassword);
router.post('/toggle-status', superAdminController.toggleStatus);
router.get('/users', superAdminController.listUsers);
router.delete('/users/:id', superAdminController.deleteUser);
router.get('/colleges', superAdminController.listColleges);

module.exports = router;
