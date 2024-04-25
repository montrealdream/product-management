// model
const Account = require('../../models/account.model');
const Role = require('../../models/roles.model');

// [GET] /admin/my-account
module.exports.index = async (req, res) => {
    try{
        res.render('admin/pages/my-account/index');
    }
    catch(error){

    }
}