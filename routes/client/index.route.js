// Router Sub
const homeRouter = require('./home.route');
const productRouter = require('./products.route');

// middleware
const middleware = require('../../middleware/client/category.middleware');

module.exports = (app) => {
    app.use(
        '/', 
        middleware.category,
        homeRouter
    );

    app.use(
        '/products', 
        middleware.category,
        productRouter
    );
}