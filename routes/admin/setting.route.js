const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/admin/setting.controller');

// use
router.get('/general', controller.settingGeneralView);

// export
module.exports = router;