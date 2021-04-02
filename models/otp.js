const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
});

schema.index({createdAt: 1}, {expireAfterSeconds: 30}); //The otp fails to work after 30 seconds

const model = mongoose.model('otp', schema);

module.exports = model;