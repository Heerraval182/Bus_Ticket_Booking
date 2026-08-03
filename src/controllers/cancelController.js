const cancelService = require('../services/cancelService');

function cancelBooking(req, res) {
  const { id } = req.params;
  const { reason } = req.body;

  const result = cancelService.cancelBooking(id, reason);

  return res.status(result.statusCode).json(result.body);
}

module.exports = {
  cancelBooking,
};