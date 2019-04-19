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
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";
//Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


//Routes

//GET route for scraping Miami Herald website
app.get("/scrape", function(req,res) {
    db.Article.deleteMany({}, axios.get("https://www.miamiherald.com/news/").then(function(response) {

        //We load the body into cheerio and save it to $
        var $ = cheerio.load(response.data);
    
        //We grab the div class package
        $(".teaser").each(function(i, ele) {
    
            //Create a result object
            var result = {};
            //Add text, href and image of every link and save them to the result object
            result.title = $(this).children("h4").children("a").text();
            result.link = $(this).children("h4").children("a").attr("href");
            result.summary = $(this).children("p").text();
    
            // console.log("Result from route");
            // console.log("----------------------------------------");
            // console.log(result);
    
            if(result.summary) {                            
            // Create articles using the result object
            db.Article.create(result).then(function(dbArticle){
                //View articles in console
                // console.log(dbArticle);           
            }).catch(function(err) {
                // console.log(err);
                return res.json(err);
            });
            }
        });
        })
        )
    //We grab the body of the html with axios
    
});

//GET route for getting all articles from database
app.get("/", function(req,res) {
    db.Article.find({}).then(function(dbArticle) {
        res.render("index", { articles : dbArticle})
    }).catch(function(err) {
        res.json(err);
    });
});

//GET route for grabbing a specific Article by id and populate it with a note
app.get("/all/:id", function(req,res) {
    db.Article.findOne({
        _id: req.params.id
    }).populate("note").then(function(dbArticle) {
        res.send(dbArticle)
    }).catch(function(err) {
        res.json(err);
    });
});

//POST route for saving or updating an Article's note
app.post("/all/:id", function(req,res) {
    db.Note.create(req.body).then(function(dbNote) {
        return db.Article.findOneAndUpdate({_id:req.params.id}, {note: dbNote._id }, {new:true});
        // res.render("index", {notes: dbNote});
    }).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    })
});

//Start server
app.listen(PORT, function() {
    console.log("News scraping app running on http://localhost:" + PORT);
});