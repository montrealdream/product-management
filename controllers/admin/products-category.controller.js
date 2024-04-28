// modeler
const { path_admin } = require('../../config/system');
const productCategory = require('../../models/products-category.model');
const Account = require('../../models/account.model');

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

        // pagination
        const limitItem = 5;
        const paginationObject = paginationObjectHelper(req.query, limitItem, numberOfRecords);

        const records = await productCategory.find(findObject)
                                             .sort({position: 'asc'})
                                             .limit(paginationObject.limit)
                                             .skip(paginationObject.skip);
        
        // get user create & update document
        for(let record of records){
            const createdUser = await Account.findOne({
                _id: record.createdBy.account_id
            });

            if(createdUser){
                record.creator = createdUser.fullName;
            }

            // get last user update document
            const sizeOfUpdatedBy = record.updatedBy.length;
            if(sizeOfUpdatedBy > 0){
                let updatedUser = await Account.findOne({
                    _id: record.updatedBy[sizeOfUpdatedBy-1].account_id
                });
                if(updatedUser){
                    record.updater = updatedUser.fullName,
                    record.actionOfUpdater = record.updatedBy[sizeOfUpdatedBy-1].action;
                }
            }
            else{
                record.updater = record.creator;
                record.actionOfUpdater = "Tạo danh mục"
            }
        }   
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

        // user create doucment
        req.body.createdBy = {
            account_id: res.locals.user.id
        }

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
                deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: new Date()
                }
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

        // if(req.file){
        //     req.body.thumbnail = `/uploads/${req.file.filename}`;
        // }
        
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

// [GET] /admin/products-category/trash
module.exports.trash = async (req, res) => {
    try{
        const findObject = {
            deleted: true
        }

        // count document
        const numberOfRecords = await productCategory.countDocuments(findObject);

        // pagination
        const paginationObject = paginationObjectHelper(req.query, 5, numberOfRecords);
        // get document
        const records = await productCategory.find(findObject)
                                             .limit(findObject.limit)
                                             .skip(findObject.skip);

        // get user delete document
        for(let record of records){
            const deletedUser = await Account.findOne({
                _id: record.deletedBy.account_id
            });

            if(deletedUser){
                record.deleter = deletedUser.fullName
            }
        }

        res.render('admin/pages/products-category/trash', {
            title : "Danh mục đã xóa",
            numberOfRecords: numberOfRecords,
            records : records,
            pagination: paginationObject
        })

    }
    catch(error){

    }
}

// [DELETE] /admin/products-category/restore/:id
module.exports.restore = async (req, res) => {
    try{
        await productCategory.updateOne(
            {_id: req.params.id},
            {
                deleted: false,
                $push: {
                    updatedBy: {
                        account_id: res.locals.user.id,
                        action: "Khôi phục danh mục đã xóa",
                        deletedAt: new Date()
                    }
                }
            }
        );
        req.flash('success', 'Khôi phục danh mục đã xóa thành công');
        res.redirect('back');
    }
    catch(error){

    }
}