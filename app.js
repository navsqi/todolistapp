//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const moment = require('moment');
const mongoose = require("mongoose");
const helper = require("./helper");
const _ = require('lodash');

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-nauval:Kocak123s@cluster0-we0x9.mongodb.net/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
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

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

// Item.insertMany(defaultItems, function(err){
//     if(err){
//         console.log(err);
//     }else{
//         db.close();
//         console.log("data has been inserted successfully");
//     }
// });
let day = moment().locale("id-ID").format("dddd, D MMMM YYYY");

app.get('/favicon.ico', (req, res) => res.sendStatus(204));

app.get("/", function (req, res) {

    

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

app.get("/:customListName", function(req,res){
    let customListName = _.lowerCase(req.params.customListName);

    List.findOne({name: customListName}, function(err, result){
        if(!err){
            if(result){
                res.render("list", {
                    day: helper.toTitleCase(customListName),
                    list: "todo",
                    todo: result.items,
                    helper: helper
                });
            }else {
                let list = new List({
                    name: customListName,
                    items: defaultItems
                });

                if(list.save()){
                    res.redirect("/"+customListName);
                }


            }
        }
    });

    
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.post("/", function (req, res) {
    var todo = req.body.todo;
    let list = req.body.list;
    let item = new Item({
        name: todo
    });
    if (list === day) {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: _.lowerCase(req.body.list)}, function(err,result){
            result.items.push(item);
            result.save();
            res.redirect("/" + _.lowerCase(req.body.list));
        });

    }
});

app.post("/delete", function(req,res){

    let list = _.lowerCase(req.body.list);
    let id = req.body.item;

    if(list === day){
        Item.findByIdAndRemove(req.body.item, function(error){
            if(error){
                console.log(error);
            }else{
                console.log("Item has deleted successfully");
                res.redirect("/");
            }
        });
    }else {
        List.findOneAndUpdate( {name: list}, {$pull: {items: {_id: id}}}, function(err, result){
            if(!err){
                res.redirect("/"+list);
            }
        } )
    }

    
});

app.listen(process.env.PORT || 3000, () => console.log("Server started on port successfully"));