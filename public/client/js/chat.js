import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// GET ELEMENT
const boxChatBody = document.querySelector(".box-chat-body");
const contentChat = document.querySelector('input[name=content]');
const boxListTyping = document.querySelector(".box-list-typing");
const tooltip = document.querySelector('.tooltip');
const formChat = document.querySelector(".box-chat-form");
const buttonTypeLike = formChat.querySelector("[type-msg='like']");
const buttonTypeSend = formChat.querySelector("[type-msg='send']");

// DEFAULT VARIBALE
const CLIENT_TYPING = "show";
const CLIENT_NOT_TYPING = "hidden";
const TIME_CLEAR_TYPING = 1500; // ~1.5s

let ICON_DEFAULT = '👍🏻'; //test

// FUNCTION
let timeOut; //contain function setTimeout

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
    const typeRoom = obj.typeRoom;
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
                <div class="d-flex-column">
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
        html += `</div>` //end element div class="d-flex-column"
    }
    else{ 
        // mean different people chat
        div.classList.add("in-comming");
        html = `
            <img src="${avatar}"/>
        `;

        if(typeRoom != "friend"){
            html += `
                <div class="d-flex-column">
                    <span class="fullName">${user_name}</span>
            `;
        }

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

    //Preview Image
    new Viewer(div);
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

       // alternate button "LIKE" & "SEND MESSENGER"
        if(contentChat.value.length > 0){
            buttonTypeLike.classList.add("d-none");
            buttonTypeSend.classList.remove("d-none");
        }
        else{
            buttonTypeLike.classList.remove("d-none");
            buttonTypeSend.classList.add("d-none");
        }
        // END alternate button "LIKE" & "SEND MESSENGER"

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

    // alternate button "LIKE" & "SEND MESSENGER"
    if(contentChat.value.length > 0){
        buttonTypeLike.classList.add("d-none");
        buttonTypeSend.classList.remove("d-none");
    }
    else{
        buttonTypeLike.classList.remove("d-none");
        buttonTypeSend.classList.add("d-none");
    }
    // END alternate button "LIKE" & "SEND MESSENGER"

});
// END CLIENT SEND TYPING

// SERVER SEND TYPING
socket.on("SERVER_RETURN_TYPING", (obj) => {
    console.log(obj.avatar);
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
                    <img src="${avatar}"/>
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

// Preview Image
if(boxChatBody) {
    const gallery = new Viewer(boxChatBody);
}
// End Preview Image

// CLIENT SEND LIKE (ONLY ONE)
buttonTypeLike.addEventListener("click", (event) => {
    socket.emit("CLIENT_SEND_ONLY_ICON_DEFAULT", ICON_DEFAULT);
});
// END CLIENT SEND LIKE (ONLY LIKE)

// SERVER RETURN ONLY ICON DEFAULT
socket.on("SERVER_RETURN_ONLY_ICON_DEFAULT", (obj) => {
    // get data of object
    const user_id = obj.user_id;
    const user_name =  obj.user_name;
    const icon = obj.icon;
    const avatar  = obj.avatar;

    // get my id
    const myID =  boxChatBody.getAttribute("user-id");

    // create div 
    const div = document.createElement('div');

    let html = ``;

    if(myID == user_id){
        div.classList.add("out-going");
        html = `
            <p class="content"> ${icon} </p>
            
        `;
    }

    else {
        div.classList.add("in-comming");

        html = `
            <img src=${avatar}/>
            <div class="d-flex-column">
                <span class="fullName"> ${user_name} </span>
                <p class="content"> ${icon} </p>
            </div>
        `;
    }

    div.innerHTML = `${html}`;

    boxChatBody.insertBefore(div, boxListTyping);

    // scroll down screen
    boxChatBody.scrollTop = boxChatBody.scrollHeight;
});
// END SERVER RETURN ONLY ICON DEFAULT


const imagePreview = document.querySelector(".image-preview");
imagePreview.addEventListener("change", (e) => {
    console.log(1);
});