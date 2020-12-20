const mongoose = require('mongoose');
const easyBusinessModelSchema = new mongoose.Schema({
    itemType: {
        type: String,
        required: true
    },
    itemCategory: {
        type: String,
        required: true
    },
    itemCost: {
        type: String,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    itemExpiry: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Products', easyBusinessModelSchema);