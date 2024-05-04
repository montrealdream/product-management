const mongoose = require('mongoose');

// Defining a model
const forgotPasswordSchema = new mongoose.Schema(
    {
        email: String,
        otp: String,
        expireAt: {
            type: Date,  
            expires: 0 //second
        }
    }
);

// Accessing a Model
const forgotPassword = mongoose.model('forgotPassword', forgotPasswordSchema, 'forgot-password');

// export
module.exports = forgotPassword;