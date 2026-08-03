const express = require('express');

const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.post('/bookings', bookingController.createBooking);

module.exports = router;