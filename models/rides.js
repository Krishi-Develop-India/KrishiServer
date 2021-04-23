const mongoose = require('mongoose');

const schema = mongoose.Schema({
    consumer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },
    price: {
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
    serviceType: {
        type: String,
        required: true,
        enum: ['tractor', 'labour', 'harvester', 'inventory'],
    },
});


module.exports = mongoose.model('rides', schema);
