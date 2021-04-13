const mongoose = require('mongoose');

const schema = mongoose.Schema({
    consumer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    location: {
        
    },
    serviceType: {
        type: String,
        required: true,
        enum: ['user', 'tractor', 'labour', 'harvester', 'inventory'],
    },
});

module.exports = mongoose.model('rides', schema);
