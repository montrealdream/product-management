const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/admin/dashboard.controller');

// use
router.get('/', controller.dashboard);

// export
module.exports = router;