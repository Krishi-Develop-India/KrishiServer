const router = require('express').Router();

const jwt = require('../helper/jwt');
const Tractor = require('../models/tractorUser');
const GeoCoding = require('../services/geolocation');
const upload = require('../helper/multer');
const User = require('../models/user')
const moveFile = require('move-file');
const fs = require('fs');
const path = require('path');
const io = require('../routes/socket').io;
const Ride = require('../models/rides');
const Service = require('../models/service');

router.post('/getServices', jwt.validate, async (req, res) => {
    await User.distinct('userType', async (error, array) => {
        console.log(array.filter(element => element!='user'));
        array = array.filter(element => element!='user');
        let serviceArray  = [];
        const currentService = await Service.findOne({area: 'lucknow'});
        if(!currentService) {
            return ({
                price: 1000,
                id: 1,
                img: 'tractor',
                name: 'Tractor',
            });
        }
        for(let i = 1; i<=array.length;i++) {
            serviceArray.push({
                price: currentService[array[i-1]],
                id: i,
                img: array[i-1],
                name: array[i-1].charAt(0).toUpperCase() + array[i-1].slice(1)
            })
        }
        console.log(serviceArray);
        res.send(serviceArray);
    });
});

router.post('/locationLabel', jwt.validate, async (req, res) => {
    const { latitude, longitude } = req.body;
    try{
        const location = await GeoCoding.getLocalityData(latitude, longitude);
        if(!location) return res.send('Geocoding server down');
        res.send(location.label);
    } catch(error) {
        console.log("Error in reverse geocoding", error);
    }
});

router.post('/getNearestTractor', jwt.validate, async (req, res) => {
    const { latitude, longitude } = req.body;
    let data = await Tractor.aggregate([
        { "$geoNear": {
            "near": {
                "type": "Point",
                "coordinates": [ parseFloat(longitude), parseFloat(latitude) ]
            }, 
            "maxDistance": 5000, //5km
            "spherical": true,
            "distanceField": "distance",
        }}
    ]);
    console.log("Sending request");
    if(data.length == 0) return res.send("No vehicle found");
    const distance = "" + data[0].distance;
    res.send(distance);
});

router.post('/changeName', jwt.validate, async (req, res) => {
    try {
        const { name: modified_name } = req.body;
        req.user.name = modified_name;
        await req.user.save();
        const newToken = jwt.create(req.user.number, req.user.name, req.user.rating, req.user.uri);
        res.status(200).send(newToken);
    } catch(error) {
        console.log("Error in change name request.", error);
        res.status(500).send("Server error");
    }
});

router.post('/changeProfileImage',  async (req, res) => {
    try {
        console.log("Change profile image hit");
        upload(req, res, async (error) => {
            if(error) {
                console.log("Error uploading file image.", error);
                res.status(500).send("Error uploading profile image.");
            } else {
                const ppath = path.join(__dirname, "..", "/public/images/profile/temp", req.tempImageName);
                require('jsonwebtoken').verify(req.body.token, process.env.ACCESS_TOKEN_SECRET, async (error, access_token_decoded) => {
                    if(error) {
                        //delete the uploaded file from the temp folder
                        console.log(req.body);
                        fs.unlink(ppath, error => console.log(error));
                        //Response to developer and client
                        console.log("Error verifying the jwt token in profile image upload");
                        return res.status(401).send("Cannot validate jwt token");
                    }
                    let currentUser = await User.findOne({number: access_token_decoded.number});
                    req.user = currentUser;
                    //Taking the final path
                    const opath = path.join(__dirname, "..", "/public/images/profile/", req.user.number+req.tempImageExtension);
                    //Deleting any previous file
                    const jpegprevious = path.join(__dirname, "..", "/public/images/profile/", req.user.number+".jpeg");
                    const jpgprevious = path.join(__dirname, "..", "/public/images/profile/", req.user.number+".jpg");
                    const pngprevious = path.join(__dirname, "..", "/public/images/profile/", req.user.number+".png");
                    fs.unlink(jpegprevious, error => {});
                    fs.unlink(jpgprevious, error => {});
                    fs.unlink(pngprevious, error => {});
                    //Moving the file form the temp folder to the profile(original folder)
                    await moveFile(ppath, opath);
                    console.log(req.protocol+"://"+req.get('host')+":"+process.env.PORT+"/public/images/profile/"+req.user.number+req.tempImageExtension);
                    req.user.uri = req.protocol+"://"+req.get('host')+":"+process.env.PORT+"/public/images/profile/"+req.user.number+req.tempImageExtension
                    await req.user.save();
                    const newToken = jwt.create(req.user.number, req.user.name, req.user.rating, req.protocol+"://"+req.get('host')+":"+process.env.PORT+"/public/images/profile/"+req.user.number+req.tempImageExtension);
                    res.status(200).send(newToken);
                });
            }
        });
    } catch(error) {
        console.log("Error in change profile image post request.", error);
    }
});

