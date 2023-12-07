//require('dotenv').config();

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

//import model
const { Cart ,User,Order} = require("../model/index");
const { ObjectId } = require("mongodb");



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


// API : Get User Shopping List
router.get("/", async (req, res) => {
    let userId = jwt.verify(req.headers.authorization, SECRET);
    const cart = await Cart.findOne({ userid: userId.id });

    if (!cart) {
        return res.status(404).json({ message: "User Shopping Cart not found" });
    }
    else{
        return res
            .status(200)
            .send({ message: "User Shopping Cart not found", cart: cart.items });
    }
});

// API : add to shopping cart
router.post("/", async (req, res) => {
    try {
        const { id, title, authors, thumbnail, smallThumbnail, price } =
        req.body.book;
        
        const token = req.body.token;
        let userid = jwt.verify(token, SECRET);
        let cart = await Cart.findOne({ userid: userid.id });
        
        // console.log('cart',cart);
        // if (!cart) {
        //     const newCart = await Cart.create({
        //         userid: userid,
        //         items: [],
        //     });
        //     await newCart.save();
        //     cart = newCart;
        // }

        //TODO: check
        let item = cart.items.find((item) => item.bookid === id);
        if (item !== undefined) {
            item.quantity += 1;
        } else {
            cart.items.push({
                bookid: id,
                booktitle: title,
                authors: authors,
                thumbnail: thumbnail,
                smallThumbnail: smallThumbnail,
                price: price,
                quantity: 1,
            });
        }
        
        // TODO: check
        await cart.save();


        // console.log('cart1',cart);
        res.status(200).json({ message: "New item added.", cart: cart });

    } catch (error) {
        res.status(500).json({
            message: "Error adding item to cart",
            error: error,
        });
    }
});




// API : delete item in the cart
router.delete("/", async (req, res) => {
    try {
        const { bookId} = req.body;
        
        let userId = jwt.verify(req.headers.authorization, SECRET);
        const cart = await Cart.findOne({ userid: userId.id });
        
        cart.items = cart.items.filter((item) => 
        {
            if(item.bookid !== bookId){
                return true;
            }
            else{
                if(item.quantity > 1){
                    item.quantity -= 1;
                    return true;
                }
                else{
                    return false;
                }
            }

        });
        
    
        await cart.save();
        res.status(200).json({ message: "Book deleted successfully" });

        // if (!deletedItem) {
        //     return res.status(404).json({ message: "Book not found" });
        // }
    } catch (error) {
        res.status(500).json({
            message: "Error deleting item from cart",
            error: error,
        });
    }
});

router.post("/checkout",auth, async (req, res) => {
    try {
        console.log("reqBody",req.body);


        const userid = req.userid;
        
        console.log('userid',userid);
        let cart = await Cart.findOne({ userid: userid });
        let cartItems=cart.items.map((item)=>{
            return {
                bookId:item.bookid,
                bookTitle:item.booktitle,
                quantity:item.quantity,
                price:item.price
            }
        });
        console.log('cart',cart);
        console.log("cartItems",cartItems);



        if (!cart) {
            return res.status(404).json({ message: "User Shopping Cart not found" });
        }
        else{
            cart.items = [];
            await cart.save();
            console.log('cart save',cart); 
            let order= await Order.create({
                userid: userid,
                books: cartItems,
                address: req.body.address,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                totalPrice: req.body.books.reduce((acc,cur)=>acc+cur.price*cur.quantity,0),
            });
            await order.save();
            
            return res
                .status(200)
                .send({ message: "Checkout Success" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error checking out",
            error: error,
        });
    }
});

// // API : update when item num = 0
// router.post("/calcluatePrice", function (req, res) {
// })
module.exports = router;
