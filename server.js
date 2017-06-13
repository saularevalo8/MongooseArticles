var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var Note = require("./models/note.js");
var Article = require("./models/article.js");

var request = require("request");
var cheerio = require("cheerio");

mongoose.Promise = Promise;


var app = express();

var port = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({
    extended: false
}));


app.use(express.static("public"));


mongoose.connect("mongodb://heroku_5q2c8h66:48777gsutljglgv2gpcevj5e0a@ds031972.mlab.com:31972/heroku_5q2c8h66");
var db = mongoose.connection;


db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});


db.once("open", function() {
    console.log("Mongoose connection successful.");
});


app.get("/scrape", function(req, res) {

    request("https://www.nytimes.com/", function(error, response, html) {

        var $ = cheerio.load(html);
        
        $("ul.portal-posts-list li").each(function(i, element) {


            var result = {};


            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");


            var entry = new Article(result);


            entry.save(function(err, doc) {

                if (err) {
                    console.log(err);
                } else {
                    console.log(doc);
                }
            });

        });
    });

    res.send("Scrape Complete");
});

app.get("/articles", function(req, res) {

    article.find({}, function(error, doc) {

        if (error) {
            console.log(error);
        } else {
            res.json(doc);
        }
    });
});

app.get("/articles/:id", function(req, res) {

    article.findOne({ "_id": req.params.id })

    .populate("note")

    .exec(function(error, doc) {

        if (error) {
            console.log(error);
        } else {
            res.json(doc);
        }
    });
});



app.post("/articles/:id", function(req, res) {

    var newNote = new note(req.body);

    newNote.save(function(error, doc) {

        if (error) {
            console.log(error);
        } else {

            Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })

            .exec(function(err, doc) {

                if (err) {
                    console.log(err);
                } else {

                    res.send(doc);
                }
            });
        }
    });
});



app.listen(port, function() {
    console.log("App running on " + port + "!");
});
