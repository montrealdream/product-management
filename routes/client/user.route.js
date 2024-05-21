const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/client/user.controller');

// middlware auth 
const middlewareAuth = require('../../middleware/client/auth.middleware');

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
router.get('/signup', controller.signUpView);

router.post('/signup', controller.signUp);

router.get('/signin', controller.signInView);

router.post('/signin', controller.signIn);

router.get('/logout', controller.logOut);

router.get('/password/forgot', controller.forgotPasswordView);

router.post('/password/forgot', controller.forgotPassword);

router.get('/password/otp', controller.otpPasswordView);

router.post('/password/otp', controller.otpPassword);

router.get('/password/reset', controller.resetPasswordView);

router.post('/password/reset', controller.resetPassword);

router.get(
    '/infor', 
    middlewareAuth.auth,
    controller.infor
);

router.get(
    '/edit',
    middlewareAuth.auth,
    controller.editView
);

router.patch(
    '/edit',
    middlewareAuth.auth,
    upload.single('avatar'),
    uploadCloud.uploadSingle,
    // validate
    controller.editUser
);

// export
module.exports = router;
