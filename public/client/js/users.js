// CLICK ADD FRIEND
const btnAddFriend = document.querySelectorAll("[btn-add-friend]");
if(btnAddFriend.length > 0) {
    btnAddFriend.forEach(button => {
        button.addEventListener("click", (event) => {
            // add class "add" for box-user
            button.closest(".box-user").classList.add("add");
           
        });
    });
}
// END CLICK ADD FRIEND

// CLICK CANCEL FRIEND
const btnCancleFriend = document.querySelectorAll("[btn-cancel-friend]");
if(btnAddFriend.length > 0) {
    btnCancleFriend.forEach(button => {
        button.addEventListener("click", (event) => {
            // add class "add" for box-user
            button.closest(".box-user").classList.remove("add");
           
        });
    });
}
// END CLICK CANCEL FRIEND
