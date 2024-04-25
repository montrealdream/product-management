const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/admin/products.controller');

// valdidate 
const validate = require('../../validate/admin/products.validate');

// multer
const multer  = require('multer');

/**when u use disk storage local */
const diskStorageMulterHelper = require('../../helper/diskStorageMulter.helper');

/** when not use disk storage */
// const upload = multer({ dest: './public/uploads/' }); 
// const upload = multer({ storage: diskStorageMulterHelper() });

/**when u use cloudinary */
const upload = multer();
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({ 
    cloud_name: 'dgmm3wigk', 
    api_key: '868311338289767', 
    api_secret: '***************************' 
});

// use
router.get('/', controller.index);

router.patch('/change-status/:id/:status', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete-soft/:id', controller.deleteSoft);

router.get('/create', controller.createView);

router.post(
    '/create',
    upload.single('thumbnail'),
    // function upload onto cloudinary
    function (req, res, next) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                  (error, result) => {
                    if (result) {
                      resolve(result);
                    } else {
                      reject(error);
                    }
                  }
                );
    
              streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
    
        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
        }
    
        upload(req);
        next();
    },
    validate.createProduct,
    controller.createProduct
);

router.get('/edit/:id', controller.editView);

router.patch(
    '/edit/:id',
    upload.single('thumbnail'),
    validate.createProduct,
    controller.editProduct
)

router.get('/detail/:id', controller.detail);

// export
module.exports = router;
