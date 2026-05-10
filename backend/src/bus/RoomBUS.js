const roomDAO = require('../dao/RoomDAO');
const bedDAO = require('../dao/BedDAO');
const roomTypeDAO = require('../dao/RoomTypeDAO');
const cloudinaryBUS = require('./CloudinaryBUS');

class RoomBUS {
    async getAllRooms(filters = {}) {
        const parseBoolean = (value, defaultValue = false) => {
            if (value === undefined || value === null || value === '') return defaultValue;
            if (typeof value === 'boolean') return value;
            const normalized = String(value).trim().toLowerCase();
            if (['true', '1', 'yes', 'y'].includes(normalized)) return true;
            if (['false', '0', 'no', 'n'].includes(normalized)) return false;
            return defaultValue;
        };

        const parseNumber = (value) => {
            if (value === undefined || value === null || value === '') return undefined;
            const num = Number(value);
            return Number.isFinite(num) ? num : undefined;
        };

        // By default, list ALL rooms. If caller wants only available rooms,
        // they must pass only_available=true.
        const normalizedFilters = {
            ...filters,
            only_available: parseBoolean(filters.only_available, false),
            is_full: filters.is_full !== undefined && filters.is_full !== '' ? parseBoolean(filters.is_full) : undefined,
            branch_id: parseNumber(filters.branch_id) ?? filters.branch_id,
            room_type_id: parseNumber(filters.room_type_id) ?? filters.room_type_id,
            people_count: parseNumber(filters.people_count) ?? filters.people_count,
            min_price: parseNumber(filters.min_price ?? filters.minPrice),
            max_price: parseNumber(filters.max_price ?? filters.maxPrice),
            price_level: parseNumber(filters.price_level) ?? filters.price_level,
            room_number: String(filters.room_number ?? ''),
            available_beds: parseNumber(filters.available_beds),
            sign: filters.sign,
            search: filters.search,
        };


        const result = await roomDAO.findAvailable(normalizedFilters);
        if (result.data) {
            result.data = result.data.map(room => this._formatRoom(room));
        }
        return result;
    }

    _formatRoom(room) {
        if (!room) return null;
        const formatted = { ...room };

        // Handle beds (rename from 'bed' and ensure price is number)
        if (room.bed) {
            formatted.beds = room.bed.map(b => ({
                ...b,
                price: Number(b.price || 0)
            }));
            delete formatted.bed;
        } else {
            formatted.beds = room.beds || [];
        }

        // Handle room_type (ensure it's an object)
        if (!formatted.room_type) {
            formatted.room_type = { room_type_id: room.room_type_id || 0, name: 'Phòng' };
        }

        // Handle branch (ensure it's an object)
        if (!formatted.branch) {
            formatted.branch = { branch_id: room.branch_id || 0, address: '', phone_number: '', email: '' };
        }

        // Handle room_images (ensure it's an array)
        if (!formatted.room_images) {
            formatted.room_images = [];
        }

        return formatted;
    }

    async getRoomById(roomId) {
        const room = await roomDAO.findById(roomId);
        if (!room) throw Object.assign(new Error('Room not found'), { type: 'business' });
        return this._formatRoom(room);
    }

    async createRoom(data) {
        const { bed_price, ...roomData } = data;

        if (roomData.branch_id) {
            const maxNumber = await roomDAO.getMaxRoomNumberForBranch(roomData.branch_id);
            roomData.room_number = maxNumber + 1;
        }

        // Sequential calls for room and beds
        const room = await roomDAO.create(roomData);

        if (room && room.total_beds > 0) {
            const beds = Array.from({ length: room.total_beds }, () => ({
                room_id: room.room_id,
                price: bed_price || 0,
                status: 'Empty'
            }));
            await bedDAO.createMany(beds);
        }

        return room;
    }

    /**
     * Upload files to Cloudinary then append the returned URLs to room_images.
     * @param {number} roomId
     * @param {Array<Object>} files - Multer file objects (buffer)
     * @returns {Promise<Object>} Updated room record
     */
    async addImages(roomId, files) {
        // 1. Upload to Cloudinary → get URLs
        const urls = await cloudinaryBUS.uploadMultiple(files);
        if (!urls || urls.length === 0) return this.getRoomById(roomId);

        // 2. Fetch current images then append
        const room = await roomDAO.findById(roomId);
        if (!room) throw Object.assign(new Error('Room not found'), { type: 'business' });
        const currentImages = room.room_images || [];
        const updatedImages = [...currentImages, ...urls];

        // 3. Save back to DB
        return roomDAO.update(roomId, { room_images: updatedImages });
    }

    async updateRoom(roomId, data) {
        const { bed_price, ...roomData } = data;
        const result = await roomDAO.update(roomId, roomData);
        if (bed_price !== undefined) {
            await bedDAO.updatePricesByRoom(roomId, bed_price);
        }
        return result;
    }

    async deleteRoom(roomId) {
        return roomDAO.delete(roomId);
    }

    // --- Beds ---
    async getBedsByRoom(roomId) {
        return bedDAO.findAll({ room_id: roomId });
    }

    async getAvailableBedsByRoom(roomId) {
        return bedDAO.findAvailableByRoom(roomId);
    }

    async createBed(data) {
        const bed = await bedDAO.create({
            ...data,
            status: 'Empty'
        });

        // Increment room capacity and availability
        const room = await roomDAO.findById(data.room_id);
        if (room) {
            await roomDAO.update(data.room_id, {
                total_beds: (room.total_beds || 0) + 1,
                available_beds: (room.available_beds || 0) + 1,
                status: 'Available'
            });
        }
        return bed;
    }

    async deleteBed(bedId) {
        const bed = await bedDAO.findById(bedId);
        if (!bed) throw Object.assign(new Error('Bed not found'), { type: 'business' });

        if (bed.status !== 'Empty') {
            throw Object.assign(new Error('Chỉ có thể xóa giường trống'), { type: 'business' });
        }

        const roomId = bed.room_id;
        await bedDAO.delete(bedId);

        // Decrement room capacity and availability
        const room = await roomDAO.findById(roomId);
        if (room) {
            await roomDAO.update(roomId, {
                total_beds: Math.max(0, (room.total_beds || 0) - 1),
                available_beds: Math.max(0, (room.available_beds || 0) - 1)
            });
        }
    }

    // --- Room types ---
    async getAllRoomTypes(filters = {}) {
        return roomTypeDAO.findAll(filters);
    }

    async createRoomType(data) {
        return roomTypeDAO.create(data);
    }

    async updateRoomType(roomTypeId, data) {
        return roomTypeDAO.update(roomTypeId, data);
    }

    async deleteRoomType(roomTypeId) {
        return roomTypeDAO.delete(roomTypeId);
    }

    async getSimilarRooms(roomId) {
        const room = await this.getRoomById(roomId);
        const roomTypeId = room.room_type_id;

        // Use the price of the first bed as reference
        // (Assuming all beds in a room usually have the same price)
        const referencePrice = (room.bed && room.bed.length > 0) ? Number(room.bed[0].price) : 0;

        const minPrice = referencePrice - 1000;
        const maxPrice = referencePrice + 1000;

        const rooms = await roomDAO.findSimilar(roomId, roomTypeId, minPrice, maxPrice);
        return rooms.map(r => this._formatRoom(r));
    }
}

module.exports = new RoomBUS();
