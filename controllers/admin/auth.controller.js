// system config
const systemConfig = require('../../config/system');
const PATH_ADMIN = systemConfig.path_admin;

// model
const Account = require('../../models/account.model');
const Role = require('../../models/roles.model');

const md5 = require('md5');

// [GET] /admin/auth/login
module.exports.loginView = async (req, res) => {
    try{
        res.render('admin/pages/auth/login', {
            title: "Login"
        });
    }   
    catch(error){
        res.direct('back');
    }
}

// [POST] /admin/auth/login
module.exports.login = async (req, res) => {
    try{
        // get email & password
        const email = req.body.email;
        const password = req.body.password;
        
        // check email 
        const user = await Account.findOne({
            email: email,
            deleted: false
        });
        
        if(!user){
            req.flash('warning', 'Account doesnt exits');
            req.redirect('back');
            return;
        }
        else{
            // cmp password
            if(user.password != md5(password)){
                // wrong
                req.flash('warning', 'Incorrect password');
                req.redirect('back');
                return;
            }
            
            if(user.status == "inactive"){
                req.flash('warning', 'Account has been locked');
                res.redirect('back');
                return;
            }

            res.cookie('token', user.token);
            res.redirect(PATH_ADMIN + `/dashboard`);
        }
        
    }
    catch(error){
        console.log(error);
        res.redirect('back');
    }
}

// [GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
    try{
        res.clearCookie('token');
        res.redirect(PATH_ADMIN + '/auth/login');
    }
    catch(error){

    }
}