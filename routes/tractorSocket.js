const io = require('../routes/socket').io;
const Ride = require('../models/rides');

module.exports = async socket => {
    socket.on('accept-request', async data => {
        const currentRide = await Ride.findOne({_id: data._id});
        currentRide.provider = socket.user._id;
        await currentRide.save();
        const roomID = currentRide.user._id.toString();
        io.to(roomID).emit('request-accepted', {_id: currentRide._id});
        console.log("Request booked successfully");
    });
    socket.on('cancel-request', () => {
        console.log("Request rejected successfully");
    });
};