const mongoose = require('mongoose');

// Defining a model
const cartSchema = new mongoose.Schema(
    {
        // user_id: String,
        products: [
            {
                product_id: String,
                quantity: Number
            }
        ]
    }
);

// Accessing a Model
const Cart = mongoose.model('Cart', cartSchema, 'carts');

// export
module.exports = Cart;