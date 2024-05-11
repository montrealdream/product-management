// model
const Chat = require('../../models/chat.model');
const User = require('../../models/user.model');

// [GET] /chat
module.exports.index = async (req, res) => {
    try{

        // const userId = res.locals.user.id;

        // // LISTEN CLIENT CONNECT "ONLINE"
        // _io.on('connection', (socket) => {
        //     console.log(1);
        //     console.log('a user connected');

        //     socket.on('disconnect', () => {
        //       console.log('user disconnected');
        //     });
        // });
        res.render("client/pages/chat/index", {
            title: "Hội trường"
        });
    }
    catch(error){

    }
}