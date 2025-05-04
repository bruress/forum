const express = require('express');
const router = express.Router();
const threadController = require('../controllers/threadController');

router.get('/by_catalog/:catalog_id', threadController.getThreadsByCatalog);
router.get('/', threadController.get_all_threads);
router.post('/', threadController.create_thread);
router.get('/:thread_id', threadController.get_thread_id);
router.delete('/:thread_id', threadController.delete_thread);

module.exports = router;
