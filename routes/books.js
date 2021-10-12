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
      res.render('error', { error });
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
  try{
      book = await Book.create(req.body);
      console.log(book.title + ' by ' + book.author + ' has been added to the database');
      res.redirect( '/books' );
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        book = await Book.build(req.body);
        const errors = error.errors.map(err=>err.message);
        res.render('error', {errors});
      } else {
        throw error;
      }
    }
}));

router.get( '/:id', asyncHandler( async( req, res, next ) => {
  let book;
  book = await Book.findByPk(req.params.id);
  if ( book ) {
    const book = await Book.findByPk(req.params.id);
    res.render( 'update-book', { book, title: book.title } );
  } else {
    next();
  }

}));

router.post( '/:id', asyncHandler( async( req, res, next )=>{
  let book;
    book = await Book.findByPk(req.params.id);
    if (book) {
    await book.update(req.body);
    console.log(book.title + ' by ' + book.author + ' has been updated');
    res.redirect('/books');
    } else {
      next();
    }
}));

router.get( '/:id/delete', asyncHandler(async(req, res) => {
  let book;
  book = await Book.findByPk(req.params.id);
  if (book) {
    res.render( 'delete-book', { book, title: 'Delete Book' });
  } else {
    next();
  }
}));

router.post( '/:id/delete', asyncHandler( async( req, res, next )=>{
  let book;
  book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    console.log(book.title + ' by ' + book.author + ' has been deleted');
    res.redirect('/books');
  } else {
    next();
  }
}));

router.get( '/page-not-found', asyncHandler( async( req, res, next ) => {
  res.render( 'page-not-found' );
}));

router.get( '/error', asyncHandler( async( req, res, next ) => {
  res.render( 'error' );
}));

module.exports = router;
