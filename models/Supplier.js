//Shubham Gupta
const mongoose = require('mongoose');
const SupplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contactID: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    userEmail: {
        type: String,
        required: true
    },

})
module.exports = mongoose.model('supplier', SupplierSchema);