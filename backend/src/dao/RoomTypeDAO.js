const BaseDAO = require('./BaseDAO');

class RoomTypeDAO extends BaseDAO {
    constructor() {
        super('room_type');
    }

    async findById(id) {
        return super.findById(id, 'room_type_id');
    }

    async update(id, updates) {
        return super.update(id, updates, 'room_type_id');
    }

    async delete(id) {
        return super.delete(id, 'room_type_id');
    }
}

module.exports = new RoomTypeDAO();
