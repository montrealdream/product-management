// model
const User = require('../../models/user.model');

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
    try{
        // my user
        const myId = res.locals.user.id;

        // socket
        // LISTEN CLIENT CONNECT "ONLINE"
        _io.once('connection', (socket) => { 
            // CLIENT ADD FRIEND
            socket.on("CLIENT_ADD_FRIEND", async (idWantAddFriend) => {  
                // add id'user want add friend into field requestFriend in database
                const exitsB = await User.findOne({
                    _id: myId,
                    "requestFriend": idWantAddFriend
                });

                if(!exitsB){
                    await User.updateOne(
                        {_id: myId},
                        {
                            $push: {
                                requestFriend: idWantAddFriend
                            }
                        }
                    );
                }
               
                // add my id field acceptFriend of user want to add friend
                const exitsMyId = await User.findOne({
                    _id: idWantAddFriend,
                    "acceptFriend": myId
                });

                if(!exitsMyId){
                    await User.updateOne(
                        {_id: idWantAddFriend},
                        {
                            $push: {
                                acceptFriend: myId
                            }
                        }
                    );
                }
                req.flash('success', "Gửi lời mời kết bạn thành công");
            // END CLIENT ADD FRIEND
            });
            // END CLIENT ADD FRIEND

            // CLIENT CANCEL ADD FRIEND
            socket.on("CLIENT_CANCEL_ADD_FRIEND", async (idWantCancelAddFriend) => {
                // remove id'user want cancel add friend into field requestFriend in database
                const exitsB = await User.findOne({
                    _id: myId,
                    "requestFriend": idWantCancelAddFriend
                });
                if(exitsB){
                    await User.updateOne(
                        {_id: myId},
                        {
                            $pull: {
                                requestFriend: idWantCancelAddFriend
                            }
                        }
                    );
                }

                // remove my id field acceptFriend of user want to cancel add friend 
                const exitsMyId = await User.findOne({
                    _id: idWantCancelAddFriend,
                    "acceptFriend": myId
                });
                if(exitsMyId){
                    await User.updateOne(
                        {_id: idWantCancelAddFriend},
                        {
                            $pull: {
                                acceptFriend: myId
                            }
                        }
                    );
                }
            });
            // END CLIENT CANCEL ADD FRIEND

        });
        // end socket
        
        // view render
        const userNotFriend = await User.find({
            _id: {$ne: myId},
            status: "active",
            deleted: false
        }).select("avatar fullName");

        res.render('client/pages/users/not-friend', {
            title: "Danh sách người dùng",
            userNotFriend: userNotFriend
        });
    }
    catch(error){

    }
}