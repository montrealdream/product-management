const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/client/user.controller');

// use
router.get('/signup', controller.signUpView);

router.post('/signup', controller.signUp);

router.get('/signin', controller.signInView);

router.post('/signin', controller.signIn);

router.get('/logout', controller.logOut);

router.get('/password/forgot', controller.forgotPasswordView);

// export
module.exports = router;
