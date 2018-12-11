'use strict';

const express = require('express');
const ejs = require('ejs');
const superagent = require('superagent');
const cors = require('cors');
const pg = require('pg');
require('dotenv').config();
const app = express();


app.use(cors());

const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs');


//const client = new pg.Client(process.env.DATABASE_URL);
// client.on('error', error => console.log(error));
// client.connect();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));



app.get('../views/pages/searches/show', getBooks);

function getBooks(request, response){
  const bookHandler = {
    query: request.query.data,
  };
  getBooks.lookup(bookHandler);
}

function Books(query, data) {
  this.search_query = query;
  this.author = data.volumeInfo.authors;
  this.title = data.volumeInfo.title;
  this.selfLink = data.selfLink;
}

Books.fetchBooks = query => {
  const _URL = `https://www.googleapis.com/books/v1/volumes?q=${query}:inauthor${query}`;
  const values = [handler.query];

  return superagent.get(_URL).then(data => {
    console.log('got data from API');
    const allBooks = data.body.results.map( thing => {
      const books = new Books();
    console.log('books', books);
    return books;
    });
    return allBooks;
  });
};

app.get('/', (req, res) => {
  res.render('../views/pages/index');
});

Books.lookup= handler => {
  Books.fetchBooks(request.query.data).then(data => {
    response.send(data);
  });
};












app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
  });