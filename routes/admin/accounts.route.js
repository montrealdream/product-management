const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/admin/accounts.controller');

// validate
const validate = require('../../validate/admin/accounts.validate');


// use
router.get('/', controller.index);

router.patch('/change-status/:id/:status',controller.changeStatus);

router.delete('/delete-soft/:id', controller.deleteSoft);

router.get('/create', controller.createView);

router.post(
    '/create', 
    validate.createAccount,
    controller.create);


// export
module.exports = router;
