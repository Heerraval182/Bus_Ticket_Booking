const bookingService = require('../services/bookingService');

function createBooking(req, res) {
  const { passengerId, tripId, seatId } = req.body;

  if (!passengerId || !tripId || !seatId) {
    return res.status(400).json({ message: 'passengerId, tripId, and seatId are required' });
  }

  const result = bookingService.createBooking({ passengerId, tripId, seatId });

  return res.status(result.statusCode).json(result.body);
}

module.exports = {
  createBooking,
};