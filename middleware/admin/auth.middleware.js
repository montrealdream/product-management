// system config
const systemConfig = require('../../config/system');
const PATH_ADMIN = systemConfig.path_admin;

// model 
const Account = require('../../models/account.model');
const Role = require('../../models/roles.model');

// router private
module.exports.requireAuth = async (req, res, next) => {
    try{
        const token = req.cookies.token;
        
        // if doesnt have token
        if(!token){
            res.redirect(PATH_ADMIN + `/auth/login`);
            return;
        }
        else{
            // check token
            const user = await Account.findOne({
                token: token,
                deleted: false,
                status: 'active'
            }).select('-password');

            if(!user){
                res.redirect(PATH_ADMIN + `/auth/login`);
                return;
            }

            // get role for response (get title & permissions)
            const role = await Role.findOne({
                _id: user.role_id,
                deleted: false
            }).select('title permissions');

            // response this user & role of user
            res.locals.user = user;
            res.locals.role = role;
            
            // next middleware
            next();
        }
        
    }
    catch(error){
        console.log(error);
        res.redirect('back');
    }
}