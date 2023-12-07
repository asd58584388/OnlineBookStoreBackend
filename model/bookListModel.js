const mongoose = require("mongoose");

const bookListSchema = new mongoose.Schema({
    books: [
        {
            bookid: {
                type: String,
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
            authors: [
                {
                    
                    type: String,
                    
                },
            ],
        },
    ],
    reviews: [
        {
            reviewerID: {
                type: String,
                required: true,
            },
            reviewTitle: {
                type: String,
                required: true,
            },
            reviewText: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            createDate: {
                type: Date,
                default: Date.now,
            },
            reviewerName: {
                type: String,
                required: true,
            },
        },
    ],
    bookListName: {
        type: String,
        required: true,
    },
    createUserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
    createUserName: {
        type: String,
        required: true,
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
});

module.exports = bookListSchema;
