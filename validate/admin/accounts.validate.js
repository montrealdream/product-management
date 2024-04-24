// [POST] /admin/accounts/create
module.exports.createAccount = async (req, res, next) => {
    if(!req.body.fullName) {
        req.flash('warning', 'Please typeon your full name');
        res.redirect('back');
        return;
    }

    if(req.body.fullName.length < 8){
        req.flash('warning', "Your full name has at least 8 characters");
        res.redirect('back');
        return;
    }

    if(!req.body.email) {
        req.flash('warning', 'Please typeon your email');
        res.redirect('back');
        return;
    }

    if(!req.body.password) {
        req.flash('warning', 'Please typeon your password');
        res.redirect('back');
        return;
    }

    if(req.body.password.length < 8){
        req.flash('warning', "Password has at least 8 characters");
        res.redirect('back');
        return;
    }

    if(!req.body.role_id){
        req.flash('warning', 'Please choose your role');
        res.redirect('back');
        return;
    }

    // next middleware
    next();
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editAccount = async (req, res, next) => {
    if(!req.body.fullName) {
        req.flash('warning', 'Please typeon your full name');
        res.redirect('back');
        return;
    }

    if(!req.body.email) {
        req.flash('warning', 'Please typeon your email');
        res.redirect('back');
        return;
    }

    if(!req.body.role_id){
        req.flash('warning', 'Please choose your role');
        res.redirect('back');
        return;
    }

    // next middleware
    next();
}