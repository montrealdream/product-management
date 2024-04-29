// Router Sub
const homeRouter = require('./home.route');
const productRouter = require('./products.route');
const searchRouter = require('./search.route');
// middleware
const middlewareCategory = require('../../middleware/client/category.middleware');

module.exports = (app) => {
    // chạy qua middleware category trước
    app.use(middlewareCategory.category);

    app.use(
        '/', 
        // middleware.category,
        homeRouter
    );

    app.use(
        '/products', 
        // middleware.category,
        productRouter
    );

    app.use(
        '/search',
        searchRouter
    );
}