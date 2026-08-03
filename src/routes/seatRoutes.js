const express = require('express');

const seatController = require('../controllers/seatController');

const router = express.Router();

router.get('/trips/:tripId/seats', seatController.getTripSeats);

module.exports = router;