//Shubham Gupta
const helper = require('../helperFunction');
const User = require("../models/User");
const EasyBusiness = require("../models/EasyBusiness");
const Purchase = require("../models/Purchase");
const Stock = require("../models/Stock");
const Supplier = require('../models/Supplier');
const Token = require("../models/Token");

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
                const token = new Token({
                    email: req.body.email,
                    token: tok
                });
                token.save();
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

exports.login = async (req, res) => {
    console.log("req.body", req)
    const user = new User({
        email: req.body.email,
        password: req.body.password,
    });
    try {

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const validate = helper.genricJWTValidator(token);
        let result;
        if(validate){
           result = res.json({"data":{
                "status": "Hi "+ req.body.email + " You're successfully logged in!"
            }})
        } else {
            console.log("token is not passed so checking from token table");
            Token.find({ email: req.body.email }, async( err,obj) => {
                    console.log(obj);
                    if(obj.length>0) {
                        result = res.json({"data":{
                            "status": "Hi "+ obj[0]['email'] + " You're successfully logged in!"
                        }})

                    } else{
                        result = res.sendStatus(403);

                    }
                } )
        } 
        console.log("result ", result);
        return result;
    } catch (err) {
        res.send({ "error": err });
    }
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

//getAllItems get method 

exports.getAllItems = (req, res) => {
    EasyBusiness.find({}, (err, obj) => {
        res.send(obj);
    });
}

// Purchase get method  
exports.getAllPurchase = (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const response = helper.genricJWTValidator(token);
        if (response) {
            //now find the records with condition where email matches
                Purchase.find({},(error,obj) => {
                    if(obj.length > 0) {
                        res.send({
                            "data": {
                                "purchase_records": obj
                            }});
                    } else {
                        res.send({
                            "error": "No records found"
                        })
                    }
                })
                .where({userEmail: response})
                .catch(error => console.log("Error in find ", error))
        }  else if (response === null) {
            res.send("token required")
        } else {
            res.send("Invalid token")
        }
    } catch(err) {
        console.log("err",err);
        res.send({ "error": err });
    }
}


// Stock get method  

exports.getAllStock = (req, res) => {
    Stock.find({}, (err, obj) => {
        res.send(obj);
    });
}

// Supplier get method  

exports.getAllSupplier = (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const response = helper.genricJWTValidator(token);
        if (response) {
            //now find the records with condition where email matches
                Supplier.find({},(error,obj) => {
                    if(obj.length > 0) {
                        res.send({
                            "data": {
                                "supplier_records": obj
                            }});
                    } else {
                        res.send({
                            "error": "No records found"
                        })
                    }
                })
                .where({userEmail: response})
                .catch(error => console.log("Error in find ", error))
        }  else if (response === null) {
            res.send("token required")
        } else {
            res.send("Invalid token")
        }
    } catch(err) {
        console.log("err",err);
        res.send({ "error": err });
    }
}
