const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/client/chat.controller');

const chatMiddleware = require('../../middleware/client/chat.middleware');

// use
router.get(
    '/:roomChatId', 
    chatMiddleware.isAccessRoom,
    controller.index
);

// export
module.exports = router;