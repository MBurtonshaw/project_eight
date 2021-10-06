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
  let books = await Book.findAll();
  res.render( 'index', { books, title: 'Library Database' });
}));

router.post( '/', asyncHandler( async( req, res, next ) => {
  let book = await Book.create(req.body);
  res.redirect( '/books/' + book.id );
}));

router.get( '/page-not-found', asyncHandler( async( req, res, next ) => {
  res.render( 'page-not-found' );
}));

router.get( '/new', asyncHandler( async( req, res, next ) => {
  res.render( 'new-book', {book: {}, title: 'New Book'});
}));

router.get( '/:id', asyncHandler( async( req, res, next ) => {
  const book = await Book.findByPk(req.params.id);
  res.render( 'update-book', { book, title: 'Update Book' } );
}));

router.post( '/:id', asyncHandler( async( req, res, next )=>{
  let book = await Book.findByPk(req.params.id);
  await book.update(req.body);
  res.redirect('/books');
}));

router.get( '/:id/delete', asyncHandler( async( req, res, next )=>{
  let book = await Book.findByPk(req.params.id);
  res.render( 'delete-book', { book, title: 'Delete book' });
}));

router.post( '/:id/delete', asyncHandler( async( req, res, next )=>{
  let book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect('/books');
}));

module.exports = router;
