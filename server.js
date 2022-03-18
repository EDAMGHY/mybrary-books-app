const express = require('express');
const connectDB = require('./db');
const expressLayouts = require('express-ejs-layouts');
const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

connectDB();
// template engine ejs config
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: false }));

// images css js files
app.use(express.static('public'));

// routes
app.use(require('./routes'));
app.use('/authors', require('./routes/authors'));
app.use('/books', require('./routes/books'));

const PORT = 5000 || process.env.PORT;
app.listen(PORT, () =>
  console.log(`Server Listening on http://localhost:${PORT}...`)
);
