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
           
            // ger id user want to add friend & emit to sever
            const idWantCancelAddFriend = button.getAttribute("btn-cancel-friend");
        
            socket.emit("CLIENT_CANCEL_ADD_FRIEND", idWantCancelAddFriend);
        });
    });
}
// END CLICK CANCEL FRIEND
