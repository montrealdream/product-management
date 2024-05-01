// model
const Cart = require('../../models/cart.model');
const Order = require('../../models/order.model');
const Product = require('../../models/product.model');

// helper
const productHelper = require('../../helper/products.helper');

// [GET] /checkout
module.exports.index = async (req, res) => {
    try{
        // get cart id on cookies & find this cart
        const cartId = req.cookies.cartId;
        
        const cart = await Cart.findOne({
            _id: cartId
        });
        
        // tranportation cost
        const tranportationCost = 5;

        // tổng tiền cần trả
        cart.totalCostProduct = 0;

        for(const item of cart.products){
            const data = await Product.findOne({
                _id: item.product_id,
                status: "active",
                deleted: false
            }).select("title price discountPercentage thumbnail");
            
            // calc discount
            const inforProduct = productHelper.discountOne(data);
            // calc sub price
            inforProduct.subPrice = productHelper.subPriceOne(data);

            // calc total needed pay
            cart.totalCostProduct += parseInt(inforProduct.newPrice) * item.quantity;

            item.inforProduct = inforProduct;
        }

        // total needed pay + tranportationCost
        cart.totalPay = cart.totalCostProduct + tranportationCost;

        res.render('client/pages/checkout/index',{
            title: "Thanh toán đơn hàng",
            cartDetail: cart,
            tranportationCost: tranportationCost
        });
    }
    catch(error){

    }
}