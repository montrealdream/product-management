
const bodyUserDefine = document.querySelector(".body");

const expand_btn = bodyUserDefine.querySelector(".expand-btn");

// // click sider
const siderItem = bodyUserDefine.querySelectorAll(".sider-body li");
if(siderItem.length > 0){
    const url = window.location.href;
    // scan
    siderItem.forEach((item, index) => {
        const a = item.querySelector('a');
        if(a.href === url){
            const parentOfLi = siderItem[index+1].closest('ul');
            const parent = a.closest('li');

            parent.classList.add("sider--active");
            parentOfLi.classList.add("open-sub-sider");
        }   
    });
}


// collapse sider
expand_btn.addEventListener("click", () => {
    bodyUserDefine.classList.toggle("collapsed");
});





