/**
 * Base DTO class with validation support.
 * All DTOs extend this class and define their own validation rules.
 */
class BaseDTO {
    /**
     * @param {Object} data - Raw input data
     * @param {Array} rules - Validation rules array
     */
    constructor(data = {}, rules = []) {
        this._errors = [];
        this._rules = rules;
        this._rawData = data;
    }

    /**
     * Validate the DTO against its rules.
     * @returns {{ valid: boolean, errors: Array }}
     */
    validate() {
        this._errors = [];

        for (const rule of this._rules) {
            const value = this._rawData[rule.field];

            // Required check
            if (rule.required && (value === undefined || value === null || value === '')) {
                this._errors.push({
                    field: rule.field,
                    message: rule.message || `${rule.field} is required`
                });
                continue;
            }

            // Skip further checks if value is absent and not required
            if (value === undefined || value === null) continue;

            // Type check
            if (rule.type) {
                if (rule.type === 'array' && !Array.isArray(value)) {
                    this._errors.push({
                        field: rule.field,
                        message: `${rule.field} must be an array`
                    });
                    continue;
                }
                if (rule.type === 'number' && typeof value !== 'number' && isNaN(Number(value))) {
                    this._errors.push({
                        field: rule.field,
                        message: `${rule.field} must be a number`
                    });
                    continue;
                }
                if (rule.type === 'string' && typeof value !== 'string') {
                    this._errors.push({
                        field: rule.field,
                        message: `${rule.field} must be a string`
                    });
                    continue;
                }
                if (rule.type === 'date') {
                    const parsed = new Date(value);
                    if (isNaN(parsed.getTime())) {
                        this._errors.push({
                            field: rule.field,
                            message: `${rule.field} must be a valid date`
                        });
                        continue;
                    }
                }
                if (rule.type === 'integer') {
                    if (!Number.isInteger(Number(value))) {
                        this._errors.push({
                            field: rule.field,
                            message: `${rule.field} must be an integer`
                        });
                        continue;
                    }
                }
            }

            // Enum check
            if (rule.enum && !rule.enum.includes(value)) {
                this._errors.push({
                    field: rule.field,
                    message: `${rule.field} must be one of: ${rule.enum.join(', ')}`
                });
            }

            // Min length
            if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
                this._errors.push({
                    field: rule.field,
                    message: `${rule.field} must be at least ${rule.minLength} characters`
                });
            }

            // Max length
            if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
                this._errors.push({
                    field: rule.field,
                    message: `${rule.field} must be at most ${rule.maxLength} characters`
                });
            }

            // Min value (for numbers)
            if (rule.min !== undefined) {
                const num = Number(value);
                if (num < rule.min) {
                    this._errors.push({
                        field: rule.field,
                        message: `${rule.field} must be at least ${rule.min}`
                    });
                }
            }

            // Custom validator
            if (rule.custom && typeof rule.custom === 'function') {
                const customError = rule.custom(value, this._rawData);
                if (customError) {
                    this._errors.push({
                        field: rule.field,
                        message: customError
                    });
                }
            }
        }

        return {
            valid: this._errors.length === 0,
            errors: this._errors
        };
    }

    /**
     * Convert to plain object (only defined fields from rules).
     * @returns {Object}
     */
    toJSON() {
        const result = {};
        for (const rule of this._rules) {
            if (this._rawData[rule.field] !== undefined) {
                result[rule.field] = this._rawData[rule.field];
            }
        }
        return result;
    }

    /**
     * Wrap a paginated result (from repository) with a serializer function.
     * Handles both paginated { data, pagination } and plain array responses.
     * @param {Object|Array} result - Raw result from service/repository
     * @param {Function} serializerFn - Function to serialize each item
     * @returns {Object} { data: [...], pagination?: {...} }
     */
    static serializeList(result, serializerFn) {
        if (result && result.pagination) {
            return {
                data: (result.data || []).map(serializerFn),
                pagination: result.pagination
            };
        }
        const items = Array.isArray(result) ? result : [];
        return { data: items.map(serializerFn) };
    }
}

module.exports = BaseDTO;
