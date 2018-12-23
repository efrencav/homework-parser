// Import the model 
var db = require("../models");

//Require express
var express = require("express");

//Require mongojs
var mongojs = require("mongoose");

module.exports = function (app) {

  // Grab an article by it's ObjectId
  app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({
        "_id": req.params.id
      })
      // ..and populate all of the notes associated with it
      .populate("note")
      // now, execute our query
      .exec(function (error, doc) {
        // Log any errors
        if (error) {
          console.log(error);
        }
        // Otherwise, send the doc to the browser as a json object
        else {
          res.json(doc);
        }
      });
  });

  // Create a new note
  app.post("/notes/save/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    console.log("Inside this post block to save note!!")
    // console.log("******request"+JSON.stringify(req));

    console.log(req.body.text);
    var Note_to_be_added = new db.Note({
      body: req.body.text,
      article: req.params.id
    });
    console.log(req.body)
    // And save the new note the db
    Note_to_be_added.save(function (error, note) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Otherwise
      else {
        // Use the article id to find and update it's notes
        db.Article.findOneAndUpdate({
            "_id": req.params.id
          }, {
            $push: {
              "notes": note
            }
          })
          // Execute the above query
          .exec(function (err) {
            // Log any errors
            if (err) {
              console.log(err);
              res.send(err);
            } else {
              // Or send the note to the browser
              res.send(note);
            }
          });
      }
    });

  });

  //Delete a note
  app.delete("/notes/delete/:note_id/:article_id", function (req, res) {
    // Use the note id to find and delete it
    db.Note.findOneAndRemove({
      "_id": req.params.note_id
    }, function (err) {
      // Log any errors
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        db.Article.findOneAndUpdate({
            "_id": req.params.article_id
          }, {
            $pull: {
              "notes": req.params.note_id
            }
          })
          // Execute the above query
          .exec(function (err) {
            // Log any errors
            if (err) {
              console.log(err);
              res.send(err);
            } else {
              // Or send the note to the browser
              res.send("Note was deleted");
            }
          });
      }
    });
  });


}