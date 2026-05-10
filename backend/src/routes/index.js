const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const roomRoutes = require('./room.routes');
const appointmentRoutes = require('./appointment.routes');

router.use('/auth', authRoutes);
router.use('/room', roomRoutes);
router.use('/appointment', appointmentRoutes);

module.exports = router;
