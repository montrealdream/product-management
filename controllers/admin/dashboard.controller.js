//  [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
    res.render('admin/pages/dashboard/index', {
        title: "Dashboard"
    });
}

