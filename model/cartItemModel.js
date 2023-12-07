const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
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
});

const CartItem = mongoose.model("CartItem", cartItemSchema);

module.exports = CartItem;
