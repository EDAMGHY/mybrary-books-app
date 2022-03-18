const Book = require('../models/Book');
const Author = require('../models/Author');
const fs = require('fs');
const path = require('path');
const uploadPath = path.join('public', Book.coverImageBasePath);

// get all books view
const allBooks = async (req, res) => {
  let query = Book.find();
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'));
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter);
  }
  try {
    const books = await query.exec();
    res.render('books/index', {
      books,
      searchOptions: req.query,
    });
  } catch (err) {
    res.redirect('/');
  }
};
// get new book view
const newBook = async (req, res) => {
  renderNewPage(res, new Book());
};
// create new book
const createBook = async (req, res) => {
  const { title, author, description, publishDate, pageCount } = req.body;
  const fileName = req.file != null ? req.file.filename : null;
  const book = new Book({
    title,
    description,
    author,
    pageCount,
    coverImageName: fileName,
    publishDate: new Date(publishDate),
  });
  try {
    const newBook = await book.save();
    // res.render(`books/${newBook.id}`, {});
    res.redirect(`/books`);
  } catch (err) {
    if (book.coverImageName != null) {
      removeBookCover(book.coverImageName);
    }
    console.log(err.message);

    renderNewPage(res, new Book(), true);
  }
};

const renderNewPage = async (res, book, hasError = false) => {
  try {
    const authors = await Author.find();
    const params = { book, authors };
    if (hasError) params.errMessage = 'Error Creating Book';
    res.render('books/new', params);
  } catch (err) {
    res.redirect('/books');
  }
};
const removeBookCover = (fileName) => {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.error(err);
  });
};
module.exports = { allBooks, newBook, createBook };
