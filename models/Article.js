var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    // the title of the article
    headline: {
        type: String,
        multiple:true,
        required: true
    },
    // a short summary of the article
    summary: {
        type: String,
        multiple:true,
        required: true
    },
    // the URL to the original article
    url: {
        type: String,
        multiple: true,
        required: true
    },
    img:{
        type:String,
        multiple:true,
        required: true
    },
    // "comments" is an array that stores ObjectIds
    // The ref property links these ObjectIds to the Comment model
    // This allows us to populate the Article with any associated Comments
    comments: [
        {
            // Store ObjectIds in the array
            type: Schema.Types.ObjectId,
            // The ObjectIds will refer to the ids in the Comment model
            ref: "Comment"
        }
    ]
});


var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;