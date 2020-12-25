//Shubham Gupta
const helper = require('../helperFunction');
const User = require("../models/User");
const EasyBusiness = require("../models/EasyBusiness");
const Purchase = require("../models/Purchase");
const Stock = require("../models/Stock");
const Supplier = require('../models/Supplier');

//Register User

exports.register = (req, res) => {
    console.log("req.body", req)
    const user = new User({
        email: req.body.email,
        password: req.body.password,
    });
    try {
        User.find({ email: req.body.email }, async (err, obj) => {
            if (obj.length) {
                res.send("Email already exist")
            } else {
                await user.save();
                console.log("registered");
                const tok = helper.generateJWTToken(req.body.email);
                console.log("user saved and token ", tok);
                res.json({
                    "data": {
                        "token": tok
                    }
                });
            }
        })
    } catch (err) {
        console.log("inside catch", err);
        res.send({ "error": err });
    }
}

//Login User through Token

exports.login = (req, res) => {
    console.log("req.body", req)
    const user = new User({
        email: req.body.email,
        password: req.body.password,
    });
    try {
        User.find({ email: req.body.email }, async (err, obj) => {
            console.log("Object ", obj, req.body.email);
            if (obj.length) {
                const authHeader = req.headers['authorization'];
                const token = authHeader && authHeader.split(' ')[1];
                console.log("token", token);
                const response = helper.validateJWTToken(token, res);
                console.log("User logged in ");
            } else {
                res.send("Email does not exist");
            }
        })

    } catch (err) {
        res.send({ "error": err });
    }
}

//getAllItems get method 

exports.getAllItems = (req, res) => {
    EasyBusiness.find({}, (err, obj) => {
        res.send(obj);
    });
}


//add item 

exports.addItem = async (req, res) => {
    console.log("req.body ", req)
    const easyBusiness = new EasyBusiness({
        itemType: req.body.itemType,
        itemCategory: req.body.itemCategory,
        itemCost: req.body.itemCost,
        itemName: req.body.itemName,
        itemExpiry: req.body.itemExpiry,
    });
    try {
        await easyBusiness.save();
        res.send({ "result": "Records inserted" });
    } catch (err) {
        res.send({ "error": err });
    }
}

//Purchase

exports.purchase = async (req, res) => {
    console.log("req.body ", req)
    const purchase = new Purchase({
        itemType: req.body.itemType,
        itemCategory: req.body.itemCategory,
        itemCost: req.body.itemCost,
        itemName: req.body.itemName,
        itemExpiry: req.body.itemExpiry,
        sellerName: req.body.sellerName,
        quantity: req.body.quantity,
        date: req.body.date,
    });
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        console.log("token ", token);
        const response = helper.genricJWTValidator(token);
        console.log("response ", response);
        if (response) {
            Object.assign(purchase, { userEmail: response })
            purchase.save();
            res.send("Purchase saved");
        } else if (response === null) {
            res.send("token required")
        } else {
            res.send("Invalid token")
        }
    } catch (err) {
        res.send({ "error": err });
    }
}

// Stock for the user

exports.stock = async (req, res) => {
    console.log("req.body ", req)
    const stock = new Stock({
        productName: req.body.productName,
        productQuantity: req.body.productQuantity,
        productType: req.body.productType,
        productExpiry: req.body.productExpiry,
        productSupplier: req.body.productSupplier,
        date: req.body.date,
    });
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        console.log("token ", token);
        const response = helper.genricJWTValidator(token);
        console.log("response ", response);
        if (response) {
            console.log("inside if", response)
            Object.assign(stock, { userEmail: response })
            stock.save();
            res.send("Stock saved");
        } else if (response === null) {
            res.send("token required")
        } else {
            res.send("Invalid Token")
        }
    } catch (err) {
        res.send({ "error": err });
    }
}

//Supplier

exports.supplier = async (req, res) => {
    console.log("req.body ", req)
    const supplier = new Supplier({
        name: req.body.name,
        contactID: req.body.contactID,
    });
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        console.log("token ", token);
        const response = helper.genricJWTValidator(token);
        console.log("response ", response);
        if (response) {
            Object.assign(supplier, { userEmail: response })
            supplier.save();
            res.send("Supplier saved");
        } else if (response === null) {
            res.send("token required")
        } else {
            res.send("Invalid token")
        }
    } catch (err) {
        res.send({ "error": err });
    }
}