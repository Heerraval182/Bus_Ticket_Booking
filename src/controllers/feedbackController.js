const feedbackService = require('../services/feedbackService');

async function createFeedback(req, res) {
  const { id } = req.params;
  const { feedback } = req.body;

  if (!feedback) {
    return res.status(400).json({ message: 'feedback is required' });
  }

  const result = await feedbackService.createFeedback(id, feedback);

  return res.status(result.statusCode).json(result.body);
}

module.exports = {
  createFeedback,
};