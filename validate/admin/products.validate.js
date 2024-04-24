// [POST] /admin/products/create
// [PATCH] /admin/products/edit/:id
module.exports.createProduct = async (req, res, next) => {
    if(!req.body.title){
        req.flash('warning', 'Please typeon your title of product');
        res.redirect('back');
        return;
    }

    if(!req.body.price){
        req.flash('warning', 'Please typeon your price of product');
        res.redirect('back');
        return;
    }

    if(!req.body.discountPercentage){
        // if empty, then will 0%
        req.body.discountPercentage = "0";
    }

    if(!req.body.stock){
        req.body.stock = "1";
    }

    // next middleware
    
    next();
}