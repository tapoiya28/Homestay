const BaseDAO = require('./BaseDAO');

class TenantDAO extends BaseDAO {
    constructor() {
        super('tenant');
    }

    async findById(id) {
        return super.findById(id, 'tenant_id');
    }

    async update(id, updates) {
        return super.update(id, updates, 'tenant_id');
    }
}

module.exports = new TenantDAO();
