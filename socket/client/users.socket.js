// model 
const User = require('../../models/user.model');

module.exports = async (req, res) => {
    try{
        // my user
        const myId = res.locals.user.id;

        // LISTEN CLIENT CONNECT "ONLINE"
        _io.once('connection', (socket) => { 
            // CLIENT ADD FRIEND
            socket.on("CLIENT_ADD_FRIEND", async (idWantAddFriend) => {  
                // check id want add friend is valid
                const isValidId = await User.findOne({_id: idWantAddFriend}); 
                console.log(isValidId)
                // if(!idWantAddFriendValid){
                //     return;
                // }
                return;
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
            });
            // END CLIENT ADD FRIEND

            // CLIENT CANCEL ADD FRIEND
            socket.on("CLIENT_CANCEL_ADD_FRIEND", async (idWantCancelAddFriend) => {
                // check id want cancel friend is valid
                const idWantCancelAddFriendValid = await User.findOne({_id: idWantCancelAddFriend});
                if(!idWantCancelAddFriendValid){
                    return;
                }

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

            // CLIENT REFUSE ADD FRIEND
            socket.on("CLIENT_REFUSE_ADD_FRIEND", async idRefuseAddFriend => {
                // ckeck & clear accept friend in my document (B mean is a friend was request add me)
                const exitsB = await User.findOne({
                    _id: myId,
                    "acceptFriend" : idRefuseAddFriend
                });
                if(exitsB){
                    await User.updateOne(
                        {_id: myId}, 
                        {
                            $pull : {
                                acceptFriend: idRefuseAddFriend
                            }
                        }
                    );
                }
                
                // ckeck & clear request friend in B document (exitsMydId mean me in request add friend of them)
                const exitsMyId = await User.findOne({
                    _id: idRefuseAddFriend, 
                    "requestFriend" : myId
                });
                if(exitsMyId){
                    await User.updateOne(
                        {_id: idRefuseAddFriend}, 
                        {
                            $pull : {
                                requestFriend: myId
                            }
                        }
                    );
                }
            });
            // END CLIENT REFUSE ADD FRIEND

            // CLIENT ACCEPT ADD FRIEND
            socket.on("CLIENT_ACCEPT_ADD_FRIEND", async idAcceptedlAddFriend => {
                // id accept add friend is valid
                const idAcceptedlAddFriendValid = await User.findOne({_id: idAcceptedlAddFriend});
                if(!idAcceptedlAddFriendValid){
                    return;
                }

                // check & add "B" into listFriend array of my document
                const exitsB = await User.findOne({
                    _id: myId,
                    "acceptFriend": idAcceptedlAddFriend
                });
                if(exitsB){
                    // push {user_id, room_chat_id} into array listFriend
                    // pull idAcceptAddFriend outo array acceptFriend
                    await User.updateOne(
                        {_id: myId},
                        {
                            $push: {
                                listFriend: {
                                    user_id: idAcceptedlAddFriend,
                                    room_chat_id: ""
                                }
                            },
                            $pull: {
                                acceptFriend: idAcceptedlAddFriend
                            }
                        }
                    );
                }

                // check & add "me" into listFriend array of my document
                const exitsMyId = await User.findOne({
                    _id: idAcceptedlAddFriend,
                    "requestFriend": myId
                });
                if(exitsMyId){
                    await User.updateOne(
                        {_id: idAcceptedlAddFriend}, 
                        {
                            $push: {
                                listFriend: {
                                    user_id: myId,
                                    room_chat_id: ""
                                }
                            },
                            $pull: {
                                requestFriend: myId
                            }
                        }
                    );
                }
            });
            // END CLIENT ACCEPT ADD FRIEND

        });
    }
    catch(error){

    }
}