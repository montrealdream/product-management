// model
const Product = require('../../models/product.model');
const productCategory = require('../../models/products-category.model');

// helper
const paginationHelper = require('../../helper/pagination.helper');

// [GET] /products
module.exports.index = async (req, res) => {
    // functionc create tree category
    function createTree(arr, parent_id = "") {
        let tree = [];

        arr.forEach(item => {
            if(item.parent_id === parent_id){
                const newItem = item;
                const children = createTree(arr, item.id);
                
                if(children.length > 0){
                    newItem.children = children;
                }

                tree.push(newItem);
            }
        });

        return tree;
    }

    try{
        const findObject = {
            status: "active",
            deleted: false
        };

        // get category && create tree category
        const recordsCategory = await productCategory.find(findObject);
        const treeCategory = createTree(recordsCategory);

        // count document
        const numberofRecords = await Product.countDocuments(findObject);

        // pagination
        const paginationObject = paginationHelper(req.query, 20, numberofRecords);


        const records = await Product.find(findObject)
                                     .limit(paginationObject.limit)
                                     .skip(paginationObject.skip);

        // calc discount
        records.forEach(record => {
            const discount = record.discountPercentage;
            const price = record.price;

            const newPrice = price - ( price * ((discount) / 100));
            record.newPrice = newPrice.toFixed(0);
        });

        

        res.render('client/pages/products/index', {
            title: "Products",
            records: records,
            numberofRecords: numberofRecords,
            pagination: paginationObject,
            category: treeCategory
        })
    }
    catch(error){

    }
}