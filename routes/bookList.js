require("dotenv").config();
const SECRET = process.env.JWT_SECRET;

const express = require("express");
const jwt = require("jsonwebtoken");
const assert = require("http-assert"); //for debug
const router = express.Router();

const { BookReview } = require("../model/index");
const { User } = require("../model/index");
const { BookList } = require("../model/index");
const { ObjectId } = require("mongodb");
const e = require("express");

const auth = async (req, res, next) => {
    console.log("req.headers.authorization", req.headers.authorization);
    const raw = req.headers.authorization;
    // const raw = String(req.headers.authorization).split(' ').pop();
    try {
        const { id } = jwt.verify(raw, SECRET);
        // console.log("user id", id);
        let user = await User.findOne({ _id: new ObjectId(id) });
        // console.log("user", user);
        if (user == null) {
            return res.status(401).send({ message: "Unauthorized" });
        } else {
            req.userid = id;
            console.log("req.userid", req.userid);
            next();
        }
    } catch (err) {
       
        req.userid = "";
        next();
        // return res.status(401).send({ message: "Unauthorized" });
    }
};

router.get("/", async (req, res) => {
    if (
        req.headers.authorization == undefined ||
        req.headers.authorization == ""
    ) {
        const bookLists = await BookList.find({ isPublic: true }).limit(10);
        let filteredBookLists = bookLists.map((bookList) => {
            return {
                id: bookList._id,
                bookListName: bookList.bookListName,
                createUserName: bookList.createUserName,
                isPublic: bookList.isPublic,
                books: bookList.books,
                reviews: bookList.reviews,
                createDate: bookList.createDate,
            };
        });
        filteredBookLists.sort((a, b) => {
            return b.createDate - a.createDate;
        });
        return res.send(filteredBookLists);
    } else {
        // const user= jwt.verify(req.headers.authorization, SECRET);
        // console.log('user', user);
        const bookLists = await BookList.find({ isPublic: true });
        let filteredBookLists = bookLists.map((bookList) => {
            return {
                id: bookList._id,
                bookListName: bookList.bookListName,
                createUserName: bookList.createUserName,
                isPublic: bookList.isPublic,
                books: bookList.books,
                reviews: bookList.reviews,
                createDate: bookList.createDate,
            };
        });
        filteredBookLists.sort((a, b) => {
            return b.createDate - a.createDate;
        });
        return res.send(filteredBookLists);
    }
});

router.delete("/:id", auth, async (req, res) => {
    BookList.findByIdAndDelete(req.params.id).then((result) => {
        console.log("result", result);
        res.send(result);
    });
});

router.get("/check/:id", auth, async (req, res) => {
    // console.log("req.userid", req.userid);
    if (req.userid == undefined || req.userid == "") {
        return res.send({
            message: "Not User Booklist",
            isUserBookList: false,
        });
    } else {
        const bookList = await BookList.findById(req.params.id);
        if (bookList == null) {
            return res.send({
                message: "Not User Booklist",
                isUserBookList: false,
            });
        } else {
            if (bookList.createUserID == req.userid) {
                return res.send({
                    message: "User Booklist",
                    isUserBookList: true,
                });
            } else {
                return res.send({
                    message: "Not User Booklist",
                    isUserBookList: false,
                });
            }
        }
    }
});

router.post("/review", auth, async (req, res) => {
    console.log('req.body', req.body);


    const { id, reviewTitle, reviewText, rating } = req.body;
    const user = await User.findOne({ _id: new ObjectId(req.userid) });
    const booklist= await BookList.findById(new ObjectId(id));
    console.log('booklist', booklist);
    if (booklist == null || user == null) {
        return res.status(404).send({ message: "Booklist not found" });
    }
    else{
        let bookListReview = {
            reviewerID: id,
            reviewTitle: reviewTitle,
            reviewText: reviewText,
            rating: rating,
            createDate: Date.now(),
            reviewerName: user.username,
        };
        booklist.reviews.push(bookListReview);
        await booklist.save();
    
        let bookList ={
            id: booklist._id,
                bookListName: booklist.bookListName,
                createUserName: booklist.createUserName,
                isPublic: booklist.isPublic,
                books: booklist.books,
                reviews: booklist.reviews,
                createDate: booklist.createDate,
        }
        res.send({ message: "Review Added" ,booklist:bookList});

    }

});


module.exports = router;
