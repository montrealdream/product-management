// [GET] /admin/products-category/create
// [POST] /admin/products-category/create
module.exports.createCategory = async (req, res, next) => {
    if(!req.body.title){
        req.flash('warning', 'Please enter your title of category');
        res.redirect('back');
        return;
    }

    // next middleware
    next();
}