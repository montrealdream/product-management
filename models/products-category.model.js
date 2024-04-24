const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

// plugin
mongoose.plugin(slug);

// Defining a model
const productCategorySchema = new mongoose.Schema(
    {
        title: String,
        parent_id: String,
        description: String,
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
        }
    },
    {
        timestamps: true
    }
);

// Accessing a Model
const productCategory = mongoose.model('productCategory', productCategorySchema, 'products-category');

// export
module.exports = productCategory;