const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Supabase errors
    if (err.code && err.message) {
        // Not found
        if (err.code === 'PGRST116') {
            return res.status(404).json({
                success: false,
                message: 'Data not found',
                error: err.message
            });
        }

        // Unique violation
        if (err.code === '23505') {
            return res.status(409).json({
                success: false,
                message: 'Data already exists',
                error: err.message
            });
        }

        // Foreign key violation
        if (err.code === '23503') {
            return res.status(400).json({
                success: false,
                message: 'Invalid reference data',
                error: err.message
            });
        }
    }

    // Validation errors
    if (err.type === 'validation') {
        return res.status(400).json({
            success: false,
            message: 'Invalid data',
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
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;
