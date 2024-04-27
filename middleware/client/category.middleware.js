// model
const productCategory = require('../../models/products-category.model');

// helper 
// const createTreeHelper = require('../../helper/createTree.helper');

module.exports.category = async (req, res, next) => {
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
        // get data category
        const data = await productCategory.find(findObject);
        
        // create tree
        const records = createTree(data);
        
        // use local
        res.locals.category = records;
        
        // next middleware
        next();
    }
    catch(error){

    }
}