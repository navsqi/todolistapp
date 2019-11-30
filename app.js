//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
var moment = require('moment');
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});
db = mongoose.connection;

const itemSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});
const item2 = new Item({
    name: "Hit the + button to add a new item"
});
const item3 = new Item({
    name: "<--- hit this to delete an item"
});
const defaultItems = [item1,item2,item3];

// Item.insertMany(defaultItems, function(err){
//     if(err){
//         console.log(err);
//     }else{
//         db.close();
//         console.log("data has been inserted successfully");
//     }
// });


app.get("/", function (req, res) {

    var day = moment().locale("id-ID").format("dddd, D MMMM YYYY");

    Item.find(function(err,result){
        if(result.length === 0){
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                }else{
                    db.close();
                    console.log("data has been inserted successfully");
                }
            });

            res.redirect("/");
        }else {

                todos = result;
                res.render("list", {
                    day: day,
                    list: "todo",
                    todo: todos
                });
            
        }
        
    });
});

app.get("/work", function (req, res) {
    res.render("list", {
        day: "Works",
        list: "work",
        todo: works
    });
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.post("/", function (req, res) {
    var todo = req.body.todo;
    if (req.body.list === "work") {
        works.push(todo);
        res.redirect("/work");
    } else {

        let item = new Item({
            name: todo
        });

        item.save();
        res.redirect("/");
    }
});

app.listen(3000, () => console.log("Server started on port 3000"));