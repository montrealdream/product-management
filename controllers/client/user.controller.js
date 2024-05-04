// model
const User = require('../../models/user.model');
const forgotPassword = require('../../models/forgotPassword.model');
// help
const generateHelper = require('../../helper/generate.help');

const md5 = require('md5');

// [GET] /user/signup
module.exports.signUpView = async (req, res) => {
    try{
        res.render('client/pages/user/signup', {
            title: "Đăng ký tài khoản"
        })
    }
    catch(error){

    }
}

// [GET] /user/signin
module.exports.signInView = async (req, res) => {
    try{
        res.render('client/pages/user/signin', {
            title: "Đăng nhập tài khoản"
        })
    }
    catch(error){

    }
}

// [POST /user/signup
module.exports.signUp = async (req, res) => {
    try{
        
        // check email exits (có thể check thêm email xóa hay chưa)
        const emailExits = await User.findOne({email: req.body.email});
        if(emailExits){
            req.flash('warning', 'Email này đã tồn tại, hãy chọn email khác');
            res.redirect('back');
            return;
        }

        const objectSignUp = {
            fullName: req.body.fullName,
            email: req.body.email,
            tel: req.body.tel,
            password: md5(req.body.password)
        }

        // create & save
        const record = new User(objectSignUp);
        await record.save();
        // sau khi đăng ký xong thì bắt đăng nhập
        req.flash('success', 'Bạn đã đăng ký tài khoản thành công');
        res.redirect('/user/signin');
    }
    catch(error){

    }
}

// [POST] /user/signin
module.exports.signIn = async (req, res) => {
    try{
        // check email exits
        const emailExits = await User.findOne({email: req.body.email});
        if(!emailExits){
            req.flash('warning', 'Email không tồn tại, hãy kiểm tra lại');
            res.redirect('back');
            return;
        }

        // check password
        if(emailExits.password != md5(req.body.password)){
            req.flash('warning', 'Sai Mật khẩu');
            res.redirect('back');
            return;
        }

        // check status
        if(emailExits.status == "inactive"){
            req.flash('warning', 'Tài khoản đã bị khóa');
            // sau này làm thêm trang email cho admin
            res.redirect('back');
            return;
        }

        // set cookie
        res.cookie("tokenUser", emailExits.tokenUser);
        // đến trang chủ lun
        req.flash('success', 'Đăng nhập thành công');
        res.redirect('/');
    }
    catch(error){

    }
}

// [GET] /user/logout
module.exports.logOut = async (req, res) => {
    try {
        // clear cookie
        res.clearCookie("tokenUser");
        req.flash('success', 'Đăng xuất tài khoản thành công');
        res.redirect('/user/signin');
    } catch (error) {
        
    }
}

// [GET] /user/password/forgot
module.exports.forgotPasswordView = async (req, res) => {
    try{
        res.render('client/pages/user/forgot-password', {
            title: "Quên mật khẩu"
        })
    }
    catch(error){

    }
}

// [POST] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    try{
        // check email exits
        const user = await User.findOne({email: req.body.email});
        if(!user){
            req.flash('warning', 'Email không tồn tại');
            res.redirect('back');
            return;
        }

        // when email exits
        const objectForgotPassword = {
            email: user.email,
            otp: generateHelper.randomNumber(6),
            expireAt: Date.now() + (1*60*1000), // 1000s * 60 * 1 = 1m
        }

        // create & save
        const record = new forgotPassword(objectForgotPassword);
        await record.save();

        // query get email
        res.redirect(`/user/password/otp?email=${user.email}`);
        
    }
    catch(error){

    }
}


// [GET] /user/password/otp
module.exports.otpPasswordView = async (req, res) => {
    try{
        const email = req.query.email;

        res.render('client/pages/user/otp-password', {
            title: "OTP",
            email: email
        })
    }
    catch(erorr){

    }
}

// [POST /user/password/otp
module.exports.otpPassword = async (req, res) => {
    try{
        const objectOtpPassword = {
            email: req.body.email,
            otp: req.body.otp
        }

        // find
        const isValidOtp = await forgotPassword.findOne(objectOtpPassword);

        if(!isValidOtp){
            req.flash('warning', 'Mã otp không hợp lệ');
        }


        res.render('client/pages/user/reset-password', {
            title : "Đổi mật khẩu"
        })
    }
    catch(error){

    }
}
