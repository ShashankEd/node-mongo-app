//Shubham Gupta
const mongoose = require('mongoose');
const PurchaseModelSchema = new mongoose.Schema({
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
    },
    sellerName: {
        type: String,
        default: Date.now
    },
    quantity: {
        type: String,
        default: Date.now
    }
})
module.exports = mongoose.model('Purchase', PurchaseModelSchema);