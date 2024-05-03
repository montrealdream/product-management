// model
const User = require('../../models/user.model');

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