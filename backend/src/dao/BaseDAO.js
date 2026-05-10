const supabase = require('../config/supabase');

class BaseDAO {
    constructor(tableName) {
        this.tableName = tableName;
        this.db = supabase.getClient();
    }

    async findAll(filters = {}, select = '*') {
        const { page, limit, ...queryFilters } = filters;
        const pageNum = page ? Math.max(1, parseInt(page, 10)) : 1;
        const limitNum = limit ? Math.max(1, parseInt(limit, 10)) : 10;

        let query = this.db.from(this.tableName).select(select, { count: 'exact' });

        Object.entries(queryFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                query = query.eq(key, value);
            }
        });

        const from = (pageNum - 1) * limitNum;
        const to = from + limitNum - 1;
        query = query.range(from, to);

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

    async findById(id, idColumn = 'id', select = '*') {
        const { data, error } = await this.db
            .from(this.tableName)
            .select(select)
            .eq(idColumn, id)
            .single();
        if (error) throw error;
        return data;
    }

    async create(entity) {
        const { data, error } = await this.db
            .from(this.tableName)
            .insert(entity)
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async createMany(entities) {
        const { data, error } = await this.db
            .from(this.tableName)
            .insert(entities)
            .select();
        if (error) throw error;
        return data;
    }

    async update(id, updates, idColumn = 'id') {
        const { data, error } = await this.db
            .from(this.tableName)
            .update(updates)
            .eq(idColumn, id)
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async delete(id, idColumn = 'id') {
        const { data, error } = await this.db
            .from(this.tableName)
            .delete()
            .eq(idColumn, id)
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async count(filters = {}) {
        let query = this.db.from(this.tableName).select('*', { count: 'exact', head: true });

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                query = query.eq(key, value);
            }
        });

        const { count, error } = await query;
        if (error) throw error;
        return count;
    }
}

module.exports = BaseDAO;
