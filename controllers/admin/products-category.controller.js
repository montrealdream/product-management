// modeler
const { path_admin } = require('../../config/system');
const productCategory = require('../../models/products-category.model');

// helper
const filterHelper = require('../../helper/filter.helper');
const searchObjectHelper = require('../../helper/search.helper');
const paginationObjectHelper = require('../../helper/pagination.helper');
const createTreeHelper = require('../../helper/createTree.helper');

// system config 
const systemConfig = require('../../config/system');

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    try{
        const findObject = {
            deleted: false
        }

        // button filterHelper status
        const buttonFilterStatus = filterHelper.buttonStatus(req.query);
        if(req.query.status){
            findObject.status = req.query.status
        }

        // search keyword
        const searchObject = searchObjectHelper(req.query);
        if(req.query.keyword){
            findObject.title = searchObject.title;
        }

        // count document [extension: deleted, status, keyword]
        const numberOfRecords = await productCategory.countDocuments(findObject);

        const limitItem = 5;
        const paginationObject = paginationObjectHelper(req.query, limitItem, numberOfRecords);

        const records = await productCategory.find(findObject)
                                             .sort({position: 'asc'})
                                             .limit(paginationObject.limit)
                                             .skip(paginationObject.skip);
        
        res.render('admin/pages/products-category/index', {
            title:"Products Category",
            records: records,
            numberOfRecords: numberOfRecords,
            buttonFilterStatus: buttonFilterStatus,
            keyword: searchObject.keyword,
            pagination: paginationObject
        })
    }
    catch(error){

    }
}

// [GET] /admin/products-category/create
module.exports.createView = async (req, res) => {

    try{
        const findObject = {
            deleted: false
        }

        // create tree category
        const data = await productCategory.find(findObject);
         const categoryList = createTreeHelper(data);

        res.render('admin/pages/products-category/create', {
            title: "Create Category",
            categoryList: categoryList 
        })
    }
    catch(error){

    }
}

// [POST] /admin/products-category/create
module.exports.createCategory = async (req, res) => {
    try {
        const findObject = {
            deleted: false
        }

        // count document
        const numberOfRecords = await productCategory.countDocuments(findObject);

        if(!req.body.position){
            req.body.position = numberOfRecords + 1;
        }
        else{
            req.body.position = parseInt(req.body.position);
        }

        // if(req.file){
        //     req.body.thumbnail = `/uploads/${req.file.filename}`;
        // }

        const record = new productCategory(req.body);
        await record.save();

        req.flash('success', 'Create new category successfully');
        res.redirect(systemConfig.path_admin + `/products-category`);
    } 
    catch (error) {
        console.log(error)
        req.flash('error', 'Created new category fail');
        res.redirect('back');
    }
} 

// [PATCH] /admin/products-category/change-status/:id/:status
module.exports.changeStatus = async (req, res) => {
    try{
        const id = req.params.id;
        const status = req.params.status;

        await productCategory.updateOne(
            {_id: id},
            {status: status}
        );
        req.flash('success', 'Change the status of category successfully');
        res.redirect('back');
    }
    catch(error){
        req.flash('error', 'Change the status of category fail');
        res.redirect('back');
    }
}

// [DELETE] /admin/products-category/delete-soft/:id
module.exports.deleteSoft = async (req, res) => {
    try{
        const id = req.params.id;

        await productCategory.updateOne(
            {_id: id},
            {
                deleted: true,
                deletedAt: new Date()
            }
        );

        req.flash('success', 'Delete category successfully');
        res.redirect('back');
    }
    catch(error){
        req.flash('error', 'Delete category fail');
        res.redirect('back');
    }
}

// [PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
    try{
        const type = req.body.type;
        const ids = req.body.ids.split(", ");

        // number of category
        const numberOfRecords = ids.length;

        switch(type){
            case "active":
                await productCategory.updateMany(
                    {_id: {$in: ids}},
                    {status: "active"}
                );
                req.flash('success', `Active ${numberOfRecords} category successfully`);
                break;

            case "inactive":
                await productCategory.updateMany(
                    {_id: {$in: ids}},
                    {status: "inactive"}
                );
                req.flash('success', `Inactive ${numberOfRecords} category successfully`);
                break;

            case "position":
                for(item of ids){
                    // destructuring
                    const [id, position] = item.split("-");
                    await productCategory.updateOne(
                        {_id: id},
                        {position: position}
                    )
                }
                req.flash('success', `Change position ${numberOfRecords} category successfully`);
                break;

            case "delete":
                await productCategory.updateMany(
                    {_id: {$in: ids}},
                    {
                        deleted: true,
                        deletedAt: new Date()
                    }
                );
                req.flash('success', `Delete ${numberOfRecords} category successfully`);
                break;
        }
        res.redirect('back');
    }
    catch(error){
        req.flash('error', 'Change multi category fail');
        res.redirect('back');
    }
}

// [GET] /admin/products-category/edit/:id
module.exports.editView = async (req, res) => {
    try{
        const findObject = {
            _id: req.params.id
        }

        // create tree category
        const data = await productCategory.find({deleted: false});
        const categoryList = createTreeHelper(data);

        const record = await productCategory.findOne(findObject);

        
        res.render('admin/pages/products-category/edit', {
            title: "Edit category",
            record: record,
            categoryList: categoryList
        });
    }
    catch(error){
        req.flash('error', 'Go to edit category page fail');
        res.redirect('back');
    }
}

// [PATCH] /admin/products-category/edit/:id
module.exports.editCategory = async (req, res) => {
    try{
        const id = req.params.id;

        if(req.file){
            req.body.thumbnail = `/uploads/${req.file.filename}`;
        }
        await productCategory.updateOne(
            {_id: id},
            req.body
        );

        req.flash('success', 'Edit category successfully');
        res.redirect(systemConfig.path_admin + `/products-category`);
    }
    catch(error){
        req.flash('error', 'Edit category fail');
        res.redirect('back');
    }
}