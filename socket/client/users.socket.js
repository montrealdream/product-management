// model 
const User = require('../../models/user.model');
const RoomChat = require('../../models/rooms-chat.model');

module.exports = async (req, res) => {
    try{
        /**
         * QUY ĐỊNH:
                USER A: Nghĩa là của mình
                USER B: Là người Khác (requestID)
         */
        
        // my user
        const myId = res.locals.user.id;

        // LISTEN CLIENT CONNECT "ONLINE"
        _io.once('connection', (socket) => { 
            // **CLIENT ADD FRIEND
            socket.on("CLIENT_ADD_FRIEND", async (requestID) => {  
                // kiểm tra xem ID mình GỬI KẾT BẠN có tồn tại không ?
                const isValidRequestID = await User.findOne({
                    _id: requestID
                }).select("-password -tokenUser"); 

                if(!isValidRequestID){
                    return;
                }

                // tìm xem trong danh sách GỬI YÊU CẦU KẾT BẠN của UserA đã tồn tại UserB chưa ?
                const existUserB = await User.findOne({
                    _id: myId,
                    "requestFriend": requestID
                }).select("-password -tokenUser"); 

                if(!existUserB){s
                    await User.updateOne(
                        {_id: myId},
                        {
                            $push: {
                                requestFriend: requestID
                            }
                        }
                    );
                }
            
                // tìm xem trong danh sách LỜI MỜI KẾT BẠN của UserB đã tồn tại userA chưa ?
                const existUserA = await User.findOne({
                    _id: requestID,
                    "acceptFriend": myId
                });

                if(!existUserA){
                    await User.updateOne(
                        {_id: requestID},
                        {
                            $push: {
                                acceptFriend: myId
                            }
                        }
                    );
                }

                // SERVER RETURN LENGTH OF ACCEPT FRIEND OF USER B
                
                const infoUserB = await User.findOne({
                    _id: requestID
                }).select("-password -tokenUser");
                    
                // lấy độ dài của danh sách LỜI MỜI KẾT BẠN của UserB
                const lengthAcceptFriends = infoUserB.acceptFriend.length;

                // trả về độ dài (tức số lượng) LỜI MỜI KẾT BẠN CỦA UserB
                socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                    userId: requestID,
                    lengthAcceptFriends: lengthAcceptFriends
                });
                // END SERVER RETURN LENGTH OF ACCEPT FRIEND OF USER B

                // SERVER RETURN LENGTH REQUEST FRIEND
                const infoUserA = await User.findOne({
                    _id: myId
                }).select("-password -tokenUser");

                // lấy độ dài của danh sách GỬI YÊU CẦU KẾT BẠN của UserA
                const lengthRequestFriends = infoUserA.requestFriend.length;

                // trả về độ dài (tức số lượng) GỬI YÊU CẦU KẾT BẠN của UserA
                socket.emit("SERVER_RETURN_LENGTH_REQUEST_FRIEND", {
                    userId: myId,
                    lengthRequestFriends: lengthRequestFriends
                });
                // END SERVER RETURN LENGTH REQUEST FRIEND

                // SERVER RETURN INFOR USER ACCEPT FRIEND (TRẢ VỀ INFO CỦA NGƯỜI GỬI LỜI MỜI KẾT BẠN CHO MÌNH)
                socket.broadcast.emit("SERVER_RETURN_INFOR_ACCEPT_FRIEND", {
                    userId: requestID,
                    inforUser: infoUserA 
                });
                // END SERVER RETURN INFOR USER ACCEPT FRIEND (TRẢ VỀ INFO CỦA NGƯỜI GỬI LỜI MỜI KẾT BẠN CHO MÌNH)
            });
            // **END CLIENT ADD FRIEND

            // **CLIENT CANCEL ADD FRIEND
            socket.on("CLIENT_CANCEL_ADD_FRIEND", async (requestID) => {
                // kiểm tra xem ID mình muốn HỦY GỬI KẾT BẠN có tồn tại không ?
                const isValidRequestID = await User.findOne({_id: requestID}); 
                if(!isValidRequestID){
                    return;
                }

                // tìm xem trong danh sách GỬI YÊU CẦU KẾT BẠN của UserA đã tồn tại UserB chưa ?
                const existUserB = await User.findOne({
                    _id: myId,
                    "requestFriend": requestID
                }).select("-tokenUser -password");

                if(existUserB){
                    await User.updateOne(
                        {_id: myId},
                        {
                            $pull: {
                                requestFriend: requestID
                            }
                        }
                    );
                }

                // tìm xem trong danh sách LỜI MỜI KẾT BẠN của UserB đã tồn tại UserA chưa ?
                const existUserA = await User.findOne({
                    _id: requestID,
                    "acceptFriend": myId
                }).select("-tokenUser -password");

                if(existUserA){
                    await User.updateOne(
                        {_id: requestID},
                        {
                            $pull: {
                                acceptFriend: myId
                            }
                        }
                    );
                }

                // SERVER RETURN LENGTH OF ACCEPT FRIEND OF USER B
                const infoUserB = await User.findOne({
                    _id: requestID
                }).select("-tokenUser -password");
                
                // lấy độ dài danh sách LỜI MỜI KẾT BẠN của UserB
                const lengthAcceptFriends = infoUserB.acceptFriend.length;

                socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                    userId: requestID,
                    lengthAcceptFriends: lengthAcceptFriends
                });
                // END SERVER RETURN LENGTH OF ACCEPT FRIEND OF USER B


                // SERVER RETURN LENGTH REQUEST FRIEND
                const infoUserA = await User.findOne({
                    _id: myId
                }).select("-tokenUser -password");;

                 // lấy độ dài danh sách GỬI KẾT BẠN của UserA
                const lengthRequestFriends = infoUserA.requestFriend.length;
                
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
            // **END CLIENT CANCEL ADD FRIEND

            // **CLIENT REFUSE ADD FRIEND
            socket.on("CLIENT_REFUSE_ADD_FRIEND", async requestID => {
                // tìm xem trong danh sách LỜI MỜI KẾT BẠN của UserA đã tồn tại UserB chưa ?
                const existUserB = await User.findOne({
                    _id: myId,
                    "acceptFriend" : requestID
                }).select("-tokenUser -password");
                
                if(existUserB){
                    await User.updateOne(
                        {_id: myId}, 
                        {
                            $pull : {
                                acceptFriend: requestID
                            }
                        }
                    );
                }
                
                // tìm xem trong danh sách GỬI LỜI MỜI KẾT BẠN của UserB đã tồn tại UserA chưa ?
                const existUserA = await User.findOne({
                    _id: requestID, 
                    "requestFriend" : myId
                }).select("-tokenUser -password");
                
                if(existUserA){
                    await User.updateOne(
                        {_id: requestID}, 
                        {
                            $pull : {
                                requestFriend: myId
                            }
                        }
                    );
                }

                // SERVER RETURN LENGTH OF ACCEPT FRIEND OF ME
                // get length of acceptFriend of id want add friend
                const infoUserA = await User.findOne({
                    _id: myId
                }).select("-password -tokenUser");
                
                // lấy độ dài danh sách LỜI MỜI KẾT BẠN của UserA
                const lengthAcceptFriends = infoUserA.acceptFriend.length;

                socket.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                    userId: myId,
                    lengthAcceptFriends: lengthAcceptFriends
                });
                // END SERVER RETURN LENGTH OF ACCEPT FRIEND OF USER B

                // SERVER RETURN LENGTH REQUEST FRIEND
                const infoUserB = await User.findOne({
                    _id: requestID
                }).select("-password -tokenUser");

                // lấy độ dài danh sách GỬI LỜI MỜI KẾT BẠN của UserB
                const lengthRequestFriends = infoUserB.requestFriend.length;
                
                socket.broadcast.emit("SERVER_RETURN_LENGTH_REQUEST_FRIEND", {
                    userId: requestID,
                    lengthRequestFriends: lengthRequestFriends
                    
                    /**hoặc có thể ghi như bên dưới nếu tên các biến giống nhau thì js nó vẫn hiểu
                    userId,
                    lengthRequestFriends
                    */
                });
                // END SERVER RETURN LENGTH REQUEST FRIEND
            });
            // **END CLIENT REFUSE ADD FRIEND

            // **CLIENT ACCEPT ADD FRIEND
            socket.on("CLIENT_ACCEPT_ADD_FRIEND", async (requestID) => {
                // kiểm tra xem ID mình CHẤP NHẬN KẾT BẠN có tồn tại không ?
                const isValidRequestID = await User.findOne({
                    _id: requestID
                }).select("-password -tokenUser");
                
                if(!isValidRequestID){
                    return;
                }

                // kiểm tra xem trong LỜI MỜI KẾT BẠN CỦA UserA có tồn tại UserB không ?
                const existUserB = await User.findOne({
                    _id: myId,
                    "acceptFriend": requestID
                }).select("-tokenUser -password");

                if(existUserB){
                    // push {user_id, room_chat_id} into array listFriend
                    // pull idAcceptAddFriend outo array acceptFriend
                    await User.updateOne(
                        {_id: myId},
                        {
                            $push: {
                                listFriend: {
                                    user_id: requestID,
                                    room_chat_id: roomChat.id
                                }
                            },
                            $pull: {
                                acceptFriend: requestID
                            }
                        }
                    );
                }

                // kiểm tra xem trong danh sách GỬI KẾT BẠN CỦA UserB có tồn tại UserA không ?
                const existUserA = await User.findOne({
                    _id: requestID,
                    "requestFriend": myId
                }).select("-password -tokenUser");

                if(existUserA){
                    await User.updateOne(
                        {_id: requestID}, 
                        {
                            $push: {
                                listFriend: {
                                    user_id: myId,
                                    room_chat_id: roomChat.id
                                }
                            },
                            $pull: {
                                requestFriend: myId
                            }
                        }
                    );
                }

                // Tạo phòng chat (khi kết bạn)
                const objRoomChat = {
                    typeRoom: "friend",
                    users: [
                        {
                            user_id: myId,
                            role: "SuperAdmin"
                        },
                        {
                            user_id: requestID,
                            role: "SuperAdmin"
                        }
                    ]
                }
                const roomChat = new RoomChat(objRoomChat);
                await roomChat.save();
                // END Tạo phòng chat (khi kết bạn)

                // SERVER RETURN LENGTH LIST FRIEND (REAL TIME)
                // user A
                const getUserA = await User.findOne({_id: myId}).select("listFriend");

                // user B
                const getUserB = await User.findOne({_id: requestID}).select("listFriend");

                _io.emit("SERVER_RETURN_LENGTH_LIST_FRIEND", {
                    // user A
                    idUserA: myId,
                    lengthListFriendUserA: getUserA.listFriend.length,

                    // user B
                    idUserB: requestID,
                    lengthListFriendUserB: getUserB.listFriend.length
                });
                // // END SERVER RETURN LENGTH LIST FRIEND (REAL TIME)

                // SERVER RETURN LEGNTH ACCEPT FRIEND OF PEOPLE ACCEPT FRIEND (CỦA NGƯỜI CHẤP NHẬT KẾT BẠN)
                /**Cập nhật lại danh sách lời mời kết bạn của người chấp nhận kết bạn */
                const infoUserA = await User.findOne({_id: myId}).select("acceptFriend");

                socket.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                    userId: myId,
                    lengthAcceptFriends: infoUserA.acceptFriend.length
                });
                // END SERVER RETURN LEGNTH ACCEPT FRIEND OF PEOPLE ACCEPT FRIEND

                // SERVER RETURN LEGNTH REQUEST FRIEND OF PEOPLE ACCEPT FRIEND (CỦA NGƯỜI "ĐƯỢC" CHẤP NHẬN KẾT BẠN)
                /**Cập nhật lại danh sách lời mời kết bạn của người vừa được chấp nhận kết bạn */
                const infoUserB = await User.findOne({_id: requestID}).select("requestFriend");
                socket.broadcast.emit("SERVER_RETURN_LENGTH_REQUEST_FRIEND", {
                    userId: requestID,
                    lengthRequestFriends: infoUserB.requestFriend.length
                });
                // END SERVER RETURN LEGNTH REQUEST FRIEND OF PEOPLE ACCEPT FRIEND

                // SERVER RETURN ACCEPTED FRIEND (Khi B chấp nhận kết bạn của A, lúc A vừa mới gửi kết bạn, và B vẫn còn nằm ở giao diện dsach mọi người của A)
                socket.broadcast.emit("SERVER_RETURN_ACCEPTED_FRIEND", {
                    userIdA: myId, //id của ng chấp nhận kết bạn
                    userIdB: requestID //id của ng` đc chấp nhận kết bạn
                });
                // END SERVER RETURN ACCEPTED FRIEND
            });
            // **END CLIENT ACCEPT ADD FRIEND
            
            // **CLIENT DELETE FRIEND (Xóa kết bạn)
            socket.on("CLIENT_DELETE_FRIEND", async (requestID) => {
                // kiểm tra xem trong danh sách bạn bè của UserA có tồn tại UserB không ?
                const existUserB =  await User.findOne({_id: requestID});
                if(existUserB){
                    await User.updateOne(
                        {_id: myId},
                        {
                            $pull: {
                                listFriend: {
                                    user_id: requestID
                                }
                            }
                        }
                    );
                }

                // kiểm tra xem trong danh sách bạn bè của UserB có tồn tại UserA không ?
                const existUserA = await User.findOne({_id: myId});
                if(existUserA){
                    await User.updateOne(
                        {_id: requestID},
                        {
                            $pull: {
                                listFriend: {
                                    user_id: myId
                                }
                            }
                        }
                    );
                }

                // SERVER RETURN LENGTH LIST FRIEND (REAL TIME)
                // user A
                const getUserA = await User.findOne({_id: myId}).select("listFriend");

                // user B
                const getUserB = await User.findOne({_id: requestID}).select("listFriend");

                _io.emit("SERVER_RETURN_LENGTH_LIST_FRIEND", {
                    // user A
                    idUserA: myId,
                    lengthListFriendUserA: getUserA.listFriend.length,

                    // user B
                    idUserB: requestID,
                    lengthListFriendUserB: getUserB.listFriend.length
                });
                // END SERVER RETURN LENGTH LIST FRIEND (REAL TIME)
                
                // UPDATE UI OF B WHEN B DELETED BY A
                // cập nhật giao diện của UserA khi B xóa
                socket.broadcast.emit("UPDATE_UI_OF_B_WHEN_DELETED_BY_A", {
                    userIdB: requestID,
                    userIdA: myId
                });
                // END UPDATE UI OF B WHEN B DELETED BY A
            });
            // **END CLIENT DELETE FRIEND (Xóa kết bạn)
        });
    }
    catch(error){

    }
}