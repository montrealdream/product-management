// model
const Product = require('../../models/product.model');
const productCategory = require('../../models/products-category.model');

// helper
const paginationHelper = require('../../helper/pagination.helper');
const productHelper = require('../../helper/products.helper');

// [GET] /products
module.exports.index = async (req, res) => {
    try{
        const findObject = {
            status: "active",
            deleted: false
        };

        // count document
        const numberofRecords = await Product.countDocuments(findObject);

        // pagination
        const paginationObject = paginationHelper(req.query, 20, numberofRecords);


        const data = await Product.find(findObject)
                                     .limit(paginationObject.limit)
                                     .skip(paginationObject.skip);

        // calc discount
        const records = productHelper.discountMany(data);

        res.render('client/pages/products/index', {
            title: "Products",
            records: records,
            numberofRecords: numberofRecords,
            pagination: paginationObject
        });
    }
    catch(error){

    }
}

// [GET] /products/:slugCategory
module.exports.categoryView = async (req, res) => {
    try{
        const findObject = {
            status: "active",
            deleted: false
        }

        // get category need to find
        const getCategory = await productCategory.findOne({
            ...findObject,
            slug: req.params.slugCategory
        });

        // count document
        const numberofRecords = await Product.countDocuments({
            product_category_id: getCategory.id,
            ...findObject
        });

        // get records of category
        const data = await Product.find({
            product_category_id: getCategory.id,
            ...findObject
        });
        
        // calc discount
        const records = productHelper.discountMany(data);

        res.render('client/pages/products/index', {
            title : 'Tủ sách',
            numberofRecords: numberofRecords,
            records: records
        });
    }
    catch(error){

    }
}