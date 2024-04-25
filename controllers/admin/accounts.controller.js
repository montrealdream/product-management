const Account = require('../../models/account.model');
const Role = require('../../models/roles.model');
// helper
const filterhelper = require('../../helper/filter.helper');
const paginationHelper = require('../../helper/pagination.helper');

const md5 = require('md5');

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    try{
        const findObject = {
            deleted: false
        }

        // filter status
        const buttonFilterStatus = filterhelper.buttonStatus(req.query);
        if(req.query.status){
            findObject.status = req.query.status;
        }

        // count document
        const numberOfRecords = await Account.countDocuments(findObject);

        // pagination
        const paginationObject = paginationHelper(req.query, 5, numberOfRecords);


        const records = await Account.find(findObject)
                                     .limit(paginationObject.limit)
                                     .skip(paginationObject.skip);

        res.render('admin/pages/accounts/index', {
            title: "Danh sách tài khoản",
            records: records,
            numberOfRecords: numberOfRecords,
            buttonFilterStatus: buttonFilterStatus,
            pagination: paginationObject
        });
    }
    catch(error){

    }  
}

// [PATCH] /admin/accounts/change-status/:id/:status
module.exports.changeStatus = async (req, res) => {
    try{
        await Account.updateOne(
            {_id: req.params.id},
            {status: req.params.status}
        )
        req.flash('success', 'Thay đổi trạng thái tài khoản thành công');
        res.redirect('back');
    }
    catch(error){

    }
}

// [DELETE] /admin/accounts/delete-soft/:id
module.exports.deleteSoft = async (req, res) => {
    try{
        await Account.updateOne(
            {_id: req.params.id},
            {deleted: true}
        )
        req.flash('success', 'Xóa tài khoản thành công');
        res.redirect('back'); 
    }
    catch(error){

    }
}

// [GET] /admin/accounts/create
module.exports.createView = async (req, res) => {
    try{
        const roles = await Role.find({deleted: false});

        res.render('admin/pages/accounts/create',{
            title: "Create Account",
            roles: roles
        })
    }   
    catch(error){

    }
}

// [POST] /admin/accounts/create
module.exports.create = async (req, res) => {
    try{
        // hash password
        req.body.password = md5(req.body.password);
       
        // check email exits
        const emailExits = await Account.findOne({
            email: req.body.email,
        });

        if(emailExits){
            req.flash('warning', 'Email was exits, please choose different email');
            res.redirect('back');
            return;
        }

        if(req.file){
            req.body.avatar = `/uploads/${req.file.filename}`;
        }
        
        // save on database
        const record = new Account(req.body);
        await record.save();

        req.flash('success', 'Create new Account successfully');
        res.redirect(`/admin/accounts`);
    }
    catch(error){

    }
}