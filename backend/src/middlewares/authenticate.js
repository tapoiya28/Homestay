const authBUS = require('../bus/AuthBUS');

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Bạn chưa đăng nhập. Vui lòng cung cấp token.'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = authBUS.verifyToken(token);
        req.user = {
            account_id: decoded.account_id,
            username: decoded.username,
            role: decoded.role,
            employee_id: decoded.employee_id || null,
            tenant_id: decoded.tenant_id || null
        };
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: err.message || 'Token không hợp lệ hoặc đã hết hạn'
        });
    }
};

module.exports = authenticate;
