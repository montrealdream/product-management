const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/client/cart.controller');

// use
router.post('/add/:productId', controller.addToCart);

router.get('/', controller.index);

router.get('/delete/:productId', controller.deleteProductInCart);

router.get('/update/:productId/:quantity', controller.updateQuantity);
// export
module.exports = router;