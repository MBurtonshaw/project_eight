'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  };
  //initializing a Book model w title, author, genre, & year attributes
  //title & author have validators in place & custom error messages
  Book.init({
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Please enter a book title'
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: ' Please enter an author name'
        }
      }
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};