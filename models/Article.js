var mongoose = require("mongoose");

//Save reference to Schema constructor
var Schema = mongoose.Schema;

//Create new UserSchema object
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        unique: true,
        required: true
    },
    publishedTime: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

//Now create model from above schema using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);


//Export Article model
module.exports = Article;
