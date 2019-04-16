//System requirements
var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

//Require the models
var db = require("./models");

//Set the port
var PORT = process.env.PORT || 3030;

//Initialize express
var app = express();

//Parse request body as JSON
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

//Make public a static folder
app.use(express.static("public"));

//Set handlebars route
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper5";
//Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
// mongoose.connect("mongodb://localhost/newsScraper5", { useNewUrlParser: true });

//Routes

//GET route for scraping Miami Herald website
app.get("/scrape", function(req,res) {
    //We grab the body of the html with axios
    axios.get("https://www.miamiherald.com/").then(function(response) {
        //We load the body into cheerio and save it to $
        var $ = cheerio.load(response.data);

        //We grab the div class package
        $(".package").each(function(i, ele) {
            //Create a result object
            var result = {};
            //Add text, href and image of every link and save them to the result object
            result.title = $(this).children("h3").children("a").text();
            result.link = $(this).children("h3").children("a").attr("href");
            result.publishedTime = $(this).children("time").text();

            console.log(result);
            // Create articles using the result object
            db.Article.create(result).then(function(dbArticle){
                //View article in console
                console.log(dbArticle);
            }).catch(function(err) {
                console.log("there is an error");
                // return res.json(err);
            });
        });

        //If the scraping worked, send message to user
        res.send("Scraping Complete");
    });
});

//GET route for getting all articles from database

//GET route for grabbing a specific Article by id and populate it with a note

//POST route for saving or updating an Article's note




//Start server
app.listen(PORT, function() {
    console.log("News scraping app running on http://localhost:" + PORT);
});