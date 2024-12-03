// model
const User = require('../../models/user.model');
const forgotPassword = require('../../models/forgotPassword.model');
// help
const generateHelper = require('../../helper/generate.help');
const mailHelper = require('../../helper/mail.helper');

const md5 = require('md5');
const Cart = require('../../models/cart.model');

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
            password: md5(req.body.password),
            tokenUser: generateHelper.randomString(30)
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
        const user = await User.findOne({email: req.body.email});
        if(!user){
            req.flash('warning', 'Email không tồn tại, hãy kiểm tra lại');
            res.redirect('back');
            return;
        }

        // check password
        if(user.password != md5(req.body.password)){
            req.flash('warning', 'Sai Mật khẩu');
            res.redirect('back');
            return;
        }

        // check status
        if(user.status == "inactive"){
            req.flash('warning', 'Tài khoản đã bị khóa');
            // sau này làm thêm trang email cho admin
            res.redirect('back');
            return;
        }

        // set id'user connect with cart
        await Cart.updateOne(
            {_id: req.cookies.cartId,},
            {
                user_id: user.id
            }
        );

        // set cookie
        res.cookie("tokenUser", user.tokenUser,
            {
                expires: new Date(Date.now() + (60*60*1000)), // 1houre
                httpOnly: true 
            }
        );
        
        // update status online of user
        await User.updateOne(
            {tokenUser: user.tokenUser },
            {
                statusOnline: "online"
            }
        );

        // listen when user connection
        _io.once('connection', (socket) => {
            socket.broadcast.emit("SERVER_RETURN_STATUS_ONLINE", {
                userId: user.id,
                statusOnline: "online"
            });
        });

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
        // update status online of user
        await User.updateOne(
            {tokenUser: req.cookies.tokenUser },
            {
                statusOnline: "offline"
            }
        );

        // get userId
        const user = await User.findOne({tokenUser: req.cookies.tokenUser});

        // listen when user connection
        _io.once('connection', (socket) => {
            socket.broadcast.emit("SERVER_RETURN_STATUS_ONLINE", {
                userId: user.id,
                statusOnline: "offline"
            });
        });

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
            expireAt: Date.now() + (1*60*1000), // 1000ms * 60 * 1 = 1m
        }

        // create & save
        const record = new forgotPassword(objectForgotPassword);
        await record.save();

        // cookie token for sercurity
        res.cookie("tokenUserForgot", user.tokenUser);

        // send otp by email
        const subject = `Mã OTP xác minh lấy lại mật khẩu`;
        const html = `
            Mã OTP xác minh lấy lại mật khẩu là: <b>${objectForgotPassword.otp}</b>
        `;

        mailHelper.send(
            objectForgotPassword.email,
            subject,
            html
        );

        // query get email
        res.redirect(`/user/password/otp?email=${user.email}`);
        
    }
    catch(error){

    }
}

// [GET] /user/password/otp
module.exports.otpPasswordView = async (req, res) => {
    try{
        if(!req.cookies.tokenUserForgot){
            req.flash('warning', ' Bạn không thể vào trang này');
            res.redirect('back');
            return;
        }
        const email = req.query.email;

        // check email valid
        const user = await User.findOne({email: email});
        // cần lấy theo tokenUserForgot nữa để bảo mật, ví dụ như là email hợp lệ và tokenUser không hợp lệ với email đó và ngược lại

        // when have token but token is not valid
        if(!user){
            req.flash('warning', ' Bạn không thể vào trang này');
            res.redirect('back');
            return;
        }

        res.render('client/pages/user/otp-password', {
            title: "OTP",
            email: email
        })
    }
    catch(erorr){

    }
}

