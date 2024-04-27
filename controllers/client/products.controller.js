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
    // function get category consist of child category & connect in one array
    async function getAllRecordsOfCategory(parent_id) {
        // findObject
        const findObject = {
            status: "active",
            deleted: false
        }

        // get children category
        const childrenCategory = await productCategory.find({
            parent_id: parent_id,
            ...findObject
        });

        // create new array children category with syntax spread
        let category = [...childrenCategory];

        // scan & get all children category
        for(const child of childrenCategory){
            const children = await getAllRecordsOfCategory(child.id);
            // connect to array (nghiã là nối tất cả danh mục con và cha vào cùng 1 mảng)
            category = category.concat(children);
        }

        // return array 
        return category;
    }

    try{
        const findObject = {
            status: "active",
            deleted: false
        }

        // get category need to find (root category you click)
        const getCategoryBySlugCategory = await productCategory.findOne({
            ...findObject,
            slug: req.params.slugCategory
        }); 

        // get all children category
        const category = await getAllRecordsOfCategory(getCategoryBySlugCategory.id);
        // get all id of category child
        const idCategory = category.map(item => item.id);

        // count document
        const numberofRecords = await Product.countDocuments({
            product_category_id: {
                $in: [
                    getCategoryBySlugCategory.id,
                    ...idCategory
                ]
            },
            ...findObject
        });

        // get records of category
        const data = await Product.find({
            product_category_id: {
                $in: [
                    getCategoryBySlugCategory.id,
                    ...idCategory
                ]
            },
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