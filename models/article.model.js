const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

// plugin
mongoose.plugin(slug);

// Defining a model
const articleSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        thumbnail: String,
        status: String,
        position: Number,
        createdBy: {
            account_id: String,
            createAt: {
                type: Date,
                default: Date.now
            }
        },
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
const Article = mongoose.model('Article', articleSchema, 'articles');

// export
module.exports = Article;