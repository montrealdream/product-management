const Account = require('../../models/account.model');

// helper
const filterhelper = require('../../helper/filter.helper');

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

        const records = await Account.find(findObject);

        const numberOfRecords = await Account.countDocuments(findObject);

        res.render('admin/pages/accounts/index', {
            title: "Danh sách tài khoản",
            records: records,
            numberOfRecords: numberOfRecords,
            buttonFilterStatus: buttonFilterStatus
        });
    }
    catch(error){

    }
    
}