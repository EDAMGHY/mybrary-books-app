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
    res.redirect(`books/${newBook.id}`);
  } catch (err) {
    console.log(err.message);

    renderNewPage(res, new Book(), true);
  }
};
// show single route
const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('author').exec();
    res.render('books/show', { book });
  } catch (err) {
    res.redirect('/');
  }
};

const editBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    renderEditPage(res, book);
  } catch (err) {
    res.redirect('/');
  }
};
const updateBook = async (req, res) => {
  const { title, author, description, publishDate, pageCount } = req.body;
  const { id } = req.params;
  let book;
  try {
    book = await Book.findById(id);
    book.title = title;
    book.author = author;
    book.publishDate = new Date(publishDate);
    book.description = description;
    book.pageCount = pageCount;
    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(book, req.body.cover);
    }
    await book.save();
    res.redirect(`/books/${book.id}`);
  } catch (err) {
    console.log(err.message);
    if (book != null) {
      renderEditPage(res, book, true);
    } else {
      res.redirect('/');
    }
  }
};
// delete book page
const deleteBook = async (req, res) => {
  let book;
  const { id } = req.params;

  try {
    book = await Book.findById(id);
    await book.remove();
    res.redirect('/books');
  } catch (err) {
    if (book != null) {
      res.render('books/show', { book, errMessage: 'Could not remove Book' });
    }
  }
};

// utils
const renderNewPage = async (res, book, hasError = false) => {
  renderFormPage(res, book, 'new', hasError);
};

const renderEditPage = async (res, book, hasError = false) => {
  renderFormPage(res, book, 'edit', hasError);
};

const renderFormPage = async (res, book, form, hasError = false) => {
  try {
    const authors = await Author.find();
    const params = { book, authors };
    if (hasError) {
      if (form === 'edit') {
        params.errMessage = 'Error Updating Book';
      } else {
        params.errMessage = 'Error Creating Book';
      }
    }
    res.render(`books/${form}`, params);
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
module.exports = {
  allBooks,
  newBook,
  createBook,
  getBook,
  editBook,
  updateBook,
  deleteBook,
};
