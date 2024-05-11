const mongoose = require('mongoose');

// Defining a model
const chatSchema = new mongoose.Schema(
    {
        user_id: String,
        room_chat_id: String,
        content: String,
        images: Array,
        deleted:{
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
const Chat = mongoose.model('Chat', chatSchema, 'chats');

// export
module.exports = Chat;