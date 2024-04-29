// model
const Product = require('../../models/product.model');

// helper
const productHelper = require('../../helper/products.helper');

// [GET] /search/
module.exports.index = async (req, res) => {
    const findObject = {
        status: "active",
        deleted: false
    }

    try{
        // get keyword
        const keyword = req.query.keyword;

        //regex keyword
        const regexKeyword = new RegExp(keyword, "i");
        
        // count document
        const numberofRecords = await Product.countDocuments({
            title: regexKeyword,
            ...findObject
        });

        // get document
        const data= await Product.find({
            title: regexKeyword,
            ...findObject
        });

        // calc discount
        const records = productHelper.discountMany(data);

        res.render('client/pages/search/index', {
            title: "Kết quả tìm kiếm",
            numberofRecords: numberofRecords,
            records: records
        });
    }
    catch(error){

    }
}