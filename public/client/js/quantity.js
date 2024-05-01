// quantity stock (page detail)
const Inputquantity = document.querySelector('input[name=quantity]');
const buttonQuantity = document.querySelectorAll("[button-quantity]");
const tableCart = document.querySelector('[table-cart]');


if(buttonQuantity.length > 0 && Inputquantity && !tableCart){
    const dataStock = document.querySelector('[data-stock]'); //mean max stock of product
    const maxStock = parseInt(dataStock.getAttribute("data-stock"));
    buttonQuantity.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
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
    Inputquantity.addEventListener("change", (event) => {
        if(parseInt(Inputquantity.value) > maxStock){
            Inputquantity.value = maxStock;
        }
    });
}

// quantity stokc (page cart)
if(tableCart){
    const buttonQuantity = tableCart.querySelectorAll("[button-quantity]");
    const inputQuantity  = tableCart.querySelectorAll("input[name='quantity']");

    // listen button
    buttonQuantity.forEach(button => {
        button.addEventListener("click", (event) => {
            parentOfButton = button.closest("div");
            const input = parentOfButton.querySelector("input[name='quantity']");
            const productId = input.getAttribute("data-id")
            // get status of button
            const status = button.getAttribute("button-quantity");
            if(status == "add" && parseInt(input.value) < input.max ){
                input.value = parseInt(input.value) + 1;
            }
            else if(status == "sub" && input.value > "0"){
                input.value = parseInt(input.value) - 1;
            }
            
            
            // redirect, input.value mean quantity
            window.location.href = `/cart/update/${productId}/${input.value}`;
        });
    });

    // listen change text input
    inputQuantity.forEach(input => {
        const productId = input.getAttribute("data-id");
        
        input.addEventListener("change", (event) => {
            if(input.value > input.max){
                input.value = input.max;
            }
            else if( input.value < 0){
                input.value = 0;
            }

            // redirect, input.value mean quantity
            window.location.href = `/cart/update/${productId}/${input.value}`;
        });
    });
}