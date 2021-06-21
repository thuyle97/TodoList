const express = require ("express");
const bodyParser = require ("body-parser");

const app = express();

app.set("view engine","ejs");

//get route
app.get("/", function (req, res)  {
  var today = new Date();
  var currentDay = today.getDay();
  var day = "";
  if (currentDay === 0) {
    day = "Sunday";
  }
  else if (currentDay === 1) {
    day = "Monday";
  }
  else if (currentDay === 1) {
    day = "Tuesday";
  }
  else if (currentDay === 1) {
    day = "Wednesday";
  }
  else if (currentDay === 1) {
    day = "Thursday";
  }
  else if (currentDay === 1) {
    day = "Friday";
  }
  else {
    day = "Saturday";
  }
  res.render("list", {kindofDay: day});
})

app.listen(3000, function()  {
  console.log("Server is running on 3000 port.");
})
