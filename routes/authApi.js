const router = require('express').Router();

const jwt = require('../helper/jwt');
const Tractor = require('../models/tractorUser');
const serviceRequest = require('../models/serviceRequest');
const GeoCoding = require('../services/geolocation');
const upload = require('../helper/multer');
const User = require('../models/user')
const moveFile = require('move-file');
const fs = require('fs');
const path = require('path');

router.post('/getServices', jwt.validate, async (req, res) => {
    await User.distinct('userType', (error, array) => {
        res.send(array.filter(element => element=='user'));
    });
});

router.post('/locationLabel', jwt.validate, async (req, res) => {
    const { latitude, longitude } = req.body;
    const location = await GeoCoding.getLocalityData(latitude, longitude);
    res.send(location.label);
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
    if(data.length == 0) return res.status(200).send("No vehicle found");
    //send request to the tractors so that they can accept or reject this offer
    
});

router.post('/getPlaces', jwt.validate, async (req, res) => {
    const { user } = req;
    const jsonArray = [];
    user.locations.forEach(element => {
        jsonArray.push(JSON.parse(element));
    });
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

module.exports = router;