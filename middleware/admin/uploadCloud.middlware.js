/**when u use cloudinary */
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// require dotenv (NPM)
require('dotenv').config();

// connect to cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_KEY, 
    api_secret: process.env.CLOUD_SECRET 
});

module.exports.uploadSingle = (req, res, next) => {
     // if u have upload image (upload.single(...) will create req.file)
     if(req.file){
        let streamUpload = (req) => {
          return new Promise((resolve, reject) => {
              let stream = cloudinary.uploader.upload_stream((error, result) => {
                  if (result) {
                    resolve(result);
                  }
                  else {
                    reject(error);
                  }
                }
              );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
        };
    
        async function upload(req) {
            let result = await streamUpload(req);
            // console.log(result);

            // update key 
            req.body[req.file.fieldname] = result.url;
            next();
        }
    
        upload(req);
    }
    else{
        next();
    }
}