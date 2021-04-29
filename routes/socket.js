const io = require('socket.io')();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const userSocket = require('./userSocket');
const tractorSocket = require('./tractorSocket');

const validateJWT = (socket, token, next) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, access_token_decoded) => {
        if(error) {
            console.log("Error verifying the jwt token", error);
            return next(new Error('Authentication Error'));
        }
        let currentUser = await User.findOne({number: access_token_decoded.number});
        socket.user = currentUser;
        next();
    });
};

io.use((socket, next) => {
    console.log("Server request");
    const token = socket.handshake.auth.token;
    console.log(`Received token`);
    validateJWT(socket, token, next);
});

const handleConnection = socket => {

    const roomID = socket.user._id.toString();
    socket.join(roomID);
    console.log(`The roomID: ${roomID}`);
    
    if(socket.user.userType == 'user') {
        userSocket(socket, io);
    } else if(socket.user.userType == 'tractor') {
        tractorSocket(socket, io);
    } else if(socket.user.userType == 'labour') {

    } else if(socket.user.userType == 'harvester') {

    } else if(socket.user.userType == 'inventory') {

    } else {
        socket.disconnect();
    }
}

module.exports = {
    start: server => {
        io.listen(server).on('connection', handleConnection);
    },
    io,
}