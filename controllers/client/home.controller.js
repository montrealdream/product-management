// model
const Product = require('../../models/product.model');

// helper
const productHelper = require('../../helper/products.helper');

// [GET] /
module.exports.index = async (req, res) => {
    try{
        const findObject = {
            status: "active",
            deleted: false
        };

        // limit item
        const limitRecords = 5;

        // get data featured & new
        const dataFeatured = await Product.find({
                                              ...findObject,
                                              featured: "1"
                                           })
                                           .limit(limitRecords);
        
        const dataNew = await Product.find({
                                        ...findObject,            
                                     })
                                     .limit(limitRecords)
                                     .sort({position: 'desc'});
                                    
        // calc discount
        const recordsFeartured = productHelper.discountMany(dataFeatured);
        const recordsNew = productHelper.discountMany(dataNew);
        
        res.render('client/pages/home/index', {
            title: "Trang chủ",
            recordsFeartured: recordsFeartured,
            recordsNew: recordsNew
        });
    }
    catch(error){

    }
    
}   