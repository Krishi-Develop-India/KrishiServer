require('dotenv').config();
const Tractor  = require('./models/tractorUser');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const locations = [
    {
        number: "1",
        name: "self",
        tractorNumber: "1",
        long: 80.992679,
        lat: 26.881481,
    },
    {
        number: "2",
        name: "polytechnic",
        tractorNumber: "2",
        long: 80.999532,
        lat: 26.874758,
    },
    {
        number: "3",
        name: "janeshwar",
        tractorNumber: "3",
        long: 80.989611,
        lat: 26.835919,
    },
    {
        number: "4",
        name: "malihabad",
        tractorNumber: "4",
        long: 80.712947,
        lat: 26.924288,
    },
    {
        number: "5",
        name: "agra",
        tractorNumber: "5",
        long: 78.010068,
        lat: 27.168517,
    },
]

const addData = ({number, name, tractorNumber, lat, long}) => {
    const self = new Tractor({
        number,
        name,
        tractorNumber,
        location: {
            type: "Point",
            coordinates: [long, lat],
        }
    });
    self.save().then(() => console.log("Data added"))
    .catch(error => console.log("Error saving data", error));
}

locations.forEach(item => {
    addData(item);
});
