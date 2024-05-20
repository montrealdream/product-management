// model
const User = require('../../models/user.model');

// socket
const userSocket = require('../../socket/client/users.socket');

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
    try{
        // my user
        const myId = res.locals.user.id;
        const myUser = await User.findOne({_id: myId});

        const myRequestFriends = myUser.requestFriend;
        const myAcceptFriends = myUser.acceptFriend;

        // socket
        userSocket(req, res);
        // end socket
        
        // view render
        const users = await User.find({
            $and: [
                {_id: {$ne: myId}},
                { _id: {$nin: myRequestFriends}},
                {_id: {$nin: myAcceptFriends}}
            ],
            status: "active",
            deleted: false
        }).select("avatar fullName");

        // for(const user of userNotFriend){   
        //     // check xem mình đã gửi kết bạn cho ng` đó chưa
        //     const exitsRequest = await User.findOne({
        //         _id: myId,
        //         "requestFriend": user.id
        //     });

        //     if(exitsRequest){
        //         user.class="add";
        //         // user.want = "Hủy lời mời";
        //     }

            // check xem có người nào đó gửi kết bạn cho mình chưa
            // const exitsAccept = await User.findOne({
            //     _id: myId,
            //     "acceptFriend": user.id
            // });

            // if(exitsAccept){
            //     user.class="add";
            //     user.want = "Xác nhận";
            // }
        // }

        res.render('client/pages/users/not-friend', {
            title: "Danh sách người dùng",
            users: users
        });
    }
    catch(error){

    }
}

// [GET] /users/request
module.exports.requestFriend = async (req, res) => {
    try{
        // my user
        const myId = res.locals.user.id;
        const myUser = await User.findOne({_id: myId});
        const myRequestFriend = myUser.requestFriend;

        // socket
        userSocket(req, res);
        // end socket

        // view render
        const users = await User.find({
            _id: {$in: myRequestFriend},
            status: "active",
            deleted: false
        });

        res.render("client/pages/users/request-friend", {
            title: "Lời mời đã gửi",
            users: users
        })
    }
    catch(error){
        console.log(error);
    }
}

// // [GET] /users/accept
module.exports.acceptFriend = async (req, res) => {
    try{
        // my user
        const myId = res.locals.user.id;
        const myUser = await User.findOne({_id: myId});
        const myAcceptFriend = myUser.acceptFriend;

        // socket
        userSocket(req, res);
        // end socket

        // view render
        const users = await User.find({
            _id: {$in: myAcceptFriend},
            status: "active",
            deleted: false
        });

        res.render("client/pages/users/accept-friend", {
            title: "Lời mời kết bạn",
            users: users
        });
         
    }
    catch(error){
        console.log(error);
    }
}