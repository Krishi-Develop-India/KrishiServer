const Ride = require('../models/rides');

module.exports = socket => {
    socket.on('accept_request', async data => {
        const currentRide = await Ride.findOne({_id: data.id});
        currentRide.provider = socket.user._id;
    });
    socket.on('cancel_request', () => {
        
    });
};