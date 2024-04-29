// model
const Cart = require('../../models/cart.model');

// middleware
module.exports.cart = async (req, res, next) => {
    try{
        // check cookie contain cartId
        if(!req.cookies.cartId){
            // create new Cart & save
            const record = new Cart();
            await record.save();
            
            console.log(record);
            // set cookie
            res.cookie("cartId", record.id);
        }

        // next middleware
        next();
    }
    catch(error){

    }
}