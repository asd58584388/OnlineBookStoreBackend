var createError = require('http-errors');
var express = require('express');
const https = require('https');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors =require('cors')

//var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
var cartRouter = require('./routes/cart');
var bookReviewRouter = require('./routes/bookReview');
var bookListRouter = require('./routes/bookList');
var orderRouter = require('./routes/order');

const req = require('express/lib/request');
require('./model/index');

// https.createServer(,app);

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
console.log(process.env.CORS_ORIGIN);
app.use(cors());

//app.use('/', indexRouter);
app.use('/api/users/', userRouter);
// app.use('/api/books/', userRouter);
app.use('/api/cart/', cartRouter);
app.use('/api/bookReviews/', bookReviewRouter);
app.use('/api/bookLists/',bookListRouter);
app.use('/api/orders/',orderRouter);

// get Category
app.get('/api/categories',(req,res) =>{
  res.send({
    categories:[
      'Art',
      'Bibles',
      'Biography & Autobiography',
      'Buisiness & Economics',
      'Comics & Grahphic Novels',
      'Computers',
      'Cooking',
      'Education',
      'Fiction',
      'History',
      'Law',
      'Language Arts & Disciplines',
      'Literary Collections',
      'Mathematics',
      'Medical',
      'Music',
      'Nature',
      'Science',
      'Technology & Engineering',
      'Travel',
    ]
  })
});


// const http = require('http');

// const httpApp = express();
// const HTTP_PORT = 80;

// httpApp.all('*', (req, res) => {
//   res.redirect(`https://${req.hostname}${req.url}`);
// });


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

const PORT = process.env.PORT 

app.listen(3006,() =>{
  console.log('port' ,PORT)
})

module.exports = app;
