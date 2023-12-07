const CartSchema = require('../model/cartModel');
const UserSchema = require('../model/userModel');
const BookReviewSchema = require('../model/bookReviewModel');
const BookListSchema = require('../model/bookListModel');
const OrderSchema = require('../model/orderModel');

const mongoose = require('mongoose')
const uri = 'mongodb+srv://fenzai0828:CH9noyGpYjSrxBKF@onlinebookstore.caygox5.mongodb.net/?retryWrites=true&w=majority';
// const uri = process.env.DATABASE_URL;


async function main() {
    mongoose.connect(uri,{
})
}

main()
    .then(() =>{
        console.log("MongoDB Connected");
    })
    .catch((err) =>{
    console.log(err);
});


const Cart = mongoose.model('Cart', CartSchema);
const User = mongoose.model('User', UserSchema);
const BookReview = mongoose.model('BookReview', BookReviewSchema);
const BookList = mongoose.model('BookList', BookListSchema);
const Order = mongoose.model('Order', OrderSchema);

module.exports = {User,Cart,BookReview,BookList,Order};
