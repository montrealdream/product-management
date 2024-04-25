// [GET] /admin/auth/login
module.exports.loginView = async (req, res) => {
    try{
        res.render('admin/pages/auth/login', {
            title: "Login"
        });
    }   
    catch(error){

    }
}