// model
const Article = require('../../models/article.model');

// [GET] /admin/articles
module.exports.index = async (req, res) => {
    try {
        const findObject = {
            status: "active",
            deleted: false
        }

        const records = await Article.find(findObject);

        res.render('admin/pages/articles/index', {
            title: "Bài viết",
            records: records
        })
    }
    catch(error){

    }
}