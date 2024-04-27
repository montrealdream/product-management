// model
const Product = require('../../models/product.model');

// helper
const productHelper = require('../../helper/products.helper');

// [GET] /
module.exports.index = async (req, res) => {
    try{
        const findObject = {
            status: "active",
            deleted: false,
            featured: "1"
        };

        const limitFeaturedRecords = 5;

        const data = await Product.find(findObject)
                                     .limit(limitFeaturedRecords);

        const records = productHelper.discountMany(data);
        
        res.render('client/pages/home/index', {
            title: "Trang chủ",
            records: records
        });
    }
    catch(error){

    }
    
}   