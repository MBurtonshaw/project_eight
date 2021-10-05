var express = require('express');
var router = express.Router();
var Book = require( '../models' ).Book;

/* GET users listing. */
router.get('/', async(req, res, next) => {
  let books = await Book.findAll();
    //let books = res.json({book, title: book.title});
  console.log(books);
  res.render('index', { books, title: 'Library Database'});
});

router.get('/page-not-found', async(req, res, next) => {
  res.render('page-not-found');
});

router.get('/new-book', async(req, res, next) => {
  //let book = await Book.findByPk(req.params.id);
  res.render('new-book');
});

router.get('/update-book', async(req, res, next) => {
  res.render('update-book');
});

module.exports = router;
