const express = require('express');
const router = express.Router();
const roomBUS = require('../bus/RoomBUS');
const { validateDTO } = require('../middlewares/validateDTO');
const upload = require('../middlewares/upload');
const { RoomDTO } = require('../dto');


// Room types (static routes first)
router.get('/room-type/all', async (req, res, next) => {
    try {
        const result = await roomBUS.getAllRoomTypes(req.query);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
});
router.post('/room-type', validateDTO(RoomDTO), async (req, res, next) => {
    try {
        const data = await roomBUS.createRoomType(req.body);
        res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
});
router.put('/room-type/:id', validateDTO(RoomDTO), async (req, res, next) => {
    try {
        const data = await roomBUS.updateRoomType(req.params.id, req.body);
        res.json({ success: true, data });
    } catch (error) { next(error); }
});
router.delete('/room-type/:id', async (req, res, next) => {
    try {
        const data = await roomBUS.deleteRoomType(req.params.id);
        res.json({ success: true, data });
    } catch (error) { next(error); }
});


// Beds
router.get('/:roomId/bed', async (req, res, next) => {
    try {
        const result = await roomBUS.getBedsByRoom(req.params.roomId);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
});
router.get('/:roomId/available-bed', async (req, res, next) => {
    try {
        const result = await roomBUS.getAvailableBedsByRoom(req.params.roomId);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
});
router.post('/bed', validateDTO(RoomDTO), async (req, res, next) => {
    try {
        const data = await roomBUS.createBed(req.body);
        res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
});
router.put('/bed/:id', validateDTO(RoomDTO), async (req, res, next) => {
    try {
        const data = await roomBUS.updateBed(req.params.id, req.body);
        res.json({ success: true, data });
    } catch (error) { next(error); }
});
router.delete('/bed/:id', async (req, res, next) => {
    try {
        await roomBUS.deleteBed(req.params.id);
        res.json({ success: true, message: 'Đã xóa giường' });
    } catch (error) { next(error); }
});


// Rooms
router.get('/', async (req, res, next) => {
    try {
        const result = await roomBUS.getAllRooms(req.query);
        res.json({ success: true, ...result });
    } catch (error) { next(error); }
});
router.get('/:id/similar', async (req, res, next) => {
    try {
        const data = await roomBUS.getSimilarRooms(req.params.id);
        res.json({ success: true, data });
    } catch (error) { next(error); }
});
router.get('/:id', async (req, res, next) => {
    try {
        const data = await roomBUS.getRoomById(req.params.id);
        res.json({ success: true, data });
    } catch (error) { next(error); }
});
router.post('/', validateDTO(RoomDTO), async (req, res, next) => {
    try {
        const data = await roomBUS.createRoom(req.body);
        res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
});
router.put('/:id', validateDTO(RoomDTO), async (req, res, next) => {
    try {
        const data = await roomBUS.updateRoom(req.params.id, req.body);
        res.json({ success: true, data });
    } catch (error) { next(error); }
});
router.delete('/:id', async (req, res, next) => {
    try {
        const data = await roomBUS.deleteRoom(req.params.id);
        res.json({ success: true, data });
    } catch (error) { next(error); }
});
router.post('/:id/images', upload.array('images', 10), async (req, res, next) => {
    try {
        const data = await roomBUS.addImages(req.params.id, req.files);
        res.json({ success: true, data });
    } catch (error) { next(error); }
});

module.exports = router;
