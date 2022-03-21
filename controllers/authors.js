const Author = require('../models/Author');
const Book = require('../models/Book');

// get all authors view
const allAuthors = async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name != '') {
    searchOptions.name = new RegExp(req.query.name, 'i');
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render('authors/index', {
      authors,
      searchOptions: req.query,
    });
  } catch (err) {
    res.redirect('/');
  }
};
// get new author view
const newAuthor = (req, res) => {
  res.render('authors/new', {
    author: new Author(),
  });
};

// create new author
const createAuthor = async (req, res) => {
  const { name } = req.body;
  const author = new Author({ name });
  try {
    const newAuthor = await author.save();
    res.redirect(`authors/${newAuthor.id}`);
  } catch (err) {
    res.render('authors/new', {
      author,
      errMessage: 'Error Creating Author...',
    });
  }
};

const getAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const booksByAuthor = await Book.find({ author: author.id })
      .limit(6)
      .exec();
    res.render('authors/show', {
      booksByAuthor,
      author,
    });
  } catch (err) {
    res.redirect('/');
  }
};
const editAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const author = await Author.findById(id);
    res.render('authors/edit', {
      author,
    });
  } catch (err) {
    res.redirect('/authors');
  }
};
const updateAuthor = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  let author;
  try {
    author = await Author.findById(id);
    author.name = name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch (err) {
    if (author == null) {
      res.redirect('/');
    } else {
      res.render('authors/new', {
        author,
        errMessage: 'Error Updating  Author...',
      });
    }
  }
};
const deleteAuthor = async (req, res) => {
  const { id } = req.params;
  let author;
  try {
    author = await Author.findById(id);
    await author.remove();
    res.redirect(`/authors`);
  } catch (err) {
    if (author == null) {
      res.redirect('/');
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
};

module.exports = {
  updateAuthor,
  editAuthor,
  allAuthors,
  newAuthor,
  createAuthor,
  getAuthor,
  deleteAuthor,
};
