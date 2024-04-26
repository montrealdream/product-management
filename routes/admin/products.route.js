const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/admin/products.controller');

// valdidate 
const validate = require('../../validate/admin/products.validate');

// middleware
const uploadCloud = require('../../middleware/admin/uploadCloud.middlware');

// multer
const multer  = require('multer');

/**when u use disk storage local */
const diskStorageMulterHelper = require('../../helper/diskStorageMulter.helper');

/** when not use disk storage */
// const upload = multer({ dest: './public/uploads/' }); 
// const upload = multer({ storage: diskStorageMulterHelper() });

/**when u use cloudinary */
// const cloudinary = require('cloudinary').v2;
// const streamifier = require('streamifier');
const upload = multer();
          
// use
router.get('/', controller.index);

router.patch('/change-status/:id/:status', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete-soft/:id', controller.deleteSoft);

router.get('/create', controller.createView);

router.post(
    '/create',
    upload.single('thumbnail'),
    uploadCloud.uploadSingle, // function upload onto cloudinary
    validate.createProduct,
    controller.createProduct
);

router.get('/edit/:id', controller.editView);

router.patch(
    '/edit/:id',
    upload.single('thumbnail'),
    uploadCloud.uploadSingle, // function upload onto cloudinary
    validate.createProduct,
    controller.editProduct
)

router.get('/detail/:id', controller.detail);

// export
module.exports = router;
