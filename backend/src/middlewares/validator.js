const { validationResult } = require('express-validator');


const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Dữ liệu không hợp lệ');
        error.type = 'validation';
        error.errors = errors.array().map(err => ({
            field: err.path,
            message: err.msg,
            value: err.value
        }));
        return next(error);
    }
    next();
};


const createBusinessError = (message) => {
    const error = new Error(message);
    error.type = 'business';
    return error;
};

module.exports = { validate, createBusinessError };
