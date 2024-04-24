// system config [path_admin]
const systemConfig = require('../../config/system');

// sub router
const dashboardRouter = require('./dashboard.route');
const productRouter = require('./products.route');
const productCategoryRouter = require('./products-category.route');
const roleRouter = require('./roles.route');
 
// export
module.exports = (app) => {
    const path_admin = systemConfig.path_admin;
    // use
    app.use(
        path_admin + `/dashboard`, 
        dashboardRouter
    );

    app.use(
        path_admin + `/products`, 
        productRouter
    );

    app.use(
        path_admin + `/products-category`, 
        productCategoryRouter
    );

    app.use(
        path_admin +`/roles`, 
        roleRouter
    );

}