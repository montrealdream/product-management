const mongoose = require('mongoose');

module.exports.connect = async (req, res) => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/product-management-v1');
        console.log('database connect successfully');
    } catch (error) {
        console.log('database connect fail');
    }
}