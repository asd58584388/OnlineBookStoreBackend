require('dotenv').config();
const SECRET = process.env.JWT_SECRET;

const express = require('express');
const jwt = require('jsonwebtoken')
const assert = require('http-assert');//for debug
const router = express.Router();

const { BookReview } = require('../model/index');
const { User } = require('../model/index');

router.post('/', async (req, res) => {
    console.log('req.body', req.body);
    const reviews= await BookReview.find({bookId:req.body.bookId});
    // console.log(reviews);
    res.send(reviews);
})


router.post('/add', async (req, res) => {
    console.log('req.body', req.body);

    console.log('req.headers', req.headers.authorization);
    const { bookId, rating, reviewText, reviewTitle } = req.body;

    const userid = jwt.verify(req.headers.authorization, SECRET).id;
    const username = await User.findOne({ _id: userid })
    console.log('username', username);

    try {
        const review = await BookReview.create({
            bookId: bookId,
            reviewTitle: reviewTitle,
            rating: rating,
            reviewerID: userid,
            reviewText: reviewText,
            reviewerName: username.username,
            createdAt:Date.now()
        });

        res.send({message:'Successfully add review',review:{
            bookId: bookId,
            reviewTitle: reviewTitle,
            rating: rating,
            reviewerID: userid,
            reviewText: reviewText,
            reviewerName: username.username,
            createdAt:review.createdAt
        }});
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;