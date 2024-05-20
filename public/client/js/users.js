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

