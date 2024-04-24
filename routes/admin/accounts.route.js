const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/admin/accounts.controller');

// use
router.get('/', controller.index);

router.patch('/change-status/:id/:status',controller.changeStatus);

router.delete('/delete-soft/:id', controller.deleteSoft);

router.get('/create', controller.createView);

// export
module.exports = router;
