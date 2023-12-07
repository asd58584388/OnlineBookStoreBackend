const mongoose = require("mongoose");
const CartItem = require("./cartItemModel");

const CartSchema = new mongoose.Schema({
    userid: {
        // need to do sth here
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    items: [
        {
            bookid: {
                type: String,
                required: true,
            },
            booktitle: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            authors: {
                type: [String],
            },
            smallThumbnail: {
                type: String,
                //image url
            },
            thumbnail: {
                type: String,
                //image url
            },
        },
    ],
});
module.exports = CartSchema;
