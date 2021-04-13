const mongoose = require('mongoose');

const schema = mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
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
    price: {
        type: String,
        required: true,
    },
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
});

module.exports = mongoose.model('serviceRequest', schema);