// model
const Chat = require('../../models/chat.model');
const User = require('../../models/user.model');

// [GET] /chat
module.exports.index = async (req, res) => {
    try{
        // now user
        const userId = res.locals.user._id;
        const userName = res.locals.user.fullName;

        // socketIO
        _io.once('connection', (socket) => {
            // socket User disconnect
            socket.on('disconnect', () => {
                console.log(`${userName} đã offline`);
            });

            // notice socket User connect
            console.log(`${userName} đã online`);

            // get client send message to server
            socket.on("CLIENT_SEND_MESSAGE", async (msg) => {
                // save on database
                const newChat = new Chat({
                    user_id: userId,
                    content: msg
                });
                await newChat.save();
                
                const userAvatar = await User.findOne({_id: userId}).select("avatar");

                // send to client
                _io.emit("SERVER_RETURN_MESSAGE", {
                    userId: userId,
                    userName: userName,
                    content: msg,
                    avatar: userAvatar
                });
                
            });

            // client send typing
            socket.on("CLIENT_SEND_TYPING", async (msg) => {
                const userAvatar = await User.findOne({_id: userId}).select("avatar");

                socket.broadcast.emit("SERVER_RETURN_TYPING", {
                    userId: userId,
                    userName: userName,
                    type: msg,
                    avatar: userAvatar
                });
            });
        });

        // send hidden typing
        // sock
        
        // handle render
        const chats = await Chat.find({deleted: false});
        
        for(const chat of chats){
            // get user of chat
            const user = await User.findOne({
                _id: chat.user_id
            }).select("fullName avatar");

            chat.fullName = user.fullName;
            chat.avatar = user.avatar;
        }

        // views
        res.render('client/pages/chat/index', {
            title: "Chat",
            chats: chats
        });
    }
    catch(error){
        console.log(error); 
        res.redirect('back')
    }
  
}