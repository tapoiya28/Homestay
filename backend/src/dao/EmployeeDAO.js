const BaseDAO = require('./BaseDAO');

class EmployeeDAO extends BaseDAO {
    constructor() {
        super('employee');
    }

    async findById(id) {
        return super.findById(id, 'employee_id');
    }

    async update(id, updates) {
        return super.update(id, updates, 'employee_id');
    }

    async delete(id) {
        return super.delete(id, 'employee_id');
    }

    async findByBranch(branchId) {
        return this.findAll({ branch_id: branchId });
    }

    async findByRole(role, filters = {}) {
        return this.findAll({ role, ...filters });
    }
}

module.exports = new EmployeeDAO();
