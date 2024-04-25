const express = require('express');

// create router
const router = express.Router();

// controller
const controller = require('../../controllers/admin/my-account.controller');

// use
router.get('/', controller.index);

// export
module.exports = router;