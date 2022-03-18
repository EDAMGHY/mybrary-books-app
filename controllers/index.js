const Book = require('../models/Book');

const index = async (req, res) => {
  let books;
  try {
    books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec();
  } catch (err) {
    books = [];
  }
  res.render('index', { books });
};
module.exports = { index };
