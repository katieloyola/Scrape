var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();


// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect Handlebars to our Express app
app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
});

// Routes
require('./routes/apiRoutes')(app);
require('./routes/viewRoutes')(app);


//possible handlebars routes...

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // TODO 20: Finish the route so it grabs all of the articles
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
        res.json(err);
    })
});

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function (req, res) {
      // var ObjectId = require('mongoose').Types.ObjectId;
      console.log(req.params.id)
      db.Article.findOne({
          _id: req.params.id
        })

        // .populate("note")
        .then(function (dbArticle) {
          console.log(dbArticle);
          res.json(dbArticle);
        })
        .catch(function (err) {
          res.json(err);
        });
      // TODO 20
      // ====
      // Finish the route so it finds one article using the req.params.id,
      // and run the populate method with "note",
      // then responds with the article with the note included
    });

    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function (req, res) {
      db.Article.update({
          _id: req.params.id
        })
        .then(function (dbArticle) {
          return db.User.findOneAndUpdate({}, {
            $push: {
              note: dbArticle._id
            }
          }, {
            new: true
          });
        }).then(function (dbUser) {
          res.json(dbUser);
        })
        .catch(function (err) {
          res.json(err);
        });
      // TODO 20
      // ====
      // save the new note that gets posted to the Notes collection
      // then find an article from the req.params.id
      // and update it's "note" property with the _id of the new note
    });

    // Start the server
    app.listen(PORT, function () {
      console.log("App running on port " + PORT + "!");
    });