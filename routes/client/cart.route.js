const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/client/cart.controller');

// use
router.post('/add/:productId', controller.addToCart);

router.get('/', controller.index);

// export
module.exports = router;