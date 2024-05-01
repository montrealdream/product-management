const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/client/checkout.controller');

// use
router.get('/', controller.index);

router.post('/order', controller.order);

router.get('/success/:orderId', controller.orderSuccess);

// export
module.exports = router;