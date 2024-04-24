const Account = require('../../models/account.model');

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    try{
        const records = await Account.find({
            deleted: false
        });

        const numberOfRecords = await Account.countDocuments({deleted: false});

        res.render('admin/pages/accounts/index', {
            title: "Danh sách tài khoản",
            records: records,
            numberOfRecords: numberOfRecords
        });
    }
    catch(error){

    }
    
}