const BaseDAO = require('./BaseDAO');

class BedDAO extends BaseDAO {
    constructor() {
        super('bed');
    }

    async findById(id) {
        return super.findById(id, 'bed_id');
    }

    async update(id, updates) {
        return super.update(id, updates, 'bed_id');
    }

    async delete(id) {
        return super.delete(id, 'bed_id');
    }

    async findAvailableByRoom(roomId) {
        const { data, error } = await this.db
            .from(this.tableName)
            .select('*')
            .eq('room_id', roomId)
            .eq('status', 'Empty');
        if (error) throw error;
        return data;
    }

    async updateStatusMany(bedIds, status) {
        const { data, error } = await this.db
            .from(this.tableName)
            .update({ status })
            .in('bed_id', bedIds)
            .select();
        if (error) throw error;
        return data;
    }

    async updatePricesByRoom(roomId, price) {
        const { data, error } = await this.db
            .from(this.tableName)
            .update({ price })
            .eq('room_id', roomId)
            .select();
        if (error) throw error;
        return data;
    }

    async createMany(beds) {
        const { data, error } = await this.db
            .from(this.tableName)
            .insert(beds)
            .select();
        if (error) throw error;
        return data;
    }
}

module.exports = new BedDAO();
