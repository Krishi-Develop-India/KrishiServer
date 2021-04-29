const io = require('./socket').io;
const Ride = require('../models/rides');
const User = require('../models/user');
const TractorUser = require('../models/tractorUser');

module.exports = async (socket, io) => {
    socket.on('connected', () => {
        console.log("Tractor socket connected");
    });
    socket.on('accept-request', async data => {
        const currentRide = await Ride.findOne({_id: data._id});
        if(currentRide.status != 'pending') return;
        console.log("Accepted ride id: "+data._id);
        currentRide.provider = socket.user._id;
        currentRide.status = 'accepted';
        console.log("Socket user id: "+socket.user._id);
        await currentRide.save();
        const roomID = currentRide.consumer.toString();
        console.log("Room id: "+roomID);
        io.to(roomID).emit('request-accepted', {_id: currentRide._id});
        console.log("Request booked successfully");
    });
    socket.on('confirm-ride', async data => {
        console.log('Confirm ride hit');
        let updatedCurrentRide;
        do {
            updatedCurrentRide = await Ride.findOne({_id: data._id});
        } while(updatedCurrentRide.provider == null);
        const currentRide = await Ride.findOne({_id: data._id});
        console.log(currentRide);
        console.log(`currentride.provider.toString() ${currentRide.provider}`);
        console.log(`socket.user._id.toString() ${socket.user._id.toString()}`);
        if(currentRide.provider == socket.user._id.toString() && currentRide.status == 'accepted') {
            socket.emit('ride-confirmed', {_id: data._id});
            await TractorUser.deleteOne({number: socket.user.number});
        } else {
            socket.emit('ride-confirmed', {_id: -1});
        }
    });
    socket.on('get-user-details', async ({_id}) => {
        const currentRide = await Ride.findOne({_id});
        const currentUser = await User.findOne({_id: currentRide.consumer});
        socket.emit('user-details', {
            _id: _id,
            name: currentUser.name,
            rating: currentUser.rating,
            number: currentUser.number,
            image: currentUser.uri
        });
        console.log(`Giving image ${currentUser.url}`);
    });
    socket.on('request-cancelled-after-confirm', async data => {
        console.log('Request cancelled by tractor after confirmation');
        let currentRide = await Ride.findOne({_id: data._id});
        currentRide.status='tractorCancelledAfterConfirmed';
        await currentRide.save();
        //let the user know that tractor has cancelled
        let roomID = currentRide.consumer.toString();
        io.to(roomID).emit('request-cancelled-by-tractor', {_id: currentRide._id});
    });
    socket.on('work-started', async data => {
        console.log('Work started');
        let currentRide = await Ride.findOne({_id: data._id});
        currentRide.status = 'workInProgress';
        await currentRide.save();
        //let the user know that the tractor started working
        let roomID = currentRide.consumer.toString();
        io.to(roomID).emit('work-started', {_id: data._id});
    });
    socket.on('work-finished', async data => {
        console.log('Work finished');
        let currentRide = await Ride.findOne({_id: data._id});
        currentRide.status = 'completed';
        await currentRide.save();
        //let the user know that the tractor finished working
        let roomID = currentRide.consumer.toString();
        io.to(roomID).emit('work-finished', {_id: data._id});
    });
    socket.on('getSwitchInfo', async () => {
        if(await TractorUser.findOne({number: socket.user.number}))
            socket.emit('switchInfo', {switch: true});
        else 
            socket.emit('switchInfo', {switch: false});
    });

};