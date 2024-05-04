const mongoose = require('mongoose');

// help
const generateHelper = require('../helper/generate.help');

// Defining a model
const forgotPasswordSchema = new mongoose.Schema(
    {
        email: String,
        otp: {
            type: String,
            default: generateHelper.randomNumber(6) //random 
        }, 
        "expireAt": 
        { 
            type: Date,  
            expires: 11 
        }
    }
);

// Accessing a Model
const forgotPassword = mongoose.model('forgotPassword', forgotPasswordSchema, 'forgot-password');

// export
module.exports = forgotPassword;