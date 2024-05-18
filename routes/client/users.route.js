const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/client/users.controller');

// use
router.get(
    '/not-friend', 
    controller.notFriend
);

router.get(
    '/request',
    controller.requestFriend
);

// export
module.exports = router;