// model
const Cart = require('../../models/cart.model');

// [GET] /cart
module.exports.index = async (req, res) => {
    try{
        res.render('client/pages/cart/index', {
            title: "Giỏ hàng"
        })
    }
    catch(error){

    }
}

// [POST] /cart/add/:productId
module.exports.addToCart = async (req, res) => {
    try{
        // get cartId, productId & quantity needed
        const cartId = req.cookies.cartId;
        const productId = req.params.productId;
        const quantity = parseInt(req.body.quantity);

        // get cart
        const myCart = await Cart.findOne({_id: cartId});

        // check product exits in cart ?
        const exitsProductInCart = myCart.products.find(item => {
            return item.product_id === productId
        });

        // exits product, update quantity
        if(exitsProductInCart){
            // increase quantity
            const oldQuantity = exitsProductInCart.quantity;
            const newQuantity = oldQuantity + quantity;

            await Cart.updateOne(
                {
                    _id: cartId,
                    "products.product_id": productId
                },
                {
                    $set: {
                        "products.$.quantity": newQuantity
                    }
                }
            );
            req.flash('success', 'Đã cập nhật số lượng sản phẩm thành công');
        }
        // it new product needed add to cart
        else {
            await Cart.updateOne(
                {_id: cartId},
                {
                    $push: {
                        products:{
                            product_id: productId,
                            quantity: quantity
                        }
                    }
                }
            );
            req.flash('success', 'Đã thêm sản phẩm vào giỏ hàng thành công');
        }
        res.redirect('back'); 
    }
    catch(error){

    }
}