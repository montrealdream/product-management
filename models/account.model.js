const mongoose = require('mongoose');

// helper
const generateHelper = require('../helper/generate.help');

// Defining a model
const accountSchema = new mongoose.Schema(
    {
        fullName: String,
        avatar: String,
        role_id: String,
        token: {
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
const Account = mongoose.model('Account', accountSchema, 'accounts');

// export
module.exports = Account;