const express = require('express');

const {
  allBooks,
  newBook,
  createBook,
  getBook,
  updateBook,
  deleteBook,
  editBook,
} = require('../controllers/books');

const router = express.Router();

router.get('/', allBooks).post('/', createBook);
router.get('/new', newBook);

router.get('/:id', getBook).put('/:id', updateBook).delete('/:id', deleteBook);
router.get('/:id/edit', editBook);

module.exports = router;
