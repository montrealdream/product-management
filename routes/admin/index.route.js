// system config [path_admin]
const systemConfig = require('../../config/system');

// sub router
const dashboardRouter = require('./dashboard.route');
const productRouter = require('./products.route');
const productCategoryRouter = require('./products-category.route');
const roleRouter = require('./roles.route');
const accountRouter = require('./accounts.route');
const authenRouter = require('./auth.route');

// router private
const middleware = require('../../middleware/admin/auth.middleware');

// export
module.exports = (app) => {
    const path_admin = systemConfig.path_admin;
    // use
    app.use(
        path_admin + `/dashboard`, 
        middleware.requireAuth,
        dashboardRouter
    );

    app.use(
        path_admin + `/products`, 
        middleware.requireAuth,
        productRouter
    );

    app.use(
        path_admin + `/products-category`, 
        middleware.requireAuth,
        productCategoryRouter
    );

    app.use(
        path_admin + `/roles`, 
        middleware.requireAuth,
        roleRouter
    );

    app.use(
        path_admin + `/accounts`,
        middleware.requireAuth,
        accountRouter
    );

    app.use(
        path_admin + `/auth`,
        authenRouter
    );

}