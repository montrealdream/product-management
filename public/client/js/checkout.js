// get address change 
const inputAddress = document.querySelector("input[name='address']");
if(inputAddress){
    inputAddress.addEventListener("input", (event) => {
        // event input để biết đang gõ luôn
        const inputTransport = document.querySelector("#input-form-transport");
        const label = document.querySelector("#label-transport");

        if(inputAddress.value != ""){
            // change to type radio
            inputTransport.type = "radio";
            inputTransport.checked = true;
            inputTransport.classList.remove("input-form-transport");
            inputTransport.classList.add("input-radio");
            // inputTransport.classList.add("border-line");
            label.classList.remove("hide-label");
        }
        else{
            inputTransport.type = "text";
            inputTransport.classList.add("input-form-transport");
            inputTransport.classList.remove("input-radio");
            label.classList.add("hide-label");
        }
        // add class
    });
    
    
}