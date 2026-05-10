const BaseDAO = require('./BaseDAO');

class ViewingAppointmentDAO extends BaseDAO {
    constructor() {
        super('viewing_appointment');
    }

    async findById(id) {
        return super.findById(id, 'appointment_id');
    }

    async update(id, updates) {
        return super.update(id, updates, 'appointment_id');
    }

    async delete(id) {
        return super.delete(id, 'appointment_id');
    }

    async findByEmployee(employeeId) {
        return this.findAll({ employee_id: employeeId });
    }

    async findUpcoming(filters = {}) {
        const { page, limit, tenant_id } = filters;
        const pageNum = page ? Math.max(1, parseInt(page, 10)) : 1;
        const limitNum = limit ? Math.max(1, parseInt(limit, 10)) : 50;

        const from = (pageNum - 1) * limitNum;
        const to = from + limitNum - 1;

        let query = this.db
            .from(this.tableName)
            .select(`
                *,
                room:room_id (room_id, room_number, area, room_images, branch:branch_id (name, address)),
                tenant:tenant_id (tenant_id, name, phone),
                employee:employee_id (employee_id, name)
            `, { count: 'exact' })
            .order('appointment_time', { ascending: true })
            .range(from, to);

        if (tenant_id) query = query.eq('tenant_id', tenant_id);

        const { data, count, error } = await query;
        if (error) throw error;

        return {
            data,
            pagination: {
                page: pageNum,
                limit: limitNum,
                totalItems: count || 0,
                totalPages: Math.ceil((count || 0) / limitNum)
            }
        };
    }
}

module.exports = new ViewingAppointmentDAO();
