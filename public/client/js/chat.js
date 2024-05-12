// GET ELEMENT
const boxChatBody = document.querySelector(".box-chat-body");
const contentChat = document.querySelector('input[name=content]');
// AUTO SCROLL DOWN SCREEN
boxChatBody.scrollTop = boxChatBody.scrollHeight;
// END AUTO SCROLL DOWN SCREEN

// CLIENT SEND MESSAGE 
const formChat = document.querySelector(".box-chat-form");
if(formChat){
    formChat.addEventListener("submit", (event) => {
        event.preventDefault();
        const content = event.target.content.value;

        // CLIENT SEND MESSAGE
        socket.emit("CLIENT_SEND_MESSAGE", content);
        event.target.content.value = '';
    });
}
// END CLIENT SEND MESSAGE 


// SERVER RETURN MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (obj) => {
    const myID =  boxChatBody.getAttribute("user-id");

    // create new div content message
    const div = document.createElement('div');

    // get data of object
    const user_id = obj.user_id;
    const user_name =  obj.user_name;
    const content = obj.content;
    const avatar  = obj.avatar;
    
    let html = '';

    if(myID == user_id) {
        // mean you chat
        div.classList.add("out-going");
        html = `
            <p class="content">${content}</p>
        `;
    }
    else{ 
        // mean different people chat
        div.classList.add("in-comming");
        html = `
            <img src=${avatar}/>
            <div class="d-flex-column">
                <span class="fullName">${user_name}</span>
                <p class="content">${content}</p>
            </div>
        `;
    }
    
    // append for realtime
    div.innerHTML =  `
        ${html}
    `;
    boxChatBody.appendChild(div);

    // scroll down screen
    boxChatBody.scrollTop = boxChatBody.scrollHeight;
});
// END SERVER RETURN MESSAGE

// ICON
const emojiPicker = document.querySelector('emoji-picker');
if(emojiPicker){
    emojiPicker.addEventListener('emoji-click', (event) => {
        const icon = event.detail.unicode;

        contentChat.value = contentChat.value + icon;
    });
}
// END ICON