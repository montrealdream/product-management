const mongoose = require('mongoose');

// Defining a model
const RoomChatSchema = new mongoose.Schema(
    {
        title: String,
        avatar: String,
        typeRoom: String, //friend or group
        status: String,
        users: [
            {
                user_id: String,
                role: String
            }
        ]
    },
    {
        timestamps: true
    }
);

// Accessing a Model
const RoomChat = mongoose.model('RoomChat', RoomChatSchema, 'rooms-chat');

// export
module.exports = RoomChat;