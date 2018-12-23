// Import the model 
var db = require("../models");

//Require express
var express = require("express");

//Require mongojs
var mongoose = require("mongoose");

//Scraping tools
var cheerio = require("cheerio");
var axios = require("axios");

module.exports = function (app) {

	// GET route for scraping the website
app.get("/scrape", function (req, res) {
	axios.get("https://www.npr.org/sections/news/").then(function (response) {
	  const $ = cheerio.load(response.data);
  
	  // Find all elements in an article tag
	  $("div.list-overflow > article").each(function (i, element) {
		$("time").remove();
		let result = {};
  
		result.title = $(this)
		  .children("div.item-info")
		  .children("h2.title")
		  .text();
		result.summary = $(this)
		  .children("div.item-info")
		  .children("p.teaser")
		  .children("a")
		  .attr("href");
		result.link = $(this)
		  .children("div.item-info")
		  .children("h2.title")
		  // .children("p.teaser")
		  .children("a")
		  .attr("href");
  
		// creates new article using the `result` object built from scraping
		db.Article.create(result)
		  .then(function (dbArticle) {
			// View the added result in the console
			console.log(dbArticle);
		  })
		  .catch(function (err) {
			// If an error occurred, log it
			console.log(err);
		  });
	  });
  
	  // Send a message to the client
	  res.send("scrape complete");
	});
  });
}