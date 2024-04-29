const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/client/products.controller');

// use
router.get('/', controller.index);

router.get('/:slugCategory', controller.categoryView);

router.get('/detail/:slugProduct', controller.detailProduct);

// export
module.exports = router;