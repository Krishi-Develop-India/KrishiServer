const tractorUser = require('../models/tractorUser');
const serviceRequest = require('../models/serviceRequest');
const rides = require('../models/rides');
const jwt = require('../helper/jwt');

const router = require('express').Router();

router.post('/deliverService', jwt.verify, async (req, res) => {
    //So here is a request which has the location of the tractor service
    const { user="user", latitude, longitude } = req.body;
    const currentTractorUser = await tractorUser.findOne({number: user.number});
    if(!currentTractorUser) {
        const newTractorUser = new tractorUser({
            number: user.number,
            name: user.name,
            tractorNumber: user.vehicle,
            location: [longitude, latitude],
        });
        await newTractorUser.save();
        return res.status(200).send({service: null});
    }
    if(currentTractorUser.service !==  null) {
        //Koi mil gaya. Mil hi gaya
        const currentServiceRequest = await serviceRequest.findById(currentTractorUser.service);
        if(!currentServiceRequest) return res.status(200).send({service: null});
        res.status(200).send({service: currentServiceRequest.id});
        currentTractorUser.service = null;
        await currentTractorUser.save();
    }
    return res.status(200).send({service: null});
});

route.post('/acceptRequest', jwt.verify, (req, res) => {
});

module.exports = router;