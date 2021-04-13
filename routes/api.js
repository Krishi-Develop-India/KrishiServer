const router = require('express').Router();
const Otp = require('../models/otp');
const User = require('../models/user');
const jwt = require('../helper/jwt');
const sms = require('../services/sms');
const Tractor = require('../models/tractorUser');

router.get('/services', (req, res)=>{
    res.send([
        {
            distance: '24 km away', 
            id: 1,
            img: 'inventory', 
            name: "Inventory",
        },
        {
            distance: '200 m away',
            id: 2,
            img: 'tractor',
            name: "Tractor",
        },
        {
            distance: '500 m away',
            id: 3,
            img: 'harvester',
            name: "Harvester",
        },
        {
            distance: '1 km away',
            id: 4,
            img: 'labour',
            name: 'Labour',
        },
        {
            distance: '1 km away',
            id: 5,
            img: 'labour',
            name: 'Labour',
        },
        {
            distance: '1 km away',
            id: 6,
            img: 'labour',
            name: 'Labour',
        }
    ]);
});

router.post('/phoneNumberAuth', async (req, res) => {
    try{
        const { number, user }  = req.body;
        //If there a request from some other type of app
        //for some other type of user, we can just send an error
        const currentUser = await User.findOne({number});
        if(currentUser.userType !== user) return res.status(401).send("User of other type exist in our database");
        console.log(number);
        //Let's see if the number still exists in our database
        //If the number still exists, we do not need to create a new one
        if(await Otp.findOne({number})) return res.status(200).send("Otp still valid");
        //Let's create a new otp and send it to the user
        let otp;
        do{
            otp = Math.floor(Math.random() * 10000);
        }while(otp<1000);
        console.log(otp, number);
        //Lets send it to the user
        sms.sendOTP(number, otp);
        //Let's save it to mongodb
        const newOtp = new Otp({number, otp});
        await newOtp.save();
        res.status(200).send();
    } catch(error) {
        console.log("An error has occured in the /api/phoneNumberAuth function. Error: "+error);
    }
});

router.post('/otpAuth', async (req, res) => {
    try{
        //lets check the otp again something
        const { otp, number, user } = req.body;
        // console.log(otp, number);
        const currentOtp = await Otp.findOne({number});
        if(!currentOtp) return res.status(400).send("Otp not valid or has expired");
        if(currentOtp.otp != otp) return res.status(400).send("Wrong Otp");
        //Otp is also correct and we can proceed.
        //Lets remove this now from the database as it is no longer needed
        await Otp.deleteOne({number});
        const currentUser = await User.findOne({number});
        if(!currentUser) { //No user? Let's create a user
            //If this is a tractor or something else then currentUser is changed
            currentUser = new User({number, userType: user});
            await currentUser.save();
        }
        return res.status(200).send(jwt.create(number, currentUser.name, currentUser.rating, currentUser.uri));
    } catch(error) {
        console.log("An error has occured in the /api/otpAuth function. Error: "+error);
    }
});

module.exports = router;