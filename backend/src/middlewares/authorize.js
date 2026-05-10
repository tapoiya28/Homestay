
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Chưa xác thực. Hãy dùng middleware authenticate trước.'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Bạn không có quyền truy cập. Yêu cầu role: ${allowedRoles.join(' hoặc ')}.`
            });
        }

        next();
    };
};

module.exports = authorize;
