const Book = require('../models/Book');
const Author = require('../models/Author');
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'images/gif'];

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
  const book = new Book({
    title,
    description,
    author,
    pageCount,
    publishDate: new Date(publishDate),
  });
  saveCover(book, req.body.cover);
  try {
    const newBook = await book.save();
    // res.render(`books/${newBook.id}`, {});
    res.redirect(`/books`);
  } catch (err) {
    console.log(err.message);

    renderNewPage(res, new Book(), true);
  }
};

// utils
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

const saveCover = (book, coverEncoded) => {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64');
    book.coverImageType = cover.type;
  }
};
module.exports = { allBooks, newBook, createBook };
