// model
const Chat = require('../../models/chat.model');
const User = require('../../models/user.model');

// [GET] /chat
module.exports.index = async (req, res) => {
    try{

        const userId = res.locals.user.id;
        const userFullName = res.locals.user.fullName;

        // LISTEN CLIENT CONNECT "ONLINE"
        _io.once('connection', (socket) => {
            // inform user connect
            console.log(`${userFullName} đang hoạt động`);

            // inform user disconnect
            socket.on('disconnect', () => {
            console.log('user disconnected');
            });

           
            // CLIENT SEND MESSAGE
            socket.on("CLIENT_SEND_MESSAGE", async (content) => {
                const chat = new Chat({
                    user_id: userId,
                    content: content
                });

                await chat.save();

                 // get avatar of client
                const user = await User.findOne({_id: userId});
                if(!user.avatar){
                    user.avatar = "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg";
                }

                // SERVER RETURN MESSAGE
                _io.emit("SERVER_RETURN_MESSAGE", {
                    user_id: userId,
                    user_name: userFullName,
                    content: content,
                    avatar: user.avatar
                });
            });
        });
          
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