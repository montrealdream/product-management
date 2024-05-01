
// // calc discount many product
module.exports.discountMany = (records) => {
     records.forEach(record => {
        const discount = record.discountPercentage;
        const price = record.price;

        const newPrice = price - ( price * ((discount) / 100));
        record.newPrice = newPrice.toFixed(0);
    });
    return records;
}

// calc discount one product
module.exports.discountOne = (record) => {
    const discount = record.discountPercentage;
    const price = record.price;

    const newPrice = price - ( price * ((discount) / 100));
    record.newPrice = newPrice.toFixed(0);
    
    return record
}

// calc (tính ra số tiền đc trừ)
module.exports.subPriceOne = (record) => {
    const discount = record.discountPercentage;
    const price = record.price;
    const subPrice = ( price * ((discount) / 100));
    return subPrice;
}