const express = require('express');

const waitlistController = require('../controllers/waitlistController');

const router = express.Router();

router.post('/waitlist', waitlistController.joinWaitlist);

module.exports = router;