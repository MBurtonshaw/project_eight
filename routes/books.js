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

/* Routing */
router.get( '/', asyncHandler( async( req, res, next ) => {
  //books are stored to a variable which is then rendered with the index page
  let books;
  books = await Book.findAll();
  res.render( 'index', { books, title: 'Library Database' });
}));

router.post( '/', asyncHandler(async(req, res, next) => {
  //redirects to the 'update-book' page of whichever book's id is submitted in searchbar
  res.redirect( '/books/' + req.body.search_bar );
}));

router.get( '/new', asyncHandler( async( req, res, next ) => {
  //renders the new-book page with an empty book object
  res.render( 'new-book', {book: {}, title: 'New Book'});
}));

router.post( '/new', asyncHandler( async( req, res, next ) => {
  let book;
  //new book entry is stored to a variable and submitted; user is redirected to home page
  try{
      book = await Book.create(req.body);
      console.log(book.title + ' by ' + book.author + ' has been added to the database');
      res.redirect( '/books' );
    } catch (error) {
      //catching validation errors; if they exist, current book entry creation is stalled,
      //and the page is rendered with the error message(s)
      if (error.name === 'SequelizeValidationError') {
        book = await Book.build(req.body);
        res.render('new-book', { book, errors: error.errors, title: 'New Book' });
      } else {
        //else, throw to global handler in app.js
        throw error;
      }
    }
}));

router.get( '/:id', asyncHandler( async( req, res, next ) => {
  let book;
  //book is selected & stored to a variable based on the id property in the url
  book = await Book.findByPk(req.params.id);
  if ( book ) {
    //renders update-book page with specific entry based on id
    const book = await Book.findByPk(req.params.id);
    res.render( 'update-book', { book, title: book.title } );
  } else {
    next();
  }

}));

router.post( '/:id', asyncHandler( async( req, res, next )=>{
  let book;
    book = await Book.findByPk(req.params.id);
    try{
      //method to update an entry's data, then user is redirected to homepage
    await book.update(req.body);
    console.log(book.title + ' by ' + book.author + ' has been updated');
    res.redirect('/books');
    } catch (error) {
      //catching validation errors; if they exist, current book entry creation is stalled,
      //and the page is rendered with the error message(s)
      if (error.name === 'SequelizeValidationError') {
        await Book.build(req.body);
        res.render('update-book', { book, errors: error.errors, title: 'Update Book' });
      } else {
        //else, throw to global handler in app.js
        throw error;
      }
    }
}));

router.get( '/:id/delete', asyncHandler(async(req, res) => {
  let book;
  book = await Book.findByPk(req.params.id);
  if (book) {
    //rendering delete-book page with the corresponding book entry based on id
    res.render( 'delete-book', { book, title: 'Delete Book' });
  } else {
    next();
  }
}));

router.post( '/:id/delete', asyncHandler( async( req, res, next )=>{
  let book;
  book = await Book.findByPk(req.params.id);
  if (book) {
    //deleted selected book entry, then redirecting to homepage
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
