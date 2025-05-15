const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');

router.get('/threads/by-catalogs', catalogController.getThreadsByCatalogs);


router.get('/', catalogController.get_all_catalogs);


router.get('/:id', catalogController.get_catalog_id);


// router.get('/', catalogController.get_all_catalogs);

// router.get('/:id', catalogController.get_catalog_id);

// router.get('/threads/by-catalogs', catalogController.getThreadsByCatalogs);
module.exports = router;
