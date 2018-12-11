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

function Book(data) {
this.selfLink = data.selfLink;
this.title = data.volumeInfo.title;
this.authors = data.volumeInfo.authors;
};


//const client = new pg.Client(process.env.DATABASE_URL);
// client.on('error', error => console.log(error));
// client.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.post('/search', (request, response) => {
  console.log('my request: ', request.body);
  let answers = request.body;
  console.log(answers);
  Book.fetch(answers);
  // response.sendfile('../views/pages/seaches/show.ejs', {root: './public'});
});

Book.fetch = function(input) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${input.title},${input.author}`;
 
  return superagent.get(url).then(result => {
    const bookSum = result.body.items.map(data => {
      const newBook = new Book(data);
      console.log('newBook', newBook);
      return newBook;

});
    return bookSum;
});
}



app.get ('/', (request, response) => {
  response.render('../views/pages/index');
});











app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
  });