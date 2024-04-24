const mongoose = require('mongoose');

// Defining a model
const accountSchema = new mongoose.Schema(
    {
        fullName: String,
        avatar: String,
        role_id: String,
        token: String,
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