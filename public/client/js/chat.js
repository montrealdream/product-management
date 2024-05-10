const formChat = document.querySelector(".box-chat #form-chat");
const chatInput = document.querySelector("#chat-input");
const boxListTyping = document.querySelector(".box-list-typing");

// CLIENT SEND MESSAGE
if(formChat){
    formChat.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const content = chatInput.value;
        // send msg with socketIO
        if(content){
            socket.emit("CLIENT_SEND_MESSAGE", content);
            chatInput.value = '';
            socket.emit("CLIENT_SEND_TYPING", "hidden");

            const exitsElementBoxTyping = document.querySelector(`[user-id="${objectData.userId}"]`);
            boxListTyping.removeChild(exitsElementBoxTyping);
        }   
    });
}
// END CLIENT SEND MESSAGE

// SEVER RETURN MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (objectData) => {
    const boxChatBody = document.querySelector('.box-chat .box-chat-body');
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const boxTyping = document.querySelector(".box-list-typing");

    const div = document.createElement("div");

    // append html for realtime
    let html = ``;

    if(myId != objectData.userId){
        div.classList.add("chat-comming");
        html = `
            <span class="fullName">${objectData.userName}</span>
            <div class="d-flex">
                <img src=${objectData.avatar}/>
                <span class="content">${objectData.content}</span>
            </div>
        `;
    }
    else{
        div.classList.add("chat-outgoing");
        html= `
            <span class="content">${objectData.content}</span>
        `;
    }

    div.innerHTML = `${html}`;

    boxChatBody.insertBefore(div, boxTyping);

    // scroll chat to bottom
    const newBodyChat = document.querySelector(".box-chat .box-chat-body");
    newBodyChat.scrollTop = newBodyChat.scrollHeight;
});
// END SEVER RETURN MESSAGE

// EMOJI PICKER
const emojiPicker = document.querySelector('emoji-picker');
if(emojiPicker){
    const inputChat = document.querySelector("#form-chat #chat-input")
    
    emojiPicker.addEventListener('emoji-click', (event) => {
        const icon = event.detail.unicode;
        inputChat.value = inputChat.value + icon;
        
        // close tab emoji
        emojiPicker.classList.toggle("d-none");
    });


}

const iconFaceSmile = document.querySelector(".fa-face-smile");
if(iconFaceSmile){
    iconFaceSmile.addEventListener("click", (event) => {
        emojiPicker.classList.toggle("d-none");
    });
}
// END EMOJI PICKER

 // TYPING
 let timeOutTyping;
 chatInput.addEventListener("keyup", (event) => {
    socket.emit("CLIENT_SEND_TYPING", "typing");

    clearTimeout(timeOutTyping);

    timeOutTyping = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden");
    }, 3000);
});
// END TYPING

// SERVER RETURN TYPING
// const boxListTyping = document.querySelector(".box-list-typing");
socket.on("SERVER_RETURN_TYPING", (objectData) => {

    if(objectData.type == "typing"){
        const div = document.createElement('div');
        const exitsElementBoxTyping = document.querySelector(`[user-id="${objectData.userId}"]`);

        if(!exitsElementBoxTyping){
             // add class
            div.classList.add("box-typing");
            div.classList.add("chat-comming");
            div.setAttribute("user-id", objectData.userId);

            // inner html
            let html = `
                <span class="fullName">${objectData.userName}</span>
                <div class="d-flex">
                    <img src=${objectData.avatar}/>
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;
            div.innerHTML = `${html}`;
            boxListTyping.appendChild(div);
        }
    }
    else{
        const exitsElementBoxTyping = document.querySelector(`[user-id="${objectData.userId}"]`);
        boxListTyping.removeChild(exitsElementBoxTyping);
    }
   

    // scroll chat to bottom
    const newBodyChat = document.querySelector(".box-chat .box-chat-body");
    newBodyChat.scrollTop = newBodyChat.scrollHeight;
});
// END SERVER RETURN TYPING

// SCROLL CHAT TO BOTTOM
const bodyChat = document.querySelector(".box-chat .box-chat-body");
if(bodyChat){
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
// END SCROLL CHAT TO BOTTOM


