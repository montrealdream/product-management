const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/admin/accounts.controller');

// validate
const validate = require('../../validate/admin/accounts.validate');


// multer
const multer  = require('multer');
const diskStorageMulterHelper = require('../../helper/diskStorageMulter.helper');
// when not use disk storage
    // const upload = multer({ dest: './public/uploads/' }); 
const upload = multer({ storage: diskStorageMulterHelper() });

// use
router.get('/', controller.index);

router.patch('/change-status/:id/:status',controller.changeStatus);

router.delete('/delete-soft/:id', controller.deleteSoft);

router.get('/create', controller.createView);

router.post(
    '/create', 
    upload.single('avatar'),
    validate.createAccount,
    controller.create
);

router.get('/edit/:id', controller.editView);

router.patch(
    '/edit/:id',
    upload.single('avatar'),
    validate.editAccount,
    controller.edit
);

// export
module.exports = router;
