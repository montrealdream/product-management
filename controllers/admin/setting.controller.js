// model
const SettingGeneral = require('../../models/setting-general.model');

// [GET] /setting/general
module.exports.settingGeneralView = async (req, res) => {
    try{
        const record = await SettingGeneral.findOne({});

        res.render('admin/pages/settings/general',{
            title: "Cài đặt chung",
            record: record
        })
    }
    catch(error){
        
    }
}