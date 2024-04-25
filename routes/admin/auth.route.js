const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/admin/auth.controller');

router.get('/login', controller.loginView);

router.post('/login', controller.login);

router.get('/logout', controller.logout);

// export
module.exports = router;