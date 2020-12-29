//Shubham Gupta
const mongoose = require('mongoose');
const StockSchema = new mongoose.Schema({
    productName:{
        type : String,
        required : true
    },
    productQuantity:{
        type : String,
        required : true
    },
    productType:{
        type : String,
        required : true
    },
    productExpiry:{
        type : String,
        required : true
    },
    productSupplier:{
        type: String,
        required : true
    },
    userEmail: {
        type: String,
        required: true
    },

})
module.exports = mongoose.model('Stock', StockSchema);