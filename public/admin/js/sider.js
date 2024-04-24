
const bodyUserDefine = document.querySelector(".body");

const expand_btn = bodyUserDefine.querySelector(".expand-btn");

// collapse sider
expand_btn.addEventListener("click", () => {
    bodyUserDefine.classList.toggle("collapsed");
});


// // click sider
// const siderItem = bodyUserDefine.querySelectorAll(".sider-body li a");
// if(siderItem.length > 0){
//     siderItem.forEach(item => {
//         item.addEventListener("click", (event) => {
//             event.preventDefault();
//             item.classList.add("sider-active");
//             window.location = event.target.href;
//         });
//     })
// }


