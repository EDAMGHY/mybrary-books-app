const Author = require('../models/Author');

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
    // res.render(`authors/${newAuthor.id}`, {});
    res.redirect(`/authors`);
  } catch (err) {
    res.render('authors/new', {
      author,
      errMessage: 'Error Creating Author...',
    });
  }
};

module.exports = { allAuthors, newAuthor, createAuthor };
