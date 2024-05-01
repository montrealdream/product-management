const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/client/checkout.controller');

// use
router.get('/', controller.index);

// export
module.exports = router;