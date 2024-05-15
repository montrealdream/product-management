// helper
const uploadToCloudinary = require('../../helper/uploadToCloudinary.helper');

module.exports.uploadSingle = async (req, res, next) => {
    // if u have upload image (upload.single(...) will create req.file)
    if(req.file){
      const linkImage = await uploadToCloudinary(req.file.buffer);

      // update key 
      req.body[req.file.fieldname] = linkImage;
      console.log(linkImage);
    }
    // alway next middleware
    next();
}