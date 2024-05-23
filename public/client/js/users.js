// CLICK ADD FRIEND
const btnAddFriend = document.querySelectorAll("[btn-add-friend]");
if(btnAddFriend.length > 0) {
    btnAddFriend.forEach(button => {
        button.addEventListener("click", (event) => {
            // add class "add" for box-user
            button.closest(".box-user").classList.add("add");

            // ger id user want to add friend & emit to sever
            const idWantAddFriend = button.getAttribute("btn-add-friend");
            
            socket.emit("CLIENT_ADD_FRIEND", idWantAddFriend);
        });
    });
}
// END CLICK ADD FRIEND

// CLICK CANCEL FRIEND
const btnCancleFriend = document.querySelectorAll("[btn-cancel-friend]");
if(btnCancleFriend.length > 0) {
    btnCancleFriend.forEach(button => {
        button.addEventListener("click", (event) => {
            // remove class "add" for box-user
            button.closest(".box-user").classList.remove("add");
           
            // get id user want to add friend & emit to sever
            const idWantCancelAddFriend = button.getAttribute("btn-cancel-friend");
        
            socket.emit("CLIENT_CANCEL_ADD_FRIEND", idWantCancelAddFriend);
        });
    });
}
// END CLICK CANCEL FRIEND

// CLICK REFUSE ADD FRIEND
const btnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if(btnRefuseFriend.length > 0){
    btnRefuseFriend.forEach(button => {
        button.addEventListener("click", (event) => {
            // add class "refuse" for box-user
            button.closest(".box-user").classList.add("refuse");

            //  get id user was accepted add friend & emit to sever
            const idRefuseAddFriend = button.getAttribute("btn-refuse-friend");

            socket.emit("CLIENT_REFUSE_ADD_FRIEND", idRefuseAddFriend);
        });
    });
}

// END CLICK REFUSE ADD FRIEND

// CLICK ACCEPT FRIEND
const btnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if(btnAcceptFriend.length > 0){
    btnAcceptFriend.forEach(button  => {
        button.addEventListener("click", (event) => {
            // add class "accepted" for box-user
            button.closest(".box-user").classList.add("accepted");

            // get id user was accepted add friend & emit to sever
            const idAcceptedlAddFriend = button.getAttribute("btn-accept-friend");

            socket.emit("CLIENT_ACCEPT_ADD_FRIEND", idAcceptedlAddFriend);
        });
    });
}
// END CLICK ACCEPT FRIEND


// LENGTH ACCREPT FRIEND
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", obj => {
    const badgeUsersAccept = document.querySelector(`[badge-users-accept="${obj.userId}"]`);
    if(badgeUsersAccept){
        badgeUsersAccept.innerHTML = obj.lengthAcceptFriends;
    }
});
// END LENGTH ACCREPT FRIEND

// LENGTH REQUEST FRIEND
socket.on("SERVER_RETURN_LENGTH_REQUEST_FRIEND", obj => {
    const badgeUsersRequest = document.querySelector(`[badge-users-request="${obj.userId}"]`);
    if(badgeUsersRequest){
        badgeUsersRequest.innerHTML = obj.lengthRequestFriends;
    }
});
// END LENGTH REQUEST FRIEND

// LENGTH LIST FRIEND
socket.on("SERVER_RETURN_LENGTH_LIST_FRIEND", (obj) => {
    const idUserA = obj.idUserA;
    const idUserB = obj.idUserB;

    const badgeUsersFriendsA = document.querySelector(`[badge-users-friends="${idUserA}"]`);
    const badgeUsersFriendsB = document.querySelector(`[badge-users-friends="${idUserB}"]`);

    if(badgeUsersFriendsA){
        badgeUsersFriendsA.innerHTML = obj.lengthListFriendUserA;
    }

    else if(badgeUsersFriendsB){
        badgeUsersFriendsB.innerHTML = obj.lengthListFriendUserB;
    }
});
// END LENGTH LIST FRIEND

