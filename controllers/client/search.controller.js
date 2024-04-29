// model
const Product = require('../../models/product.model');

// helper
const productHelper = require('../../helper/products.helper');
const searchHelper = require('../../helper/search.helper');

// [GET] /search/
module.exports.index = async (req, res) => {
    const findObject = {
        status: "active",
        deleted: false
    }

    try{
        // get keyword & regex
        const keywordObject = searchHelper(req.query);
        if(req.query.keyword){
            findObject.title = keywordObject.title;
        }
        
        // count document
        const numberofRecords = await Product.countDocuments(findObject);

        // get document
        const data= await Product.find(findObject);

        // calc discount
        const records = productHelper.discountMany(data);

        res.render('client/pages/search/index', {
            title: "Kết quả tìm kiếm",
            numberofRecords: numberofRecords,
            records: records,
            keyword: keywordObject.keyword
        });
    }
    catch(error){

    }
}