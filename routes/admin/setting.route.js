const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/admin/setting.controller');

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
router.get('/general', controller.settingGeneralView);

router.post(
    '/general', 
    upload.single('logo'),
    uploadCloud.uploadSingle,
    controller.settingGeneral
);

// export
module.exports = router;