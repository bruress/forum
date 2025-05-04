const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');

router.get('/', catalogController.get_all_catalogs);

router.get('/:id', catalogController.get_catalog_id);

module.exports = router;
