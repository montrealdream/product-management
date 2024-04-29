// button filter status
const buttonFilterStatus = document.querySelectorAll("[button-filter-status]");
if(buttonFilterStatus.length > 0) {
    // get url
    let url = new URL(window.location.href);
    // listen
    buttonFilterStatus.forEach(button => {
        button.addEventListener("click", (event) => {
            const status = button.getAttribute("button-filter-status");
            
            if(status){
                url.searchParams.set("status", status);
                url.searchParams.set("page", 1);
                
            }
            else {
                url.searchParams.delete("status");
                url.searchParams.delete("keyword");
                url.searchParams.delete("page");
            }
            // redirect url
            window.location.href = url.href;
        });
    })
}

// form search keyword (tìm bản ghi)
const formSearchKeyword = document.querySelector("#form-search-keyword");
if(formSearchKeyword){
    // get url
    let url = new URL(window.location.href);
    // listen form
    formSearchKeyword.addEventListener("submit", (event) => {
        event.preventDefault();
        const keyword = formSearchKeyword.querySelector("input").value;
        console.log(url.href);
        if(keyword){
            url.searchParams.set("keyword", keyword);
            // url.searchParams.set("page", 1);
        }
        // redirect url
        // window.location.href = url.href;
    });
}

// button pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if(buttonPagination.length > 0) {
    // get url
    let url = new URL(window.location.href);

    // listen
    buttonPagination.forEach(button => {
        button.addEventListener("click", (event) => {
            const page = button.getAttribute("button-pagination");
            
            url.searchParams.set("page", page);

            // redirect url
            window.location.href = url.href;
        });
    });
}

// check box
const tableRecord = document.querySelector("[table-record]");
if(tableRecord){
    // get checkbox all & single
    const checkboxAll = tableRecord.querySelector("input[name='checkbox-all']");
    const checkboxSingle = tableRecord.querySelectorAll("input[name='checkbox-single']");

    // count box
    const numberOfBox = checkboxSingle.length;

    // listen checkbox all
    checkboxAll.addEventListener("click" , (event) => {
        const status = checkboxAll.checked;
        
        // assgin 'true' or 'false' to checkbox single
        checkboxSingle.forEach(box => {
            box.checked = status;
        });
    });

    // listen checkbox single
    checkboxSingle.forEach(box => {
        box.addEventListener("click", (event) => {
            // count box was checked
            const numberOfBoxChecked = tableRecord.querySelectorAll("input[name='checkbox-single']:checked").length;
            
            if(numberOfBoxChecked === numberOfBox)
                checkboxAll.checked = true;
            else
                checkboxAll.checked = false;
        });
    });
}


// form change multi
const formChangeMulti = document.querySelector("#form-change-multi");
if(formChangeMulti){
    // listen submit
    formChangeMulti.addEventListener("submit", (event) => {
        event.preventDefault(); // prevent event submit of form

        // get checkbox was checked
        const checkboxSingle = tableRecord.querySelectorAll("input[name='checkbox-single']:checked");
        const type = event.target.elements.type.value; // get type select

        // get text, it will contain list id
        const inputIds = formChangeMulti.querySelector("input[name='ids']");

                                                                                                                                                                       
        // validate
        if(type === 'Default'){
            alert("Please chosen action !");
            return;
        }
        if(checkboxSingle.length === 0) {
            alert('Please chosen at least one checkbox !');
            return;
        }

        const isConfirm = confirm("Are you sure with your select");

        if(isConfirm){
            let ids = []; 
            if(type === 'position'){
                checkboxSingle.forEach(box => {
                    const id = box.value;
                     // get elemet parent of element box mean 'tr'
                    const ElementParent = box.closest("tr");

                    // get element contain position
                    const inputPosition = ElementParent.querySelector("input[name='position']");
                    const position = inputPosition.value;

                    // type transmit: id-position
                    ids.push(`${id}-${position}`);
                });
            }
            else {
                checkboxSingle.forEach(box => {
                    const id = box.value;
                    ids.push(id);
                });
            }
            //submit form
            inputIds.value = ids.join(", "); // assign to text
            formChangeMulti.submit(); 
        }   
    });
}
