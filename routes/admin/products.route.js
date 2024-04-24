const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/admin/products.controller');

// valdidate 
const validate = require('../../validate/admin/products.validate');

// multer
const multer  = require('multer');
const diskStorageMulterHelper = require('../../helper/diskStorageMulter.helper');
// when not use disk storage
    // const upload = multer({ dest: './public/uploads/' }); 
const upload = multer({ storage: diskStorageMulterHelper() });

// use
router.get('/', controller.index);

router.patch('/change-status/:id/:status', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete-soft/:id', controller.deleteSoft);

router.get('/create', controller.createView);

router.post(
    '/create',
    upload.single('thumbnail'),
    validate.createProduct,
    controller.createProduct
);

router.get('/edit/:id', controller.editView);

router.patch(
    '/edit/:id',
    upload.single('thumbnail'),
    validate.createProduct,
    controller.editProduct
)

router.get('/detail/:id', controller.detail);

// export
module.exports = router;
