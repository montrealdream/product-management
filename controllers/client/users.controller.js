// model
const User = require('../../models/user.model');

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
    try{
        // my user
        const myId = res.locals.user.id;

        const userNotFriend = await User.find({
            _id: {$ne: myId},
            status: "active",
            deleted: false
        }).select("avatar fullName");

        res.render('client/pages/users/not-friend', {
            title: "Danh sách người dùng",
            userNotFriend: userNotFriend
        });
    }
    catch(error){

    }
}