const express = require('express');
const {
  allAuthors,
  newAuthor,
  createAuthor,
  getAuthor,
  editAuthor,
  updateAuthor,
  deleteAuthor,
} = require('../controllers/authors');

const router = express.Router();

router.get('/', allAuthors).post('/', createAuthor);
router.get('/new', newAuthor);
router
  .get('/:id', getAuthor)
  .put('/:id', updateAuthor)
  .delete('/:id', deleteAuthor);
router.get('/:id/edit', editAuthor);

module.exports = router;
