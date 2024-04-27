const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

// plugin
mongoose.plugin(slug);

// Defining a model
const productSchema = new mongoose.Schema(
    {
        title: String,
        product_category_id: String,
        description: String,
        price: Number,
        discountPercentage: Number,
        stock: Number,
        thumbnail: String,
        status: String,
        position: Number,
        deleted:{
            type: Boolean,
            default: false
        },
        deletedAt: Date,
        slug: {
            type: String,
            slug:"title",
            unique: true
        },
        featured: String,
    },
    {
        timestamps: true
    }
);

// Accessing a Model
const Product = mongoose.model('Product', productSchema, 'products');

// export
module.exports = Product;