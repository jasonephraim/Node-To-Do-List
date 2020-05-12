var express = require("express");
var session = require("cookie-session");
var bodyParser = require("body-parser");
var path = require("path");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();

let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();

let current_date_time =
  year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

app.use(express.static(path.join(__dirname, "public")));

/* Using sessions */
app
  .use(session({ secret: "ThisIsMySecret" }))

  /* If there is no to do active array in the session, 
we create an empty one in the form of an array before continuing */
  .use(function (req, res, next) {
    if (typeof req.session.todolist == "undefined") {
      req.session.todolist = [];
    }
    next();
  })

  /* Current session to do list and form */
  .get("/todo", function (req, res) {
    res.render("todo.ejs", { todolist: req.session.todolist });
  })

  /* Adding a to do item */
  .post("/todo/add/", urlencodedParser, function (req, res) {
    if (req.body.newtodo != "") {
      req.session.todolist.push(
        "Task: " +
          req.body.newtodo +
          " - Priority: " +
          req.body.newtodopriority +
          " - Time Stamp: " +
          current_date_time
      );
    }
    res.redirect("/todo");
  })

  /* Deleting a to do item */
  .get("/todo/delete/:id", function (req, res) {
    if (req.params.id != "") {
      req.session.todolist.splice(req.params.id, 1);
    }
    res.redirect("/todo");
  })

  /* redirect all to /todo */
  .use(function (req, res, next) {
    res.redirect("/todo");
  })

  .listen(3000);
