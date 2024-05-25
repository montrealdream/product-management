const mongoose = require('mongoose');

// Defining a model
const userSchema = new mongoose.Schema(
    {
        cart_id: String,
        fullName: String,
        avatar: {
            type: String,
            // default avatar
            default: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg"
        },
        tokenUser: String,
        email: String,
        password: String,
        tel: String,
        statusOnline: String, // online/offline/busy
        status: {
            type: String,
            default: "active"
        },
        deleted: {
            type: Boolean,
            default: false
        },
        acceptFriend: Array,
        requestFriend: Array,
        listFriend: [
            {
                user_id: String,
                room_chat_id: String,
            }
        ],
    },
    {
        timestamps: true
    }
);

// Accessing a Model
const User = mongoose.model('User', userSchema, 'users');

// export
module.exports = User;