// Router Sub
const homeRouter = require('./home.route');
const productRouter = require('./products.route');
const searchRouter = require('./search.route');
const cartRouter = require('./cart.route');
const orderRouter = require('./checkout.route');

// middleware
const middlewareCategory = require('../../middleware/client/category.middleware');
const middlewareCart = require('../../middleware/client/cart.middleware');

module.exports = (app) => {
    // chạy qua middleware category trước
    app.use(middlewareCategory.category);
    
    app.use(middlewareCart.cart);

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

    app.use(
        '/cart',
        cartRouter
    );

    app.use(
        '/checkout',
        orderRouter
    );
}