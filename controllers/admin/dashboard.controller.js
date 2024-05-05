// model
const User = require('../../models/user.model');
const Account = require('../../models/account.model');
const Product = require('../../models/product.model');
const productCategory = require('../../models/products-category.model');
const Order = require('../../models/order.model');

//  [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
    // statistic
    const statistic = {
        product: {
            total: 0, // not consist of deleted
            active: 0,
            inactive: 9
        },
        productCategory: {
            total: 0,
            active: 0,
            inactive: 0
        },
        account: {
            total: 0,
            active: 0,
            inactive: 0
        },
        user: {
            total: 0,
            active: 0,
            inactive: 0
        },
        order: {
            total: 0,
            active: 0,
            inactive: 0
        },
    }

    // statistic product
    statistic.product.total = await Product.countDocuments({deleted: false});
    statistic.product.active = await Product.countDocuments({
        status: "active",
        deleted: false
    });
    statistic.product.inactive = statistic.product.total - statistic.product.active;

    // statistic product category
    statistic.productCategory.total = await productCategory.countDocuments({deleted: false});
    statistic.productCategory.active = await productCategory.countDocuments({
        status: "active",
        deleted: false
    });
    statistic.productCategory.inactive = statistic.productCategory.total - statistic.productCategory.active;
    
    // statistic order
    statistic.order.total = await Order.countDocuments({deleted: false});
    statistic.order.active = await Order.countDocuments({
        status: "active",
        deleted: false
    });
    statistic.order.inactive = statistic.order.total - statistic.order.active;

    // statistic account
    statistic.account.total = await Account.countDocuments({deleted: false});
    statistic.account.active = await Account.countDocuments({
        status: "active",
        deleted: false
    });
    statistic.account.inactive = statistic.account.total - statistic.account.active;
    
    // statistic user
    statistic.user.total = await User.countDocuments({deleted: false});
    statistic.user.active = await User.countDocuments({
        status: "active",
        deleted: false
    });
    statistic.user.inactive = statistic.user.total - statistic.user.active;

    res.render('admin/pages/dashboard/index', {
        title: "Dashboard"
    });
}

