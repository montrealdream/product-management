// file upload image
const fileUploadArea = document.querySelector(".file-upload-area");
if(fileUploadArea) {
    const inputFile = fileUploadArea.querySelector("input[type='file']");
    const imgUploadPreview = document.querySelector(".image-preview");
    const closeImage = document.querySelector("[close-image]");
    
    // when you in edit page
    const srcVariable = imgUploadPreview.getAttribute("src");
    if(srcVariable){
        if(srcVariable){
            fileUploadArea.style["display"] = "none";
            closeImage.style["display"] = "inline-block";
        }
    }

    // listen "click" area chose image
    fileUploadArea.addEventListener("click", (event) => {
        inputFile.click();
    });

    // listen "change" of input type file
    inputFile.addEventListener("change", (event) => {
        imgUploadPreview.src = URL.createObjectURL(event.target.files[0]);
        const srcImage = imgUploadPreview.getAttribute("src");
        
        if(srcImage){
            fileUploadArea.style["display"] = "none";
            closeImage.style["display"] = "inline-block";
        }
    });

    // listen "click" of close image
    closeImage.addEventListener("click", (even) => {
        inputFile.value = "";
        imgUploadPreview.src = "";
        fileUploadArea.style["display"] = "flex";
        closeImage.style["display"] = "none";
    });
}