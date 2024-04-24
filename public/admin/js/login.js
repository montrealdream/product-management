const formLogin = document.querySelector("#form-login");
const formSubmit = document.querySelector("#form-submit");
if(formLogin){
    formLogin.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = event.target.elements.email.value;
        const password = event.target.elements.password.value;
        
        const input = formSubmit.querySelector("input");
        input.value = `${email}-${password}`;
        formSubmit.submit();
    });
}

// dropdown header
const profile = document.querySelector(".profile");
const dropdown = document.querySelector(".dropdown");

profile.addEventListener("click", () => {
    dropdown.classList.toggle("none");
});
// end dropdown header