router.post('/bookTractor', jwt.validate, async (req, res) => {
    const { latitude, longitude, area, price } = req.body;
    console.log(latitude, longitude, area, price); 
    let data = await Tractor.aggregate([
        { "$geoNear": {
            "near": {
                "type": "Point",
                "coordinates": [ parseFloat(longitude), parseFloat(latitude) ]
            }, 
            "maxDistance": 5000, //5km
            "spherical": true,
            "distanceField": "distance",
        }}
    ]);
    console.log("We are working on it");
    if(data.length == 0) return res.status(404).send("No ride available");
    const newRide = new Ride({
        consumer: req.user._id,
        price: price,
        location: {
            type: "Point",
            coordinates: [ parseFloat(longitude), parseFloat(latitude) ],
        },
        serviceType: 'tractor',
    });
    await newRide.save();
    res.status(200).send({_id: newRide._id});
    for(let i=0;i<1;i++) {
        let tractor = data[i];
        if(newRide.provider != null) break;
        const roomID = (await User.findOne({number: tractor.number}))._id.toString();
        console.log(`Room ID as per req is ${roomID} and type is ${typeof(roomID)}`)
        const socketInRoom = io.sockets.adapter.rooms.get(roomID);
        console.log(socketInRoom.size);
        if(socketInRoom.size == 1 || true) {
            io.to(roomID).emit('request', {price: price, area: area, distance: data.distance, rating: "4.78", latitude: latitude, longitude: longitude, _id: newRide._id});
        }
    }
    // if(data.length == 0) return res.status(200).send("No vehicle found");
    //send request to the tractors so that they can accept or reject this offer
    
});

router.post('/getPlaces', jwt.validate, async (req, res) => {
    const { user } = req;
    const jsonArray = [];
    user.locations.forEach(element => {
        jsonArray.push(JSON.parse(element));
    });
    console.log(jsonArray);
    res.send(jsonArray);
});

router.post('/deletePlace', jwt.validate, async (req, res) => {
    const { id } = req.body;
    const { user } = req;
    const tempArray = [];
    user.locations.forEach(element => {
        tempArray.push(JSON.parse(element));
    });
    const newTempArray = tempArray.filter(currentItem => currentItem.id!=id);
    const newTempArrayStringFormat = [];
    newTempArray.forEach(element => {
        newTempArrayStringFormat.push(JSON.stringify(element));
    });
    user.locations = newTempArrayStringFormat;
    await user.save();
    res.status(200).send(newTempArray);
});

router.post('/switchTractor', jwt.validate, async (req, res) => {
    const { latitude, longitude, status } = req.body;
    const { number, name, tractorNumber } = req.user;
    const alreadyTractor = await Tractor.findOne({number});
    if(alreadyTractor && status) {
        console.log("Tractor already functioning");
        return res.send(200); 
    }
    if(status) {
        const newTractor = new Tractor({
           name,
           number,
           tractorNumber: 'xxx',
           location: {
            type: "Point",
            coordinates: [ parseFloat(longitude), parseFloat(latitude) ],
            },
        });
        await newTractor.save();
        console.log("New tractor saved successfully");
        res.send(200);
    } else {
        await Tractor.deleteOne({number});
        console.log("New tractor deleted successfully");
        res.send(200);
    }
});

module.exports = router;