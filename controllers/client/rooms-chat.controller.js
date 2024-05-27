// model
const Chat = require('../../models/chat.model');
const User = require('../../models/user.model');
const RoomChat = require('../../models/rooms-chat.model');

/**
 * THỨ TỰ CÁC QUYỀN TRONG NHÓM:
 * SuperAdmin
 * Admin
 * Member
 */
// [GET] /rooms-chat
module.exports.index = async (req, res) => {
    try{
        // lấy ra những roomChat mà mình có
        const listRoomChat = await RoomChat.find({
            "users.user_id": res.locals.user.id,
            typeRoom: "group"
        });

        res.render('client/pages/rooms-chat/index', {
            title : "Danh sách phòng chat",
            listRoomChat
        })
    }
    catch(error){
        
    }
}

// [GET] /rooms-chat/create
module.exports.createView = async (req, res) => {
    try{
        // lấy tất cả bạn bè, để có thể thêm vào NHÓM
        const listFriendID = res.locals.user.listFriend.map(friend => friend.user_id);
        
        const listFriendInfo = await User.find({
            _id: {$in: listFriendID},
            status: "active",
            deleted: false,
        }).select("fullName avatar email tel");

        res.render('client/pages/rooms-chat/create', {
            title : "Tạo phòng",
            listFriendInfo
        });
    }
    catch(error){

    }
}

// [POST] /rooms-chat/create
module.exports.createRoomChat = async (req, res) => {
    try{
        const ObjRoomChat = {
            title: req.body.title,
            typeRoom: "group",
            users: [],
        };

        // nếu có tồn tại ảnh nhóm
        if(req.body.avatar){
            ObjRoomChat.avatar = req.body.avatar
        }

        // đẩy các user cần thêm vào nhóm, với vai trò Member
        req.body.userId.forEach(user_id => {
            ObjRoomChat.users.push({
                user_id: user_id,
                role:"member",
            });
        });

        // đẩy mình (NGƯỜI TẠO NHÓM) vào , nhưng với quyền Cao nhất
        ObjRoomChat.users.push({
            user_id: res.locals.user.id,
            role:"superAdmin",
        });

        // tạo mới
        const roomChat = new RoomChat(ObjRoomChat);

        await roomChat.save();
        
        res.redirect('back');
    }
    catch(error){

    }
}

// [GET] /rooms-chat/edit
module.exports.editView = async (req, res) => {
    try{
         
    }
    catch(error){

    }
}