const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/client/chat.controller');

// use
router.get(
    '/:roomChatId', 
    controller.index
);

// export
module.exports = router;