const mongoose = require("mongoose")

const PostSchema = mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    userId: {
        type: String,
        require: true
    },
    time: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    summary: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    }
})

const PostModel = mongoose.model('posts', PostSchema);
module.exports = PostModel;