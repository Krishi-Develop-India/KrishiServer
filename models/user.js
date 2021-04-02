const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'Shinchan',
    },
    number: {
        type: String,
        required: true,
    },
    previousServices: {
        type: Array,
        required: true,
        default: []
    },
    locations: {
        type: Array,
        required: true,
        default: [],
    },
    userType: {
        type: String,
        required: true,
        enum: ['user', 'tractor', 'labour', 'harvester', 'inventory'],
        default: 'user',
    },
    rating: {
        type: String,
        required: true,
        default: '5.0',
    },
    uri: {
        type: String,
        required: true,
        default: "undefined",
    }
});

module.exports = mongoose.model('user', schema);