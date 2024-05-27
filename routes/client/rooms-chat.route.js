const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/client/rooms-chat.controller');

const chatMiddleware = require('../../middleware/client/chat.middleware');

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
router.get(
    '/', 
    // chatMiddleware.isAccessRoom,
    controller.index
);

router.get(
    '/create',
    controller.createView
);

router.post(
    '/create',
    upload.single('avatar'),
    uploadCloud.uploadSingle,
    // validate,
    controller.createRoomChat
);

router.get(
    '/edit/:roomChatId',
    controller.editView
);

// export
module.exports = router;