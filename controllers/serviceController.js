const EasyBusiness = require("../models/EasyBusiness");

//getAllItems get method 
exports.getAllItems = (req, res) => {
    EasyBusiness.find({}, (err, obj) => {
        res.send(obj);
    });
}

//add item 
exports.addItem = async(req,res) => {
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