// [POST] /user/password/otp
module.exports.otpPassword = async (req, res) => {
    try{
        // validate if not have token
        if(!req.cookies.tokenUserForgot){
            req.flash('warning', ' Bạn không thể vào trang này');
            res.redirect('back');
            return;
        }

        // check tokenUser valid
        const tokenUserForgot = req.cookies.tokenUserForgot;
        const user = await User.findOne({tokenUser: tokenUserForgot});

        // when have token but token is not valid
        if(!user){
            req.flash('warning', ' Bạn không thể vào trang này');
            res.redirect('back');
            return;
        }

        const objectOtpPassword = {
            email: user.email,
            otp: req.body.otp
        }
        // find
        const isValidOtp = await forgotPassword.findOne(objectOtpPassword);

        if(!isValidOtp){
            req.flash('warning', 'Mã otp không hợp lệ');
            res.redirect('back');
            return;
        }

        // if otp is true delete
        await forgotPassword.deleteOne(objectOtpPassword);
        
        res.redirect('/user/password/reset');
    }
    catch(error){

    }
}

// [GET] /user/password/reset
module.exports.resetPasswordView = async (req, res) => {
    try{
        if(!req.cookies.tokenUserForgot){
            req.flash('warning', ' Bạn không thể vào trang này');
            res.redirect('back');
            return;
        }

        // check tokenUser valid
        const tokenUserForgot = req.cookies.tokenUserForgot;
        const user = await User.findOne({tokenUser: tokenUserForgot});

        // when have token but token is not valid
        if(!user){
            req.flash('warning', ' Bạn không thể vào trang này');
            res.redirect('back');
            return;
        }
        
        res.render('client/pages/user/reset-password', {
            title : "Đổi mật khẩu"
        });
    }
    catch(error){

    }
}

// [POST] /user/password/reset
module.exports.resetPassword = async (req, res) => {
    try{
        if(!req.cookies.tokenUserForgot){
            req.flash('warning', ' Bạn không thể vào trang này');
            res.redirect('back');
            return;
        }

        // check tokenUser valid
        const tokenUserForgot = req.cookies.tokenUserForgot;
        const user = await User.findOne({tokenUser: tokenUserForgot});

        // when have token but token is not valid
        if(!user){
            req.flash('warning', ' Bạn không thể vào trang này');
            res.redirect('back');
            return;
        }
        
        // update password
        const password = md5(req.body.password);
        await User.updateOne(
            {tokenUser: tokenUserForgot},
            {
                password: password
            }
        );

        // clear cookie
        res.clearCookie("tokenUserForgot");

        req.flash('success', 'Cập nhật mật khẩu thành công');
        res.redirect('/user/signin');
    }
    catch(error){

    }
}

// [GET] /user/infor
module.exports.infor = async (req, res) => {
    try{
        res.render('client/pages/user/infor', {
            title: "Thông tin cá nhân"
        })
    }
    catch(error){

    }
}

// [GET] /user/edit
module.exports.editView = async (req, res) => {
    try{
        const tokenUser = req.cookies.tokenUser;

        const user = await User.findOne({tokenUser: tokenUser});

        res.render('client/pages/user/edit', {
            title: "Chỉnh sửa thông tin",
            user: user
        }).select("-password");
    }
    catch(error){

    }
}

// [PATCH] /user/edit
module.exports.editUser = async (req, res) => {
    try{
        const tokenUser = req.cookies.tokenUser;

        // check email exits
        const emailExits = await User.findOne({
            tokenUser: {$ne: tokenUser},
            email: req.body.email
        });
        if(emailExits){
            req.flash('warning', 'Email này đã tồn tại, hãy chọn email khác');
            res.redirect('back');
            return;
        }

        // check avatar
        if(!req.body.avatar){
            req.body.avatar = "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg";
        }

        // if not update password, delete field empty password
        if(!req.body.password){
            delete req.body.password;
        }
        else {
            // hasing password
            req.body.password = md5(req.body.password);
        }
        
        // update edit user
        await User.updateOne(
            {tokenUser: tokenUser},
            req.body
        );

        req.flash('success', 'Cập nhật tài khoản thành công');
        res.redirect('/user/infor');
    }
    catch(error){

    }
}