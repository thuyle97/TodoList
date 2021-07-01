const express = require ("express");
const bodyParser = require ("body-parser");
const date = require (__dirname + "/date.js");


const app = express();

let items = [];
let workItems = [];

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extened: true}));
app.use(express.static("public"));

//get route
app.get("/", function (req, res)  {
  let day = date.getdate();
  res.render("list", {listTitle: day, newListItem: items});
})

//get another route
app.get("/work", function(req, res) {
  res.render("list", {listTitle: "Work List", newListItem: workItems});
})

app.get("/about", function(req, res) {
  res.render("about")
})

app.post("/work", function(req, res) {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
})


app.post("/", function(req, res) {
  var item = req.body.newItem;
  if (req.body.list === "work") {
    workItems.push(item);
    res.redirect("/work");
  }
  else {
    items.push(item);
    res.redirect("/");
  }
});


app.listen(3000, function()  {
  console.log("Server is running on 3000 port.");
})
