const express = require('express');
const router = express.Router();
const moderationController = require('../controllers/moderationController');

router.get('/moderators', moderationController.get_all_moderators);
router.get('/moderators/:student_id', moderationController.get_moderator_id);
router.post('/assign', moderationController.add_moderator);
router.post('/remove-moderator', moderationController.delete_moderator);
router.post('/thread', moderationController.delete_thread);
router.post('/answer', moderationController.delete_answer);



module.exports = router;
