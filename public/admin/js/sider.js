
const bodyUserDefine = document.querySelector(".body");

const expand_btn = bodyUserDefine.querySelector(".expand-btn");

// // click sider
const siderItem = bodyUserDefine.querySelectorAll(".sider-body li a");
if(siderItem.length > 0){
    const url = window.location.href;
    // scan
    siderItem.forEach((item) => {
        if(item.href === url){
            const parent = item.closest('li');
            parent.classList.add("sider--active");
            console.log(item);
        }   
    });
}

// collapse sider
const siderItemLi = bodyUserDefine.querySelectorAll(".sider-body li");
if(siderItemLi.length > 0){
    // scan
    siderItemLi.forEach((item, index) => {
        item.addEventListener("mouseover", (event) => {
            const parentOfLi = siderItemLi[index+1].closest('ul');
            parentOfLi.classList.add("open-sub-sider");

            
        });
        item.addEventListener("mouseout", (event) => {
            const parentOfLi = siderItemLi[index+1].closest('ul');
            setTimeout(() => {
                parentOfLi.classList.remove("open-sub-sider");
            }, 1000);
            
            
        });
    });
}

// collapse sider
expand_btn.addEventListener("click", () => {
    bodyUserDefine.classList.toggle("collapsed");
});





