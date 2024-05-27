const mongoose = require('mongoose');

// Defining a model
const RoomChatSchema = new mongoose.Schema(
    {
        title: String,
        avatar: {
            type: String,
            default: "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg"
        },
        typeRoom: String, //friend or group
        status: String,
        users: [
            {
                user_id: String,
                role: String
            }
        ],
        deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Accessing a Model
const RoomChat = mongoose.model('RoomChat', RoomChatSchema, 'rooms-chat');

// export
module.exports = RoomChat;