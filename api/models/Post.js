const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true,
    },
    desc: {
        type: String,
        max: 500
    },
    img: {
        type: String,
    },
    likes: {
        type: Array,
        default: []
    },
    location: {
        type: String,
        default: ""
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);