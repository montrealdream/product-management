
// [GET] /chat
module.exports.index = async (req, res) => {
    try{
        res.render("client/pages/chat/index", {
            title: "Hội trường"
        });
    }
    catch(error){

    }
}