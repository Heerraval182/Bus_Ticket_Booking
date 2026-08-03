const express = require('express');

const feedbackController = require('../controllers/feedbackController');

const router = express.Router();

router.post('/bookings/:id/feedback', feedbackController.createFeedback);

module.exports = router;