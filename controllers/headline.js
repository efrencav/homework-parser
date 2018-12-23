// Import the model 
var db = require("../models");

//Require express
var express = require("express");

//Require mongojs
// var mongojs = require("mongoose");

module.exports = function (app) {
  //Routes
  //At the root path, display/render the home.handlebars file.
  app.get("/", function (req, res) {
    db.Article.find({
      "saved": false
    }, function (error, data) {
      var hbsObject = {
        article: data
      };
      //  console.log(hbsObject);
      res.render("home", hbsObject);
    });
  });

  //At the /saved path, display/render the saved.handlebars file.
  app.get("/saved", function (req, res) {
    db.Article.find({
      "saved": true
    }).populate("notes").exec(function (error, data) {
      var hbsObject = {
        article: data
      };
      res.render("saved", hbsObject);
    });
  });

  //This route will retrieve all of the data.
  app.get("/articles", function (req, res) {
    // Grab every doc in the Articles array
    db.Article.find({}, function (error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Or send the doc to the browser as a json object
      else {
        res.json(doc);
      }
    });
  });



  // Save an article
  app.post("/articles/save/:id", function (req, res) {
    // Use the article id to find and update its saved boolean
    db.Article.findOneAndUpdate({
        "_id": req.params.id
      }, {
        "saved": true
      }, {
        new: true
      })
      // Execute the above query
      .then(function (err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        } else {
          // Or send the document to the browser

          res.send(doc);
          //   console.log("********"+JSON.stringify(doc));
        }
      });
  });

  // Delete an article
  app.post("/articles/delete/:id", function (req, res) {
    // Use the article id to find and update its saved boolean
    db.Article.findOneAndUpdate({
        "_id": req.params.id
      }, {
        "saved": false,
        "notes": []
      })
      // Execute the above query
      .then(function (err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        } else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
  });

  // //Delete an article
  // app.delete("/articles/:id", function(req, res) {
  //     // Remember: when searching by an id, the id needs to be passed in
  //     db.Article.deleteOne({ _id: req.params.id },
  //         function(err, data) {
  //             if (err) {
  //                 console.log(err);
  //             }
  //             else {
  //             res.json(data);
  //             }
  //     });
  // });
}