const multer  = require('multer');

module.exports = () => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, './public/uploads/')
        },

        filename: function (req, file, cb) {
          const time = Date.now();

        //   time-name
          cb(null, `${time}-${file.originalname}`);
        }
    })

    return storage;
}