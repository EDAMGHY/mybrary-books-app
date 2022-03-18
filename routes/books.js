const express = require('express');

const multer = require('multer');

const path = require('path');
const Book = require('../models/Book');

const uploadPath = path.join('public', Book.coverImageBasePath);
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'images/gif'];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

const { allBooks, newBook, createBook } = require('../controllers/books');

const router = express.Router();

router.get('/', allBooks).post('/', upload.single('cover'), createBook);
router.get('/new', newBook);

module.exports = router;
