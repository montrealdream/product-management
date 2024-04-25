
const bodyUserDefine = document.querySelector(".body");

const expand_btn = bodyUserDefine.querySelector(".expand-btn");

// // click sider
const siderItem = bodyUserDefine.querySelectorAll(".sider-body li a");
if(siderItem.length > 0){
    const url = window.location.href;
    // scan
    siderItem.forEach((item) => {
        if(item.href === url){
            item.classList.add("sider--active");
        }   
    });
}

// collapse sider
expand_btn.addEventListener("click", () => {
    bodyUserDefine.classList.toggle("collapsed");
});





