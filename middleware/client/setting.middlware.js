const SettingGeneral = require('../../models/setting-general.model');

module.exports.general = async (req, res, next) => {
    try{
        const record = await SettingGeneral.findOne({});

        // respone locals
        res.locals.settingGeneral = record;

        // next middleware
        next();
    }
    catch(error){

    }
}