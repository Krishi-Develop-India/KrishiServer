const Ride = require('../models/rides');
const User = require('../models/user');

module.exports = async (socket, io) => {
    socket.on('connect', () => {
        console.log("User socket connected"); 
    });
    socket.on('request-cancelled-after-confirm', async data => {
        console.log('Request cancelled by user after confirmation');
        let currentRide = await Ride.findOne({_id: data._id});
        currentRide.status='userCancelledAfterConfirmed';
        await currentRide.save();
        //let the tractor know that user has cancelled
        let roomID = currentRide.provider.toString();
        io.to(roomID).emit('request-cancelled-by-user', {_id: currentRide._id});
    });
    socket.on('request-cancelled-before-confirm', async data => {
        console.log("Cancelling request before confirm");
        let currentRide = await Ride.findOne({_id: data._id});
        if(!currentRide) return;
        currentRide.status='userCancelledBeforeConfirmed';
        await currentRide.save();   
    });
    socket.on('get-tractor-details', async ({_id}) => {
        const currentRide = await Ride.findOne({_id});
        const currentTractor = await User.findOne({_id: currentRide.provider});
        socket.emit('tractor-details', {
            _id: _id,
            name: currentTractor.name,
            rating: currentTractor.rating,
            tractor_number: 'Not valid',
            number: currentTractor.number,
            image: currentTractor.uri,
            status: currentRide.status,
        });
    });
};