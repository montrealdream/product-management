// model
const Product = require('../../models/product.model');

// [GET] /
module.exports.index = async (req, res) => {
    try{
        const findObject = {
            status: "active",
            deleted: false,
            featured: "1"
        };

        const limitFeaturedRecords = 5;

        const records = await Product.find(findObject)
                                     .limit(limitFeaturedRecords);

        res.render('client/pages/home/index', {
            title: "Trang chủ",
            records: records
        });
    }
    catch(error){

    }
    
}   