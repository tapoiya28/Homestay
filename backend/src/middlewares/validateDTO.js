const validateDTO = (DTOClass) => {
    return (req, res, next) => {
        const dto = new DTOClass(req.body);
        const { valid, errors } = dto.validate();

        if (!valid) {
            const error = new Error('Validation failed');
            error.type = 'validation';
            error.errors = errors;
            return next(error);
        }

        // Attach validated DTO to request for controller use
        req.dto = dto;
        next();
    };
};

module.exports = { validateDTO };
