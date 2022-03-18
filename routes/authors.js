const express = require('express');
const {
  allAuthors,
  newAuthor,
  createAuthor,
} = require('../controllers/authors');

const router = express.Router();

router.get('/', allAuthors).post('/', createAuthor);
router.get('/new', newAuthor);

module.exports = router;
