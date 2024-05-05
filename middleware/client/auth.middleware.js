const User = require("../../models/user.model");

module.exports.auth = async (req, res, next) => {
    try{
        const tokenUser = req.cookies.tokenUser;
        
        // check user
        const user = await User.findOne({tokenUser: tokenUser});
        if(!user){
            res.redirect('/user/signin');
            return;
        }

        // if tokenUser is valid then next middleware
        next();
    }
    catch(error){

    }
}