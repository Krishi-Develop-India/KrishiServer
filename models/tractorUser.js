const mongoose = require('mongoose');

const schema = mongoose.Schema({
    number: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    tractorNumber: {
        type: String,
        required: true,
    },
    location: {
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
});

schema.index({location: '2dsphere'})

const model = new mongoose.model('tractorUser', schema);

module.exports = model;