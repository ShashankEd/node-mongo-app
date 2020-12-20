const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const token = require('./helperFunction');
app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const TodoTask = require("./models/TodoTask");
const EasyBusiness = require('./models/EasyBusiness');
const User = require('./models/User');
const mongoose = require("mongoose");
//connection to db
mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    app.listen(3000, () => console.log("Mongoose Server Up and running"));
})

// GET METHOD
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.send(tasks);
        // res.render("todo.ejs", { todoTasks: tasks });
    });
});

app
.route("/add")
.post(async (req, res) => {
// .post('/',async (req, res) => {
    console.log("req.body.content ",req)
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.send({"result":"success"});
        // res.redirect("/");
    } catch (err) {
        res.send({"error":err});
        // res.redirect("/");
    }
});

//UPDATE
app
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });

//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        // res.redirect("/");
        res.send({"result":"success"})
    });
});

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
    console.log("req.body ",req)
    const easyBusiness = new EasyBusiness({
        itemType: req.body.itemType,
        itemCategory: req.body.itemCategory,
        itemCost: req.body.itemCost,
        itemName: req.body.itemName,
        itemExpiry: req.body.itemExpiry,
    });
    try {
        await easyBusiness.save();
        res.send({"result":"Records inserted"}); 
    } catch (err) {
        res.send({"error":err});
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
        await user.save();
        console.log("registered");
        const tok = token.generateJWTToken(req.body.email);
        console.log("user saved and token ", tok);
        res.json({
            "data": {
                "token": tok
            }
        }); 
    } catch (err) {
        res.send({"error":err});
    }
});

// console.log(process.env.TOKEN_SECRET);
// console.log(require('crypto').randomBytes(64).toString('hex'));