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

router.get(
    '/accept',
    controller.acceptFriend
);

router.get(
    '/friends',
    controller.myFriends
);
// export
module.exports = router;