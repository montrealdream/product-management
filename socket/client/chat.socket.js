// model
const User = require('../../models/user.model');
const Chat = require('../../models/chat.model');
const RoomChat = require('../../models/rooms-chat.model');

// helper
const uploadToCloudinary = require('../../helper/uploadToCloudinary.helper');

module.exports =  async (req, res) => {
    try{
        // my user
        const userId = res.locals.user.id;
        const userFullName = res.locals.user.fullName;
        const userAvatar = res.locals.user.avatar;

        // room chat id
        const roomChatId = req.params.roomChatId;
        const infoRoomChat = await RoomChat.findOne({
            _id: roomChatId,
        });

        // LISTEN CLIENT CONNECT "ONLINE"
        _io.once('connection', (socket) => {
            // khi vào phòng chat, sẽ join vào id phòng chat trước
            socket.join(roomChatId);
        
            // CLIENT SEND MESSAGE
            socket.on("CLIENT_SEND_MESSAGE", async (obj) => {
                let imagesArray = []; //empty array

                const content = obj.content; // get content
                
                // create link image on cloudinary
                for(const image of obj.images){
                    const linkImg = await uploadToCloudinary(image);
                    imagesArray.push(linkImg);
                }
            
                // create & save
                const chat = new Chat({
                    typeRoom: infoRoomChat.typeRoom,
                    user_id: userId,
                    room_chat_id: roomChatId,
                    content: content,
                    images: imagesArray
                });

                await chat.save();

                // SERVER RETURN MESSAGE
                _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
                    typeRoom: infoRoomChat.typeRoom,
                    user_id: userId,
                    user_name: userFullName,
                    content: content,
                    avatar: userAvatar,
                    images: imagesArray //array contain link img
                });
            });
            // END CLIENT SEND MESSAGE
        
            // CLIENT SEND TYPING
            socket.on("CLIENT_SEND_TYPING", (type) => {
                // SEVER SEND TYPING
                socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
                    typeRoom: infoRoomChat.typeRoom,
                    user_id: userId,
                    user_name: userFullName,
                    avatar: res.locals.user.avatar,
                    type: type
                });
            });
            // END CLIENT SEND TYPING


            // CLIENT SEND ONLY ICON DEFAULT
            socket.on("CLIENT_SEND_ONLY_ICON_DEFAULT", async (icon) => {
                // save on db ****
                const newChat = new Chat({
                    user_id: userId,
                    content: icon
                });
                await newChat.save();

                // SERVER RETURN
                _io.to(roomChatId).emit("SERVER_RETURN_ONLY_ICON_DEFAULT", {
                    typeRoom: infoRoomChat.typeRoom,
                    user_id: userId,
                    user_name: userFullName,
                    avatar: res.locals.user.avatar,
                    icon: icon
                });
            });
            // END CLIENT SEND ONLY ICON DEFAULT
        });
    }
    catch(error){
        console.log(error);
    }
}