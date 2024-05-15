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

// function stream upload to cloud (alway use type let)
let streamUpload = (buffer) => {
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
      streamifier.createReadStream(buffer).pipe(stream);
    });
};

module.exports = async (buffer) => {
    let result = await streamUpload(buffer);
    // console.log(result);
    return result.url; //link image
} 