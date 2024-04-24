const Account = require('../../models/account.model');

// helper
const filterhelper = require('../../helper/filter.helper');
const paginationHelper = require('../../helper/pagination.helper');

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