// model
const Chat = require('../../models/chat.model');
const User = require('../../models/user.model');

// socket
const chatSocket = require('../../socket/client/chat.socket');

// [GET] /chat
module.exports.index = async (req, res) => {
    try{
        // socket
        chatSocket(req, res);
        // end socket

        // get & render views
        const chats = await Chat.find({deleted: false});
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