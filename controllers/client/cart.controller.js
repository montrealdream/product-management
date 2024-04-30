// model
const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');

// helper
const productHelper = require('../../helper/products.helper');

// [GET] /cart
module.exports.index = async (req, res) => {
    try{
        // get cartId & find cart
        const cartId = req.cookies.cartId;
        const myCart = await Cart.findOne({_id: cartId});

        // total all price of all products
        myCart.totalNeedPay = 0;

        // // get products in cart
        for(const item of myCart.products){
            const inforProduct = await Product.findOne({
                _id: item.product_id
            }).select("title discountPercentage price stock thumbnail");
            
            // new price & new price * quantity
            inforProduct.newPrice = (inforProduct.price - (inforProduct.discountPercentage/100)*inforProduct.price).toFixed(0);
            inforProduct.totalPriceOfProduct = inforProduct.newPrice * item.quantity;
            
            // total all
            myCart.totalNeedPay += inforProduct.totalPriceOfProduct;
            item.inforProduct = inforProduct;
        }
        
        // views
        res.render('client/pages/cart/index', {
            title: "Giỏ hàng",
            myCart: myCart
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

// [GET] /cart/delete/:productId
module.exports.deleteProductInCart = async (req, res) => {
    try{
        // get cartId & find cart & id'sproduct needed delete
        const cartId = req.cookies.cartId;
        const myCart = await Cart.findOne({_id: cartId});
        const productId = req.params.productId;

        await Cart.updateOne(
            {_id: cartId},
            {
                $pull: {
                    products: {
                        product_id: productId
                    }
                }
            }
        ); 
        req.flash('success', 'Xóa sản phẩm khỏi giỏ hàng thành công');
        // views
        res.redirect('back');
    }
    catch(error){

    }
}