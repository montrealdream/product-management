// model
const Chat = require('../../models/chat.model');
const User = require('../../models/user.model');
const RoomChat = require('../../models/rooms-chat.model');

// [GET] /rooms-chat
module.exports.index = async (req, res) => {
    try{
        res.render('client/pages/rooms-chat/index', {
            title : "Danh sách phòng chat",

        })
    }
    catch(error){
        
    }
}

// [GET] /rooms-chat/create
module.exports.createView = async (req, res) => {
    try{
        res.render('client/pages/rooms-chat/create', {
            title : "Tạo phòng"
        });
    }
    catch(error){

    }
}