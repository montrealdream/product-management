// model
const Product = require('../../models/product.model');

// [GET] /products
module.exports.index = async (req, res) => {
    try{
        const findObject = {
            status: "active",
            deleted: false
        };

        // count document
        const numberofRecords = await Product.countDocuments(findObject);

        const records = await Product.find(findObject);

        res.render('client/pages/products/index', {
            title: "Products",
            records: records,
            numberofRecords: numberofRecords
        })
    }
    catch(error){

    }
}