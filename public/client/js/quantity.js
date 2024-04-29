// quantity stock
const Inputquantity = document.querySelector('input[name=quantity]');
const buttonQuantity = document.querySelectorAll("[button-quantity]");

if(buttonQuantity.length > 0 && Inputquantity){
    const dataStock = document.querySelector('[data-stock]'); //mean max stock of product
    const maxStock = parseInt(dataStock.getAttribute("data-stock"));

    buttonQuantity.forEach(button => {
        button.addEventListener("click", (event) => {
            const status = button.getAttribute("button-quantity");
            

            if(status == "sub" && Inputquantity.value > "1"){
                Inputquantity.value = parseInt(Inputquantity.value) - 1;
            }
            else if(status == "add"){
                if(parseInt(Inputquantity.value) < maxStock)
                    Inputquantity.value = parseInt(Inputquantity.value) + 1;
            }
        });
    });
}