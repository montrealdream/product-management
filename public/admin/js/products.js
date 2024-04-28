// button change status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonChangeStatus.length > 0){
    // get form
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path");
    // listen
    buttonChangeStatus.forEach(button => {
        button.addEventListener("click", (event) => {
            const id = button.getAttribute("data-id");
            let status = button.getAttribute("button-change-status");
            
            // toggle status
            status = (status === "active" ? "inactive" : "active");
            
            // submit form
            const action = path + `/${id}/${status}?_method=PATCH`;
            formChangeStatus.action = action;
            formChangeStatus.submit();
        });
    })
}

// button delete
const buttonDelete = document.querySelectorAll("[button-delete]");
if(buttonDelete.length > 0){
    // get form
    const formDeleteSoft = document.querySelector("#form-delete-soft");
    const path = formDeleteSoft.getAttribute("data-path");

    // listen
    buttonDelete.forEach(button => {
        button.addEventListener("click", (event) => {
            const id = button.getAttribute("data-id");
            
            // submit form: /admin/products/delete-soft/:id 
            const action = path + `/${id}?_method=DELETE`;
            formDeleteSoft.action = action;
            formDeleteSoft.submit();
        });
    });

}


// button restore
const buttonRestore = document.querySelectorAll("[button-restore]");
if(buttonRestore.length > 0){
    // get form
    const formRestore = document.querySelector("#form-restore");
    const path = formRestore.getAttribute('data-path');

    // listen
    buttonRestore.forEach(button => {
        button.addEventListener("click", (event) => {
            const id = button.getAttribute("data-id");

            // submit form :/admin/products/restore/:id
            const action = `${path}/${id}?_method=DELETE`;
            formRestore.action = action;
            formRestore.submit();
        });
    });
}
