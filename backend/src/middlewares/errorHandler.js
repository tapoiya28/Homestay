const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Supabase errors
    if (err.code && err.message) {
        // Not found
        if (err.code === 'PGRST116') {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy dữ liệu yêu cầu',
                error: err.message
            });
        }

        // Unique violation
        if (err.code === '23505') {
            return res.status(409).json({
                success: false,
                message: 'Tài khoản với thông tin này đã tồn tại, vui lòng đăng nhập để tiếp tục',
                error: err.message
            });
        }

        // Foreign key violation
        if (err.code === '23503') {
            return res.status(400).json({
                success: false,
                message: 'Dữ liệu tham chiếu không hợp lệ',
                error: err.message
            });
        }
    }

    // Validation errors
    if (err.type === 'validation') {
        return res.status(400).json({
            success: false,
            message: 'Dữ liệu cung cấp không hợp lệ, vui lòng kiểm tra lại',
            errors: err.errors
        });
    }

    // Business logic errors
    if (err.type === 'business') {
        return res.status(422).json({
            success: false,
            message: err.message
        });
    }

    // Generic errors
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Đã xảy ra lỗi hệ thống, vui lòng thử lại sau',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;
