const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const helper = require('./helperFunction');
app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const User = require("./models/User");
const EasyBusiness = require("./models/EasyBusiness");
const Purchase = require("./models/Purchase");
const Stock = require("./models/Stock");
const Supplier = require('./models/Supplier');
const Token = require("./models/Token");
const mongoose = require("mongoose");
//connection to db
mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    app.listen(process.env.PORT || 3000, () => console.log("Mongoose Server Up and running"));
});

// require('../node-mongo-app/routes/easyRoutes')(app);

// // GET METHOD
// app.get("/", (req, res) => {
//     TodoTask.find({}, (err, tasks) => {
//         res.send(tasks);
//         // res.render("todo.ejs", { todoTasks: tasks });
//     });
// });

// app
//     .route("/add")
//     .post(async (req, res) => {
//         // .post('/',async (req, res) => {
//         console.log("req.body.content ", req)
//         const todoTask = new TodoTask({
//             content: req.body.content
//         });
//         try {
//             await todoTask.save();
//             res.send({ "result": "success" });
//             // res.redirect("/");
//         } catch (err) {
//             res.send({ "error": err });
//             // res.redirect("/");
//         }
//     });

//UPDATE
// app
//     .route("/edit/:id")
//     .get((req, res) => {
//         const id = req.params.id;
//         TodoTask.find({}, (err, tasks) => {
//             res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
//         });
//     })
//     .post((req, res) => {
//         const id = req.params.id;
//         TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
//             if (err) return res.send(500, err);
//             res.redirect("/");
//         });
//     });

//DELETE
// app.route("/remove/:id").get((req, res) => {
//     const id = req.params.id;
//     TodoTask.findByIdAndRemove(id, err => {
//         if (err) return res.send(500, err);
//         // res.redirect("/");
//         res.send({ "result": "success" })
//     });
// });

//easy business model- APIS

// GET METHOD FOR EASY BUSINESS TO GET ALL THE ITEMS AVAILABLE
app
    .route("/getAllItems")
    .get((req, res) => {
        EasyBusiness.find({}, (err, obj) => {
            res.send(obj);
        });
    });

app
    .route("/add-item")
    .post(async (req, res) => {
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
    });

//register endpoint
app
    .route("/register")
    .post(async (req, res) => {
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
    });

// console.log(process.env.TOKEN_SECRET);
// console.log(require('crypto').randomBytes(64).toString('hex'));

//ShubhamGupta
//login with JWTtoken
app
    .route("/login")
    .post(async (req, res) => {
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
    });
//Shubham Gupta
//Purchase
app
    .route("/purchase")
    .post(async (req, res) => {
        // console.log("req.body ", req)
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
    });
//Shubham Gupta
//Supplier
app
    .route("/supplier")
    .post(async (req, res) => {
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
    });
//Shubham Gupta
//Stock

app
    .route("/stock")
    .post(async (req, res) => {
        console.log("req.body ", req)
        const stock = new Stock({
            productName: req.body.productName,
            productQuantity: req.body.productQuantity,
            productType: req.body.productType,
            productExpiry: req.body.productExpiry,
            productSupplier: req.body.productSupplier,
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
                res.send("Error occured")
            }
        } catch (err) {
            res.send({ "error": err });
        }
    });