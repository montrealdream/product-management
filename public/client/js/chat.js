import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// GET ELEMENT
const boxChatBody = document.querySelector(".box-chat-body");
const contentChat = document.querySelector('input[name=content]');
const boxListTyping = document.querySelector(".box-list-typing");
const tooltip = document.querySelector('.tooltip');

// DEFAULT VARIBALE
const CLIENT_TYPING = "show";
const CLIENT_NOT_TYPING = "hidden";
const TIME_CLEAR_TYPING = 1500; // ~1.5s
let timeOut; //contain function setTimeout

// FUNCTION
const showTyping = () => {
    // send typing when you typeon icon
    socket.emit("CLIENT_SEND_TYPING", CLIENT_TYPING);

    clearTimeout(timeOut);
    // after three second not typing, typing will not appear
    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", CLIENT_NOT_TYPING);
    }, TIME_CLEAR_TYPING);
}

// UPLOAD MULTI IMAGES
const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images', {
    multiple: true,
    maxFileCount: 6
});
// END UPLOAD MULTI IMAGES

// AUTO SCROLL DOWN SCREEN
if(boxChatBody){
    boxChatBody.scrollTop = boxChatBody.scrollHeight;
}
// END AUTO SCROLL DOWN SCREEN

// CLIENT SEND MESSAGE 
const formChat = document.querySelector(".box-chat-form");
if(formChat){
    formChat.addEventListener("submit", (event) => {
        event.preventDefault();

        const content = event.target.content.value;
        const images = upload.cachedFileArray;

        if(content || images){
            // CLIENT SEND MESSAGE
            socket.emit("CLIENT_SEND_MESSAGE", {
                content: content,
                images: images
            });
            
            socket.emit("CLIENT_SEND_TYPING", CLIENT_NOT_TYPING); //when send mess then clear typing
        }

        event.target.content.value = ''; //clear input contain content
        upload.resetPreviewPanel(); // clear all selected images
        tooltip.classList.remove('shown'); // close table icon
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
    const images  = obj.images; // array
    
    let html = '';

    if(myID == user_id) {
        // mean you chat
        div.classList.add("out-going");

        if(content){
            html = `
                <p class="content">${content}</p>
            `;
        }
        if(images.length > 0){
            // image
            html += `<div class="images">`;  //open element div

            for(const image of images){
                html += `
                    <img src="${image}"/>
                `;
            }

            html += `</div>` //end element div
        }
    }
    else{ 
        // mean different people chat
        div.classList.add("in-comming");
        html = `
            <img src=${avatar}/>
            <div class="d-flex-column">
                <span class="fullName">${user_name}</span>
        `;
        if(content){
            html += `<p class="content">${content}</p>`;
        }

        if(images.length > 0){
            // image
            html += `<div class="images">`;  //open element div

            for(const image of images){
                html += `
                    <img src="${image}"/>
                `;
            }

            html += `</div>` //end element div
        }

        html += `</div>` //end element div class="d-flex-column"
    }
    
    // append for realtime
    div.innerHTML =  `
        ${html}
    `;

    boxChatBody.insertBefore(div, boxListTyping);

    // scroll down screen
    boxChatBody.scrollTop = boxChatBody.scrollHeight;
});
// END SERVER RETURN MESSAGE

// ICON
const buttonIcon = document.querySelector('.fa-face-smile');
const emojiPicker = document.querySelector('emoji-picker');
if(buttonIcon){
    // create tooltip
    Popper.createPopper(buttonIcon, tooltip);
    
    buttonIcon.addEventListener("click", (event) => {
        tooltip.classList.toggle('shown')
    });

    // get icon & insert
    emojiPicker.addEventListener('emoji-click', (event) => {
        const icon = event.detail.unicode;
        contentChat.value = contentChat.value + icon;

        const end = contentChat.value.length;
        contentChat.setSelectionRange(end, end);
        contentChat.focus();

        showTyping();
    });
}
// END ICON

// CLIENT SEND TYPING
contentChat.addEventListener("keyup", (event) => {
    // 13 mean ENTER
    if(event.keyCode != 13){
        showTyping();
    }
});
// END CLIENT SEND TYPING

// SERVER SEND TYPING
socket.on("SERVER_RETURN_TYPING", (obj) => {
    // get data of object
    const user_id = obj.user_id;
    const user_name =  obj.user_name;
    const type = obj.type;
    const avatar  = obj.avatar;

    if(type == CLIENT_TYPING){
        const uniqueTyping = boxListTyping.querySelector(`[user-id="${user_id}"]`);

        if(!uniqueTyping){
            // create new div content message
            const div = document.createElement('div');
            // set attribute for exits unique typing
            div.setAttribute("user-id", user_id);
            div.classList.add("box-typing");
    
            let html = `
                <div class="in-comming">
                    <img src=${avatar}/>
                    <div class="d-flex-column">
                        <span class="fullName"> ${user_name} </span>
                        <div class="inner-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            `;
            div.innerHTML = html;
            boxListTyping.appendChild(div);
        }
    }
    else {
        // child of box list typing
        const boxTyping = boxListTyping.querySelector(`.box-typing[user-id="${user_id}"]`);
        if(boxTyping){
            boxListTyping.removeChild(boxTyping);
        }   
    }

    // SCROLL DOWN SREEN
    boxChatBody.scrollTop = boxChatBody.scrollHeight;
});
// END SERVER SEND TYPING
