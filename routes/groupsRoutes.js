const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groupsController'); 

router.get('/groups', groupsController.getAllGroups);
router.get('/:group_id', groupsController.getGroupById);
router.post('/groups', groupsController.createGroup);
router.put('/groups/:group_id', groupsController.updateGroup);
router.delete('/groups/:group_id', groupsController.deleteGroup);

module.exports = router;
