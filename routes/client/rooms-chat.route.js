const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/client/rooms-chat.controller');

const chatMiddleware = require('../../middleware/client/chat.middleware');

// use
router.get(
    '/', 
    // chatMiddleware.isAccessRoom,
    controller.index
);

router.get(
    '/create',
    controller.createView
);

// export
module.exports = router;