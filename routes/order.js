const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

//import model
const { Cart } = require("../model/index");
const { Order } = require("../model/index");

router.get("/", async (req, res) => {
});


module.exports = router;