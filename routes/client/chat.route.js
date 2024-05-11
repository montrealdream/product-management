const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/client/chat.controller');

const authMiddleware = require('../../middleware/client/auth.middleware');

// use
router.get(
    '/', 
    authMiddleware.auth,
    controller.index);

// export
module.exports = router;