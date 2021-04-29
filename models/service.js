const mongoose = require('mongoose');

const schema = mongoose.Schema({
    tractor: {
        type: Number,
        default: 1000,
    },
    harvester: {
        type: Number,
        default: 1000,
    },
    labour: {
        type: Number,
        default: 1000,
    },
    inventory: {
        type: Number,
        default: 1000,
    },
    area: {
        type: String,
        default: 'lucknow',
    },
});

const model = new mongoose.model('service', schema);

module.exports = model;