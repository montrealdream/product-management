
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