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
        else{
            const cart = await Cart.findOne({
                _id: req.cookies.cartId
            });

            res.locals.miniCart = cart;
        }
        // next middleware
        next();
    }
    catch(error){

    }
}