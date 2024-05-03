// model
const User = require('../../models/user.model');

module.exports.auth = async (req, res, next) => {
    try{
        // get cookie & check
        const tokenUser = req.cookies.tokenUser;
        
        if(tokenUser){
            const user = await User.findOne({tokenUser: tokenUser});

            if(user){
                res.locals.user = user;
            }
        }
        // always next middleware
        next();
    }
    catch(error){

    }
}