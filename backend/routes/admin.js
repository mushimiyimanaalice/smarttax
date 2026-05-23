// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { geoScopeAuth } = require('../middleware/geoScopeAuth');
const activityController = require('../controllers/activityController');

router.use(protect);
router.use(authorize('sector_admin', 'district_admin', 'provincial_admin', 'national_admin'));
router.use(geoScopeAuth);

router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/businesses/pending', adminController.getPendingBusinesses);
router.get('/businesses/all', adminController.getAllBusinesses);
router.post('/businesses/:id/approve', adminController.approveBusiness);
router.post('/businesses/:id/reject', adminController.rejectBusiness);
router.get('/inactivity', activityController.getInactivityReportsForAdmin);
router.patch('/inactivity/:id/review', activityController.reviewReport);
router.get('/tax-revenue', adminController.getTaxRevenue);
router.get('/compliance-reports', adminController.getComplianceReports);
router.get('/businesses/geographic', adminController.getBusinessesByGeography);
router.get('/reports/tax-collection', adminController.getTaxCollectionReport);
router.post('/businesses/:id/suspend', adminController.suspendBusiness);
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;