// Router Sub
const homeRouter = require('./home.route');
const productRouter = require('./products.route');

module.exports = (app) => {
    app.use('/', homeRouter);

    app.use('/products', productRouter);
}