const holdService = require('../services/holdService');

function createHold(req, res) {
  const { passengerId, tripId, seatId } = req.body;

  if (!passengerId || !tripId || !seatId) {
    return res.status(400).json({ message: 'passengerId, tripId, and seatId are required' });
  }

  const result = holdService.holdSeat({ passengerId, tripId, seatId });

  return res.status(result.statusCode).json(result.body);
}

module.exports = {
  createHold,
};