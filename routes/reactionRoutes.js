const express = require('express');
const router = express.Router();
const reactionController = require('../controllers/reactionController');

router.post('/update', reactionController.updateReaction);

router.get('/thread-reactions/count/:thread_id', reactionController.getThreadReactionsCount);
router.get('/answer-reactions/count/:answer_id', reactionController.getAnswerReactionsCount);

router.post('/thread-reactions', reactionController.reactToThread);
router.post('/answer-reactions', reactionController.reactToAnswer);

router.delete('/thread-reactions', reactionController.deleteThreadReaction);
router.delete('/answer-reactions', reactionController.deleteAnswerReaction);

router.get('/thread-reactions', reactionController.getAllThreadReactions);
router.get('/answer-reactions', reactionController.getAllAnswerReactions);

router.get('/thread-reactions/:thread_id', reactionController.getThreadReactionsByThreadId);
router.get('/answer-reactions/:answer_id', reactionController.getAnswerReactionsByAnswerId);



module.exports = router;
