const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answerController');

router.post('/create', answerController.create_answer);
router.get('/thread/:thread_id', answerController.get_answers);
router.get('/id/:answer_id', answerController.get_answer_id);
router.delete('/id/:answer_id', answerController.delete_answer);

module.exports = router;
