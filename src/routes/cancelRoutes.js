const express = require('express');

const cancelController = require('../controllers/cancelController');

const router = express.Router();

router.post('/bookings/:id/cancel', cancelController.cancelBooking);

module.exports = router;