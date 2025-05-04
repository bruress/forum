const express = require('express');
const router = express.Router();
const inviteController = require('../controllers/inviteController');

router.post('/generate', inviteController.generate_link);

router.post('/generate-batch', inviteController.generate_links);

module.exports = router;
