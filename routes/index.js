var express = require('express');
var router = express.Router();
var Book = require( '../models' ).Book;

/* GET home page. */
router.get('/', async(req, res, next) => {
  let book = await Book.findAll();
  let books = res.json({book, title: book.title});
  console.log(books);
  //res.render('index');
});

module.exports = router;
