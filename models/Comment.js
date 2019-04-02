var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    // the name of the user who left the comment
    username: String,
    // the text left as a comment by the user
    text: String
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;