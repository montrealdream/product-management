// Router Sub
const homeRouter = require('./home.route');
const productRouter = require('./products.route');
const searchRouter = require('./search.route');
const cartRouter = require('./cart.route');
const orderRouter = require('./checkout.route');
const userRouter = require('./user.route');
const chatRouter = require('./chat.route');

// middleware
const middlewareCategory = require('../../middleware/client/category.middleware');
const middlewareCart = require('../../middleware/client/cart.middleware');
const middlwareUser = require('../../middleware/client/user.middleware');
const middlwareSetting = require('../../middleware/client/setting.middlware');

module.exports = (app) => {
    // chạy qua middleware category trước
    app.use(middlewareCategory.category);
    
    app.use(middlewareCart.cart);
    
    app.use(middlwareUser.infoUser);

    app.use(middlwareSetting.general);

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

    app.use(
        '/user',
        userRouter
    );

    app.use(
        '/chat',
        chatRouter
    );
}