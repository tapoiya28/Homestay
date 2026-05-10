const express = require('express');
const router = express.Router();
const viewingAppointmentBUS = require('../bus/ViewingAppointmentBUS');
const authenticate = require('../middlewares/authenticate');

router.get('/', authenticate, async (req, res, next) => {
    try {
        // Tự động lọc theo tenant_id từ token — khách chỉ thấy lịch của mình
        const tenantId = req.user.tenant_id;
        const result = await viewingAppointmentBUS.getUpcomingAppointments({
            ...req.query,
            tenant_id: tenantId
        });
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
});
router.post('/', async (req, res, next) => {
    try {
        const result = await viewingAppointmentBUS.createViewingAppointment(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) { next(error); }
});
router.put('/:id/confirm', authenticate, async (req, res, next) => {
    try {
        const employeeId = req.user.employee_id;
        const result = await viewingAppointmentBUS.confirmAppointment(req.params.id, employeeId);
        res.json({ success: true, data: result });
    } catch (error) { next(error); }
});
router.delete('/:id', async (req, res, next) => {
    try {
        const result = await viewingAppointmentBUS.deleteAppointment(req.params.id);
        res.json({ success: true, data: result });
    } catch (error) { next(error); }
});
router.put('/:id', async (req, res, next) => {
    try {
        const result = await viewingAppointmentBUS.updateAppointment(req.params.id, req.body);
        res.json({ success: true, data: result });
    } catch (error) { next(error); }
});

module.exports = router;
