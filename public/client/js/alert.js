// close alert
const showAlert = document.querySelector(".show-alert");
if(showAlert){
    const closeAlert = document.querySelector(".close-alert");
    
    // listen "click" close alert
    closeAlert.addEventListener("click", (event) => {
        showAlert.classList.add("alert--hide");
    });

    // not "click"
    setTimeout(() => {
        showAlert.classList.add("alert--hide");
    }, 5000);
}