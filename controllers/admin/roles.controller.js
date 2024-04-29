// model
const Role = require('../../models/roles.model');

// system config
const systemConfig = require('../../config/system');

// helper
const paginationHelper = require('../../helper/pagination.helper');

//  [GET] /admin/roles
module.exports.index = async (req, res) => {
    try{
        const findObject = {
            deleted: false
        }

        // count document
        const numberOfRecords = await Role.countDocuments(findObject);

        // pagination
        const paginationObject = paginationHelper(req.query, 5, numberOfRecords);

        // get document
        const records = await Role.find(findObject);

        res.render('admin/pages/roles/index', {
            title: "Role",
            records: records,
            numberOfRecords: numberOfRecords,
            pagination: paginationObject
        })
    }
    catch(error){
        req.flash('error', 'Go to role fail');
        res.redirect('back');
    }
}

// [GET] /admin/roles/create
module.exports.createView = async (req, res) => {
    try{
        res.render('admin/pages/roles/create', {
            title: "Create Role"
        });
    }
    catch(error){
        req.flash('error', 'Go to create role page  fail');
        res.redirect('back');
    }
}

// [POST] /admin/roles/create
module.exports.createRole = async (req, res) => {
    try{
        // save on Database
        const record = new Role(req.body);
        await record.save();

        req.flash('success', 'Create new role successfully');
        res.redirect(systemConfig.path_admin + `/roles`);
    }
    catch(error){
        req.flash('error', 'Create new role fail');
        res.redirect('back');
    }
}

// [DELETE] /admin/roles/delete-soft/:id
module.exports.deleteSoft = async (req, res) => {
    try{
        const id = req.params.id;

        await Role.updateOne(
            {_id: id},
            {
                deleted: true,
                deletedAt: new Date()
            }
        );
        req.flash('success', 'Delete role successfully');
        res.redirect('back');
    }
    catch(error){
        req.flash('error', 'Delete role fail');
        res.redirect('back');
    }
}

// [GET] /admin/roles/edit/:id
module.exports.editView = async (req, res) => {
    try{
        const findObject = {
            _id: req.params.id,
            deleted: false
        }

        const record = await Role.findOne(findObject);

        res.render('admin/pages/roles/edit', {
            title: "Edit role",
            record: record
        });
    }
    catch(error){
        req.flash('error', 'Go to edit role page fail');
        res.redirect('back');
    }
}

// [POST] /admin/roles/edit/:id
module.exports.editRole = async (req, res) => {
    try{
        const id = req.params.id;

        await Role.updateOne(
            {_id: id},
            req.body
        );
        
        req.flash('success', 'Edit role successfully');
        res.redirect(systemConfig.path_admin + `/roles`);
    }
    catch(error){
        req.flash('error', 'Edit role fail');
        res.redirect('back');
    }
}

// [GET /admin/roles/trash
module.exports.trash = async (req, res) => {
    try{

        const numberOfRecords = await Role.countDocuments({
            deleted: true
        });

        const records = await Role.find({
            deleted: true
        });

        res.render('admin/pages/roles/trash', {
            title: "Quyền đã xóa",
            numberOfRecords: numberOfRecords,
            records: records
        });
    }
    catch(error){

    }
}

// ----------------PERMISSION-----------------------//
// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    try{
        const records = await Role.find({deleted: false});
        res.render('admin/pages/roles/permissions', {
            title: "Phân quyền",
            records: records
        })
    }
    catch(error){

    }
   
}

// [PATCH] /admin/roles/permissions
module.exports.changePermissions = async (req, res) => {
    try{
        const permissions = JSON.parse(req.body.permissions);
        
        for(const item of permissions){
            const id = item.id;
            const permissionsArray = item.permissions;

            await Role.updateOne(
                {_id: id},
                {permissions: permissionsArray}
            );
        }
        req.flash('success', 'Thay đổi phân quyền thành công');
        res.redirect('back');
    }
    catch(error){
        res.redirect('back');
    }
}
