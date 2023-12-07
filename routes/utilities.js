require('dotenv').config();
const SECRET = process.env.JWT_SECRET;

const express = require('express');
const jwt = require('jsonwebtoken')
const assert = require('http-assert');//for debug
const router = express.Router();

//import model
const { User } = require('../model/index');
const { Cart } = require('../model/index');
const { BookList } = require('../model/index');


const auth = async(req,res,next) =>{
    const raw = req.headers.authorization;
    // const raw = String(req.headers.authorization).split(' ').pop();

    const {id} = jwt.verify(raw,SECRET)
    let user = await User.findOne({_id:new ObjectId(id)});
    if(user==null){
        return res.status(401).send({ message: "Unauthorized" });
    }
    else{
        req.userid = id
        next();
    }
}