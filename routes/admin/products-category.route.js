const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/admin/products-category.controller');

// validate
const validate = require('../../validate/admin/products-category.validate');

// upload cloudinary
const uploadCloud = require('../../middleware/admin/uploadCloud.middlware');

// multer
const multer  = require('multer');
const diskStorageMulterHelper = require('../../helper/diskStorageMulter.helper');
// when not use disk storage
// const upload = multer({ dest: './public/uploads/' }); 
// const upload = multer({ storage: diskStorageMulterHelper() });

/**When u use cloudinary */
const upload = multer();

// use
router.get('/', controller.index);

router.get('/create', controller.createView);

router.post(
    '/create',
    upload.single('thumbnail'),
    uploadCloud.uploadSingle,
    validate.createCategory,
    controller.createCategory
);

router.patch('/change-status/:id/:status', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete-soft/:id', controller.deleteSoft);

router.get('/edit/:id', controller.editView);

router.patch(
    '/edit/:id',
    upload.single('thumbnail'),
    validate.createCategory,
    controller.editCategory
);

// export
module.exports = router;