/* eslint-disable no-console */
var express = require("express");

var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

require("dotenv").config();
// Our scraping tools
// var request = require("request");
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));

app.use(express.urlencoded({
  extended: true
}));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
app.use(express.static(__dirname + "/app/public"));
// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Connect to the Mongo DB (connect to remote mongolab database if deployed;
// otherwise connect to the local mongoHeadlines database)

var databaseUri = "mongodb://localhost/mongoHeadlines";
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
}
console.log(databaseUri);

// Routes

// Route for getting all Articles from the db
app.get("/", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.render("allarticles", {
        articles: dbArticle
      });
      //res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// A GET route for scraping the Dressage-News website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with request
  axios.get("https://www.digitaltrends.com").then(function (response) {


    // Load the HTML into cheerio and save it to a variable

    var $ = cheerio.load(response.data);

    // eslint-disable-next-line no-unused-vars
    $(".m-river--item").each(function (i, element) {
      var result = {};
      result.headline = $(this)
        .children(".m-river--meta")
        .children("h3.m-river--title")
        .text();
      // console.log(result.headline.trim());
      // console.log("87");

      result.summary = $(this)
        .children(".m-river--meta")
        .children(".m-river--content")
        .text();
      // console.log(result.summary.trim());
      // console.log("93");

      result.url = $(this)
        .children(".m-river--meta")
        .children("h3.m-river--title")
        .children("a")
        .attr("href");
      // console.log(result.url.trim());
      // console.log("100");

      // Check to see if the article already exists in the database; if it does, don't add another copy;
      // but if it doesn't, then insert the article into the database
      db.Article.findOneAndUpdate({
          headline: result.headline
        }, result, {
          upsert: true
        })
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
          console.log("118");
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for grabbing a specific Article by id, populate it with its comments
app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({
      _id: req.params.id
    })
    // ..and populate all of the comments associated with it
    .populate("comments")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.render("articlewithcomments", {
        article: dbArticle
      });
      //res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.post("/articles/:id", function (req, res) {
  // Create a new comment and pass the req.body to the entry
  db.Comment.create(req.body)
    .then(function (dbComment) {
      return db.Article.findOneAndUpdate({
        _id: req.params.id
      }, {
        $push: {
          comments: dbComment._id
        }
      }, {
        new: true
      });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Delete One from the DB
app.delete("/delete/:id", function (req, res) {
  // Remove a comment using the objectID
  db.Comment.remove({
      _id: req.params.id
    },
    function (error, removed) {
      // Log any errors from mongojs
      if (error) {
        console.log(error);
        // console.log("175");
        res.send(error);
      } else {
        // Otherwise, send the mongojs response to the browser
        // This will fire off the success function of the ajax request
        console.log(removed);
        res.send(removed);
      }
    }
  );
});


// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});