module.exports = app => {
    const serviceController = require('../controllers/serviceController');
    var router = require("express").Router();

    //1. Get all items 
    router.get("/getAllItems",serviceController.getAllItems);

    //2. Add an item 
    router.post('/add-item',serviceController.addItem);

    //bind route 
    app.use(router);
}