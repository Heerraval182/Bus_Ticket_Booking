const express = require('express');

const holdController = require('../controllers/holdController');

const router = express.Router();

router.post('/seats/hold', holdController.createHold);

module.exports = router;