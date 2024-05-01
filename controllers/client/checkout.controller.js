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

// [POST] /checkout/order
module.exports.order = async (req, res) => {
    try{
        // get cartId for get products
        const cartId = req.cookies.cartId;

        const cart = await Cart.findOne({_id: cartId});

        // get price & discountPercentage according model Order
        const products = [];
        for(const item of cart.products){  
            const objectProduct = {
                product_id: item.product_id,
                price: 0,
                discountPercentage: 0,
                quantity: item.quantity
            } 

            const product = await Product.findOne({
                _id: item.product_id,
            }).select("price discountPercentage");

            objectProduct.price = product.price;
            objectProduct.discountPercentage = product.discountPercentage;
            
            products.push(objectProduct);
        }

        // get infor user
        const inforUser = {
            fullName: req.body.fullName,
            email: req.body.email,
            tel: req.body.tel,
            address: req.body.address,
            note: (req.body.note === 'Ghi chú (Tùy chọn)' ? "" : req.body.note)
        }

        // create schema for save
        const orderSchema = {
            cart_id: cartId,
            inforUser: inforUser,
            products: products
        }

        // create & save
        const record = new Order(orderSchema);
        await record.save();

        // reset products in cart
        await Cart.updateOne(
            {_id: cartId},
            {   
                // reset cart to zero
                products: []
            }
        );

        // update stock of products
        for(const item of products){
            const currentStock = await Product.findOne({_id: item.product_id});
            const newStock = currentStock.stock - item.quantity;
            await Product.updateOne(
                {_id: item.product_id },
                {
                    stock: newStock
                }
            );
        }
        req.flash('success', "Đặt hàng thành công");
        res.redirect(`/checkout/success/${record.id}`);
    }
    catch(error){

    }
}

// [GET] /checkout/success/:orderId
module.exports.orderSuccess = async (req, res) => {
    try{
        // get order id
        const orderId = req.params.orderId;
        const userOrder = await Order.findOne({
            _id: orderId
        });

        // tranportation cost
        const tranportationCost = 5;

        // tổng tiền cần trả
        userOrder.totalCostProduct = 0;

        for(const item of userOrder.products){
            const data = await Product.findOne(
                {_id: item.product_id},
            );

              // calc discount
              const inforProduct = productHelper.discountOne(data);
              // calc sub price
              inforProduct.subPrice = productHelper.subPriceOne(data);
  
              // calc total needed pay
              userOrder.totalCostProduct += parseInt(inforProduct.newPrice) * item.quantity;
  
              item.inforProduct = inforProduct;

        }

        // total needed pay + tranportationCost
        userOrder.totalPay = userOrder.totalCostProduct + tranportationCost;


        res.render('client/pages/checkout/success', {
            title:"Đặt hàng thành công",
            userOrder: userOrder,
            tranportationCost: tranportationCost
        });
    }
    catch(error){
        console.log(error);
    }
}