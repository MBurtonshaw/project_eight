var express = require( 'express' );
var router = express.Router();
var Book = require( '../models' ).Book;

/* Handler function to wrap each route. */
function asyncHandler( cb ){
  return async( req, res, next ) => {
    try {
      await cb( req, res, next )
    } catch( error ){
      // Forward error to the global error handler
      next( error );
    }
  }
}

/* GET users listing. */
router.get( '/', asyncHandler( async( req, res, next ) => {
  let books;
  books = await Book.findAll();
  res.render( 'index', { books, title: 'Library Database' });
}));

router.post( '/', asyncHandler(async(req, res, next) => {
  res.redirect( '/books/' + req.body.search_bar );
}));

router.get( '/new', asyncHandler( async( req, res, next ) => {
  res.render( 'new-book', {book: {}, title: 'New Book'});
}));

router.post( '/new', asyncHandler( async( req, res, next ) => {
  let book;
  try {
  book = await Book.create(req.body);
  console.log(book.title + ' by ' + book.author + ' has been added to the database');
  res.redirect( '/books' );
  } catch(err) {
    if(err.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render('/books/new', { book, errors: error.errors, title: 'New Article' });
    } else {
      throw error;
    }
  }
}));

router.get( '/:id', asyncHandler( async( req, res, next ) => {
  let book;
  book = await Book.findByPk(req.params.id);
  if (book) {
      res.render( 'solo', { book, title: book.title } );
  } else {
    res.status(404).render('page-not-found');
  }
}));

router.post( '/:id', asyncHandler( async( req, res, next )=>{
  let book;
    book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    console.log(book.title + ' by ' + book.author + ' has been updated');
    res.redirect('/books');
}));

router.get( '/:id/delete', asyncHandler(async(req, res) => {
  let book;
  book = await Book.findByPk(req.params.id);
  if (book) {
    res.render( 'delete-book', { book, title: 'Delete Book' });
  } else {
    res.status(404).render('page-not-found');
  }
}));

router.post( '/:id/delete', asyncHandler( async( req, res, next )=>{
  let book;
  book = await Book.findByPk(req.params.id);
    await book.destroy();
    console.log(book.title + ' by ' + book.author + ' has been deleted');
    res.redirect('/books');
}));

router.get( '/page-not-found', asyncHandler( async( req, res, next ) => {
  res.render( 'page-not-found' );
}));

module.exports = router;
