const express = require('express');
const router = express.Router();
const authBUS = require('../bus/AuthBUS');
const authenticate = require('../middlewares/authenticate');

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authBUS.login(email, password);
        return res.status(200).json({ success: true, message: 'Đăng nhập thành công', data: result });
    } catch (err) { next(err); }
});

router.get('/me', authenticate, async (req, res, next) => {
    try {
        const account = await authBUS.getMe(req.user.account_id);
        return res.status(200).json({ success: true, data: account });
    } catch (err) { next(err); }
});

router.put('/me', authenticate, async (req, res, next) => {
    try {
        const account = await authBUS.updateProfile(req.user.account_id, req.body);
        return res.status(200).json({ success: true, message: 'Cập nhật thông tin thành công', data: account });
    } catch (err) { next(err); }
});

router.post('/register', async (req, res, next) => {
    try {
        const { email, password, role, employee_id, tenant_id } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ success: false, message: 'email, password và role là bắt buộc' });
        }
        const validRoles = ['admin', 'employee', 'customer'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ success: false, message: `role phải là một trong: ${validRoles.join(', ')}` });
        }
        const newAccount = await authBUS.register({ email, password, role, employeeId: employee_id || null, tenantId: tenant_id || null });
        return res.status(201).json({ success: true, message: 'Tạo tài khoản thành công', data: newAccount });
    } catch (err) { next(err); }
});

router.post('/forgot-password', async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await authBUS.forgotPassword(email);
        return res.status(200).json({ success: true, ...result });
    } catch (err) { next(err); }
});

router.post('/reset-password', async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;
        const result = await authBUS.resetPassword(email, otp, newPassword);
        return res.status(200).json({ success: true, ...result });
    } catch (err) { next(err); }
});

module.exports = router;
