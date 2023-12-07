require("dotenv").config();
const SECRET = process.env.JWT_SECRET;

const express = require("express");
const jwt = require("jsonwebtoken");
const assert = require("http-assert"); //for debug
const router = express.Router();

//import model
const { User } = require("../model/index");
const { Cart } = require("../model/index");
const { BookList } = require("../model/index");
const { ObjectId } = require("mongodb");
// console.log(User)

// let id_count=0;

const auth2 = async (req, res, next) => {
    console.log("Auth2, token", req.headers.authorization);
    const raw = req.headers.authorization;
    // const raw = String(req.headers.authorization).split(' ').pop();
    try {
        const { id } = jwt.verify(raw, SECRET);
        console.log("Auth2, user id", id);
        let user = await User.findById(id);
        if (user == null) {
            return res.status(401).send({ message: "Unauthorized" });
        } else {
            req.userid = id;
            console.log("req.userid", req.userid);
            console.log("Auth Sucess");
            next();
        }
    } catch (err) {
        console.log("Auth Fail", err);
        req.userid = "";
        next();
        // return res.status(401).send({ message: "Unauthorized" });
    }
};

// API : Get User List
// router.get('/api/user',async(req,res) =>{
//     const users = await User.find()
//     res.send(users)
// })

// API : User Register
router.post("/", async (req, res) => {
    const { username, password, email } = req.body;

    // Check if username length is invalid (less than 2 or greater than 10)
    if (username.length < 2 || username.length > 10) {
        res.status(400).json({
            error: "Username must be between 2 and 10 characters.",
        });
        return;
    }

    // Check if password length is less than 6
    if (password.length < 6) {
        res.status(400).json({
            error: "Password must be at least 6 characters long.",
        });
        return;
    }

    // Check if user already exists
    const alreadyExist = await User.findOne({ email: email });
    console.log("alreadyExist", alreadyExist);

    if (alreadyExist) {
        res.status(409).json({ error: "Email address already in use." });
        return;
    }

    try {
        // console.log('username', username);
        const user = await User.create({
            username: username,
            password: password,
            email: email,
        });
        const cart = await Cart.create({
            userid: user._id,
            items: [],
        });

        const token = jwt.sign({ id: String(user._id) }, SECRET);
        res.send({ token: token });
    } catch (error) {
        console.error(error);
    }
});

// API : User Login
router.post("/login", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user == null) {
        return res.status(401).send({ message: "User not found" });
    }

    try {
        if (!user) {
            return res.status(401).send({ message: "User not found" });
        }

        const isPasswordValid = require("bcryptjs").compareSync(
            req.body.password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).send({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: String(user._id) }, SECRET);

        const cart = await Cart.findOne({ userid: user._id });
        const bookLists = await BookList.find({ createUserID: user._id });
        let filterdBookLists = bookLists.map((bookList) => {
            return {
                id: bookList._id,
                bookListName: bookList.bookListName,
                isPublic: bookList.isPublic,
                books: bookList.books,
                reviews: bookList.reviews,
                createDate: bookList.createDate,
                createUserName: bookList.createUserName,
            };
        });
        res.send({
            message: "Successful Login",
            user: {
                id: user._id,
                username: user.username,
                cart: cart.items,
                bookLists: filterdBookLists,
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error occurred" });
    }
});

router.get("/bookLists", async (req, res) => {
    let user = await auth(req.headers.authorization);
    if (user != false) {
        let bookLists = await BookList.find({ createUserID: user._id });

        console.log("bookLists", bookLists);

        bookLists = bookLists.map((bookList) => {
            return {
                id: bookList._id,
                bookListName: bookList.bookListName,
                isPublic: bookList.isPublic,
                books: bookList.books,
                reviews: bookList.reviews,
                createDate: bookList.createDate,
                createUserName: bookList.createUserName,
            };
        });

        res.send(bookLists);
    }
});

router.post("/bookLists", async (req, res) => {
    const body = req.body;
    console.log("body", body);

    let user = await auth(req.headers.authorization);
    console.log("user", user);

    if (user != false) {
        let bookList = await BookList.create({
            bookListName: req.body.bookListName,
            createUserID: user._id,
            createUserName: user.username,
            isPublic: req.body.isPublic,
        });
        res.send({
            id: bookList._id,
            bookListName: bookList.bookListName,
            isPublic: bookList.isPublic,
            books: bookList.books,
            reviews: bookList.reviews,
            createDate: bookList.createDate,
            createUserName: bookList.createUserName,
        });
    }
});

router.delete("/bookLists/:booklistid", auth2, async (req, res) => {
    // console.log("req.userid", req.userid);
    // console.log("req.body", req.body);
    let bookList = await BookList.findById(req.params.booklistid);
    if (bookList.createUserID == req.userid) {
        // console.log("bookList");
        bookList.books = bookList.books.filter(
            (book) => book.bookid != req.body.bookid
        );
        await bookList.save();
        res.send({ message: "Delete Book Success" });
    } else {
        res.send({ message: "Delete Book Fail" });
    }
});

router.post("/bookLists/:bookListId", async (req, res) => {
    // console.log('header', req.headers.authorization);
    // console.log('body', req.body);
    let isExist = false;

    let user = await auth(req.headers.authorization);
    if (user) {
        let bookList = await BookList.findById(req.params.bookListId);
        console.log("book", req.body.book);
        if (bookList.createUserID.equals(user._id)) {
            bookList.books.forEach((book) => {
                if (book.bookid == req.body.book.bookid) {
                    isExist = true;
                }
            });
            if (isExist) {
                res.send({ message: "Book already in the list" });
            } else {
                bookList.books.push(req.body.book);
                await bookList.save();
                res.send({ message: "Update Success" });
            }
        } else {
            res.send({ message: "Update Fail" });
        }
    }
});

router.get("/order", auth2, async (req, res) => {
    try {
        const userid = req.userid;

        if (userid != "") {
            // Retrieve the order summary for the user
            const orderSummary = await OrderSummary.findOne({
                userId: user._id,
            });
            if (orderSummary) {
                res.send(orderSummary);
            } else {
                res.status(404).send({ message: "Order summary not found" });
            }
        } else {
            res.status(401).send({ message: "Unauthorized" });
        }
    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
});

// Authentication token //need check
// const auth = async(req,res) =>{
//     const raw = String(req.headers.authorization).split(' ').pop();
//     const {id} = jwt.verify(raw,SECRET)
//     req.user = await User.findById(id)
// }

const auth = async (token) => {
    try {
        const { id } = jwt.verify(token, SECRET);
        let user = User.findById(id);
        if (user == null) {
            return false;
        } else {
            return user;
        }
    } catch (error) {
        return false;
    }
};

router.get("/api/profile", auth, async (req, res) => {
    res.send(req.user);
});

module.exports = router;
