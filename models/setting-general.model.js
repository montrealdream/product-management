const mongoose = require('mongoose');

// Defining a model
const settingGeneralSchema = new mongoose.Schema(
    {
        // lưu ý luôn luôn trong collection chỉ có 1 bản ghi này
        websiteName: String,
        logo: String,
        email: String,
        tel: String,
        address: String,
        copyright: String
    },
    {
        timestamps: true
    }
);

// Accessing a Model
const SettingGeneral = mongoose.model('SettingGeneral', settingGeneralSchema, 'setting-general');

// export
module.exports = SettingGeneral;