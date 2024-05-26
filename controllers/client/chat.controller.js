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

        // get my user 
        const myUser = res.locals.user;

        // Lấy thông tin phòng chat
        const roomChatId = req.params.roomChatId;

        const infoRoomChat = await RoomChat.findOne({
            _id: roomChatId,
            // need deleted false
        });

        const typeRoomChat = infoRoomChat.typeRoom;
        // End Lấy thông tin phòng chat

        // Lấy dữ liệu đoạn chat
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
        // End Lấy dữ liệu đoạn chat

        if(typeRoomChat == "friend"){
            // nếu tin nhắn giữa 2 người thì cần phải get được thông tin của userB
            const getIdUserB = infoRoomChat.users.find(user => user.user_id != myUser.id);
            const inforUserB = await User.findOne({
                _id: getIdUserB.user_id,
                
            }).select("-password -tokenUser");

            res.render("client/pages/chat/friend", {
                title: inforUserB.fullName,
                chats: chats,
                inforUserB: inforUserB
            });
        }

        else if(typeRoomChat == "group"){
            res.render("client/pages/chat/group", {
                title: "Hội trường",
                chats: chats,
            });
        }
       
    }
    catch(error){
        console.log(error);
    }
}