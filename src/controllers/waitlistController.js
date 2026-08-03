const waitlistService = require('../services/waitlistService');

function joinWaitlist(req, res) {
  const { passengerId, tripId } = req.body;

  if (!passengerId || !tripId) {
    return res.status(400).json({ message: 'passengerId and tripId are required' });
  }

  const result = waitlistService.joinWaitlist({ passengerId, tripId });

  return res.status(result.statusCode).json(result.body);
}

module.exports = {
  joinWaitlist,
};