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

// [POST] /setting/general
module.exports.settingGeneral = async (req, res) => {
    try{
        const record = await SettingGeneral.findOne({});
        if(record){
            // avaiable record
            await SettingGeneral.updateOne(
                {},
                req.body
            )
            req.flash('success', 'Thay đổi cài đặt chung thành công');
            res.redirect('back');
        }
        else{
            // create new & save
            const setting = new SettingGeneral(req.body);
            await setting.save();
            req.flash('success', 'Thay đổi cài đặt chung thành công');
            res.redirect('back');
        }
       
    }
    catch(error){

    }
}