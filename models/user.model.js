const mongoose = require('mongoose');

// helper
const generateHelper = require('../helper/generate.help');

// Defining a model
const userSchema = new mongoose.Schema(
    {
        cart_id: String,
        fullName: String,
        avatar: String,
        tokenUser: {
            type: String,
            default: generateHelper.randomString(20)
        },
        email: String,
        password: String,
        tel: String,
        status: String,
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true
    }
);

// Accessing a Model
const User = mongoose.model('User', userSchema, 'users');

// export
module.exports = User;