// model
const Chat = require('../../models/chat.model');
const User = require('../../models/user.model');
const RoomChat = require('../../models/rooms-chat.model');

// socket
const chatSocket = require('../../socket/client/chat.socket');

// [GET] /chat
module.exports.index = async (req, res) => {
    try{
        // socket
        chatSocket(req, res);
        // end socket

        // get room chat id
        const roomChatId = req.cookies.roomChatId;

        // get tokenUser
        // const myUser = await User.findOne({tokenUser: tokenUser}).select("-password");

        // get room chat
        // const roomChat = await RoomChat.findOne({_id: roomChatId});

        // get & render views
        const chats = await Chat.find({
            room_chat_id: roomChatId,
            deleted: false
        });

        for(const chat of chats){
            const user = await User.findOne({
                _id: chat.user_id,
            });
            chat.fullName =  user.fullName;
            chat.avatar = user.avatar;
        }   
        res.render("client/pages/chat/index", {
            title: "Hội trường",
            chats: chats
        });
    }
    catch(error){
        console.log(error);
    }
}