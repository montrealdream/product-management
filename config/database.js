const mongoose = require('mongoose');

module.exports.connect = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('database connect successfully');
    } catch (error) {
        console.log('database connect fail');
    }
}