const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const appointmentRoutes = require('./appointment.routes');

router.use('/auth', authRoutes);
router.use('/appointment', appointmentRoutes);

module.exports = router;
