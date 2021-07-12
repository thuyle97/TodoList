const express = require ("express");
const bodyParser = require ("body-parser");
const mongoose = require ('mongoose');
const _ = require('lodash');

const app = express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extened: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-thuyle:test123@cluster0.aykkn.mongodb.net/todolistBD");

const itemSchema = {
  name: String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item ({
  name: "Cook"
});
const item2 = new Item ({
  name: "Study"
});
const item3 = new Item ({
  name: "Walk"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model ("List", listSchema);

//get route
app.get("/", function (req, res)  {
  Item.find({}, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length === 0) {
        Item.insertMany(defaultItems, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Added successfully!");
          }
        });
        res.redirect("/");
      }
      else {
        res.render("list", {listTitle: "Today", newListItem: result});
      }
    }
  });
})

//get another route
app.get("/:routeName", function(req, res) {
  const customListName = _.capitalize(req.params.routeName);

  List.findOne({name: customListName}, function(err, result) {
    if(!err){
      if (!result) {
        console.log("Does not exist.");
        const list = new List ({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        console.log("Already exists.");
        res.render("list", {listTitle: result.name, newListItem: result.items});
      }
    }
  });

});

app.get("/about", function(req, res) {
  res.render("about")
});

app.post("/", function(req, res) {
  const item = req.body.newItem;
  const listName = req.body.list;

  const newItem = new Item ({
    name: item
  });

  if (listName === "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundItem) {
      foundItem.items.push(newItem);
      foundItem.save();
      res.redirect("/"+listName);
    });
  }
});

app.post("/delete", function(req, res) {
  const checkedItem = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItem, function(err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    })
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItem}}}, function(err, result) {
      if (!err) {
        res.redirect("/" +listName);
      }
    })
  }

});

app.listen(3000, function()  {
  console.log("Server is running on 3000 port.");
})
