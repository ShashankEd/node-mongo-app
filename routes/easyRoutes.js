//Shubham Gupta
module.exports = app => {
    const serviceController = require('../controllers/serviceController');
    var router = require("express").Router();

    //1. Register User
    router.post("/register", serviceController.register);

    //2. Login User
    router.post("/login", serviceController.login);

    //3. Add an item 
    router.post('/add-item', serviceController.addItem);

    //4. Purchase items 
    router.post('/purchase', serviceController.purchase);

    //5. Items Stock 
    router.post('/stock', serviceController.stock);

    //6. Supplier List
    router.post('/supplier', serviceController.supplier);

    //7. Get all items 
    router.get("/getAllItems", serviceController.getAllItems);

    //8. Get All Purchase
    router.get("/getAllPurchase", serviceController.getAllPurchase);
    
    //9. get All Stock
    router.get("/getAllStock", serviceController.getAllStock);

     //10. get All Suppliertock
    router.get("/getAllSupplier", serviceController.getAllSupplier);
    

    //bind route 
    app.use(router);
}