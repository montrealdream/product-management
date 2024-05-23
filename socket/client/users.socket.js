// model 
const User = require('../../models/user.model');

module.exports = async (req, res) => {
    try{
        /**
         * QUY ĐỊNH:
                USER A: Nghĩa là của mình
                USER B: Là người Khác
         */
        // my user
        const myId = res.locals.user.id;

        // LISTEN CLIENT CONNECT "ONLINE"
        _io.once('connection', (socket) => { 
            // CLIENT ADD FRIEND
            socket.on("CLIENT_ADD_FRIEND", async (idWantAddFriend) => {  
                // check id want add friend is valid
                const isValidId = await User.findOne({_id: idWantAddFriend}); 
                if(!isValidId){
                    return;
                }

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


                // get length of acceptFriend of id want add friend
                const userB = await User.findOne({
                    _id: idWantAddFriend
                });

                // SERVER RETURN LENGTH OF ACCEPT FRIEND OF USER B
                const lengthAcceptFriends = userB.acceptFriend.length;
                socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                    userId: idWantAddFriend,
                    lengthAcceptFriends: lengthAcceptFriends
                });
                // END SERVER RETURN LENGTH OF ACCEPT FRIEND OF USER B

                // SERVER RETURN LENGTH REQUEST FRIEND
                // get length of requestFriend of my user
                const myUser = await User.findOne({_id: myId});

                const lengthRequestFriends = myUser.requestFriend.length;

                socket.emit("SERVER_RETURN_LENGTH_REQUEST_FRIEND", {
                    userId: myId,
                    lengthRequestFriends: lengthRequestFriends
                });
                // END SERVER RETURN LENGTH REQUEST FRIEND

                req.flash('success', "Gửi lời mời kết bạn thành công");
            });
            // END CLIENT ADD FRIEND

            // CLIENT CANCEL ADD FRIEND
            socket.on("CLIENT_CANCEL_ADD_FRIEND", async (idWantCancelAddFriend) => {
                // check id want cancel friend is valid
               // check id want add friend is valid
                const isValidId = await User.findOne({_id: idWantCancelAddFriend}); 
                if(!isValidId){
                    return;
                }

                // remove id'user want cancel add friend into field requestFriend in database
                const exitsB = await User.findOne({
                    _id: myId,
                    "requestFriend": idWantCancelAddFriend
                }).select("-tokenUser -password");
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
                }).select("-tokenUser -password");

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

                // SERVER RETURN LENGTH OF ACCEPT FRIEND OF USER B
                // get length of acceptFriend of id want add friend
                const userB = await User.findOne({
                    _id: idWantCancelAddFriend
                });
                
                
                const lengthAcceptFriends = userB.acceptFriend.length;
                socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                    userId: idWantCancelAddFriend,
                    lengthAcceptFriends: lengthAcceptFriends
                });
                // END SERVER RETURN LENGTH OF ACCEPT FRIEND OF USER B


                // SERVER RETURN LENGTH REQUEST FRIEND
                // get length of requestFriend of my user
                const myUser = await User.findOne({_id: myId});

                const lengthRequestFriends = myUser.requestFriend.length;
                
                socket.emit("SERVER_RETURN_LENGTH_REQUEST_FRIEND", {
                    userId: myId,
                    lengthRequestFriends: lengthRequestFriends
                    
                    /**hoặc có thể ghi như bên dưới nếu tên các biến giống nhau thì js nó vẫn hiểu
                    userId,
                    lengthRequestFriends
                    */
                });
                // END SERVER RETURN LENGTH REQUEST FRIEND
                
            });
            // END CLIENT CANCEL ADD FRIEND

            // CLIENT REFUSE ADD FRIEND
            socket.on("CLIENT_REFUSE_ADD_FRIEND", async idRefuseAddFriend => {
                // ckeck & clear accept friend in my document (B mean is a friend was request add me)
                const exitsB = await User.findOne({
                    _id: myId,
                    "acceptFriend" : idRefuseAddFriend
                }).select("-tokenUser -password");
                
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
                }).select("-tokenUser -password");
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
                const isValidId = await User.findOne({_id: idAcceptedlAddFriend}); 
                if(!isValidId){
                    return;
                }

                // check & add "B" into listFriend array of my document
                const exitsB = await User.findOne({
                    _id: myId,
                    "acceptFriend": idAcceptedlAddFriend
                }).select("-tokenUser -password");
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
                }).select("-password -tokenUser");

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

                // SERVER RETURN LENGTH LIST FRIEND (REAL TIME)
                // user A
                const getUserA = await User.findOne({_id: myId}).select("listFriend");

                // user B
                const getUserB = await User.findOne({_id: idAcceptedlAddFriend}).select("listFriend");

                _io.emit("SERVER_RETURN_LENGTH_LIST_FRIEND", {
                    // user A
                    idUserA: myId,
                    lengthListFriendUserA: getUserA.listFriend.length,

                    // user B
                    idUserB: idAcceptedlAddFriend,
                    lengthListFriendUserB: getUserB.listFriend.length
                });
                // // END SERVER RETURN LENGTH LIST FRIEND (REAL TIME)

                // SERVER RETURN LEGNTH ACCEPT FRIEND OF PEOPLE ACCEPT FRIEND (CỦA NGƯỜI CHẤP NHẬT KẾT BẠN)
                /**Cập nhật lại danh sách lời mời kết bạn của người chấp nhận kết bạn */
                const myUser = await User.findOne({_id: myId}).select("acceptFriend");

                socket.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                    userId: myId,
                    lengthAcceptFriends: myUser.acceptFriend.length
                });
                // END SERVER RETURN LEGNTH ACCEPT FRIEND OF PEOPLE ACCEPT FRIEND

                // SERVER RETURN LEGNTH REQUEST FRIEND OF PEOPLE ACCEPT FRIEND (CỦA NGƯỜI "ĐƯỢC" CHẤP NHẬN KẾT BẠN)
                /**Cập nhật lại danh sách lời mời kết bạn của người vừa được chấp nhận kết bạn */
                const userB = await User.findOne({_id: idAcceptedlAddFriend}).select("requestFriend");
                socket.broadcast.emit("SERVER_RETURN_LENGTH_REQUEST_FRIEND", {
                    userId: idAcceptedlAddFriend,
                    lengthRequestFriends: userB.requestFriend.length
                });
                // END SERVER RETURN LEGNTH REQUEST FRIEND OF PEOPLE ACCEPT FRIEND
            });
            // END CLIENT ACCEPT ADD FRIEND

        });
    }
    catch(error){

    }
}