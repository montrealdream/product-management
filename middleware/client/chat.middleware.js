// model
// const Chat = require('../../models/chat.model');
// const User = require('../../models/user.model');
const RoomChat = require('../../models/rooms-chat.model');

module.exports.isAccessRoom = async (req, res, next) => {
    try{
        // get roomChat
        const roomChatId = req.params.roomChatId;

        const userInRoomChat = await RoomChat.findOne({
            _id: roomChatId,
            "users.user_id": res.locals.user.id,
            // deleted: false
        });

        if(!userInRoomChat){
            // cứ /404 thì đường dẫn sẽ bị sai nó tự route tới đường dẫn 404
            res.redirect('/404');
            return;
        }
        next();
    }
    catch(error){

    }
}