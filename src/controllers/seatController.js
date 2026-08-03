const seatService = require('../services/seatService');

function getTripSeats(req, res) {
  const { tripId } = req.params;
  const seats = seatService.getSeatsByTripId(tripId);

  res.status(200).json(seats);
}

module.exports = {
  getTripSeats,
};