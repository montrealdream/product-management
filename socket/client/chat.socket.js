// model
const User = require('../../models/user.model');
const Chat = require('../../models/chat.model');

// helper
const uploadToCloudinary = require('../../helper/uploadToCloudinary.helper');

module.exports =  async (req, res) => {
    try{
        // my user
        const userId = res.locals.user.id;
        const userFullName = res.locals.user.fullName;

        // room chat id
        const roomChatId = req.params.roomChatId;

        // get avatar of client
        const user = await User.findOne({_id: userId});
        if(!user.avatar){
            user.avatar = "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg";
        }

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
                    user_id: userId,
                    room_chat_id: roomChatId,
                    content: content,
                    images: imagesArray
                });

                await chat.save();

                // SERVER RETURN MESSAGE
                _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
                    user_id: userId,
                    user_name: userFullName,
                    content: content,
                    avatar: user.avatar,
                    images: imagesArray //array contain link img
                });
            });
            // END CLIENT SEND MESSAGE
        
            // CLIENT SEND TYPING
            socket.on("CLIENT_SEND_TYPING", (type) => {
                // SEVER SEND TYPING
                socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
                    user_id: userId,
                    user_name: userFullName,
                    avatar: user.avatar,
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
                    user_id: userId,
                    user_name: userFullName,
                    avatar: user.avatar,
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