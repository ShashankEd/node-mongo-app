module.exports = app => {
    const serviceController = require('../controllers/serviceController');
    var router = require("express").Router();

    //1. Register User
    router.post("/register",serviceController.register);

    //5. Login User
    router.post("/login",serviceController.login);


    //3. Get all items 
    router.get("/getAllItems",serviceController.getAllItems);

    //4. Add an item 
    router.post('/add-item',serviceController.addItem);

    //5. Purchase items 
    router.post('/purchase',serviceController.purchase);

    //6. Items Stock 
    router.post('/stock',serviceController.stock);

    //7. Supplier List
    router.post('/supplier',serviceController.supplier);

    //bind route 
    app.use(router);
}