// SERVER RETURN INFOR ACCEPT FRIEND
socket.on("SERVER_RETURN_INFOR_ACCEPT_FRIEND", obj => {
    const userIdB = obj.userId;
    const inforUserA = obj.inforUser;

    const userAcceptFriend = document.querySelector(`[user-accepts-friend="${userIdB}"]`);
   
    if(userAcceptFriend){
        const div = document.createElement('div');
        div.classList.add("col-5");

        div.innerHTML = `
            <div class="box-user">
                <img src=${inforUserA.avatar} />
                <div class="d-flex-column">
                    <span class="fullName">${inforUserA.fullName}</span>
                    <div class="d-flex"></div>
                    <span class="btn add-friend mb-5" btn-accept-friend=${inforUserA._id}>Xác nhận</span><span class="btn not-friend" btn-refuse-friend="66335cdfceb06789e749136e">Xóa</span>
                    <span class="btn not-friend" btn-deleted-friend=${inforUserA._id} disabled="disabled">Đã xóa</span><span class="btn add-friend" btn-accepted-friend="66335cdfceb06789e749136e" disabled="disabled">Đã chấp nhận</span>
                </div>
            </div>
        `;

        userAcceptFriend.appendChild(div);

        // beacause new box then can't listen button refuse or accept
        const newBtnRefuseFriend = document.querySelector("[btn-refuse-friend]");
        if(newBtnRefuseFriend){
            newBtnRefuseFriend.addEventListener("click", (event) => {
                // add class "refuse" for box-user
                newBtnRefuseFriend.closest(".box-user").classList.add("refuse");
    
                //  get id user was accepted add friend & emit to sever
                const idRefuseAddFriend = newBtnRefuseFriend.getAttribute("btn-refuse-friend");
    
                socket.emit("CLIENT_REFUSE_ADD_FRIEND", idRefuseAddFriend);
            });
        }

        const newBtnAcceptFriend = document.querySelector("[btn-accept-friend]");
        if(newBtnAcceptFriend){
            newBtnAcceptFriend.addEventListener("click", (event) => {
                // add class "accepted" for box-user
                newBtnAcceptFriend.closest(".box-user").classList.add("accepted");
    
                // get id user was accepted add friend & emit to sever
                const idAcceptedlAddFriend = newBtnAcceptFriend.getAttribute("btn-accept-friend");
    
                socket.emit("CLIENT_ACCEPT_ADD_FRIEND", idAcceptedlAddFriend);
            });
        }

    }
});
// END SERVER RETURN INFOR ACCEPT FRIEND

// SERVER RETURN ACCEPTED FRIEND (Khi B chấp nhận kết bạn của A, lúc A vừa mới gửi kết bạn, và B vẫn còn nằm ở giao diện dsach mọi người của A)
socket.on("SERVER_RETURN_ACCEPTED_FRIEND", obj => {
    const userIdA = obj.userIdA;
    const userIdB = obj.userIdB; //id của ng đc chấp nhận kết bạn

    const userNotFriend = document.querySelector(`[user-not-friend="${userIdB}"]`);

    const boxUserIdA = userNotFriend.querySelector(`[box-user-id="${userIdA}"]`);
    

    boxUserIdA.querySelector(".box-user").classList.add("accepted");
});
// SERVER RETURN ACCEPTED FRIEND 


// CLICK DELETE FRIEND
const btnDeleteFriend = document.querySelectorAll("[btn-delete-friend]");
if(btnDeleteFriend.length > 0){
    btnDeleteFriend.forEach(button => {
        button.addEventListener("click", (event) => {
            const isConFirm = confirm("Bạn có chắc muốn xóa kết bạn");

            if(isConFirm){
                const idWantDeleteFriend = button.getAttribute("btn-delete-friend");
                
                // mặc dù class refuse dùng cho từ chối, nhưng vẫn dùng lại được ở trg hợp này
                button.closest('.box-user').classList.add("refuse");

                socket.emit("CLIENT_DELETE_FRIEND", idWantDeleteFriend);
            }
        });
    });
}
// END CLICK DELETE FRIEND