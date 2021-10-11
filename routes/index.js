var express = require('express');
var router = express.Router();
var Book = require( '../models' ).Book;

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/books');
});

router.get( '/page-not-found', async( req, res, next ) => {
  res.render( 'page-not-found' );
});

router.get( '/error', async( req, res, next ) => {
  res.render( 'error' );
});

module.exports = router;