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


const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', error => console.error(error));
client.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.set('view engine', 'ejs');


// app.get('/', (req, res) => {
//   res.render('../views/pages/index');
// });


app.get('/new', (req, res) => {
  res.render('../views/pages/searches/new');
});

app.get('/', getSavedBooks);

app.post('/show', getResults);

function Book(data) {
  this.selfLink = data.selfLink;
  if(data.volumeInfo.author){
    this.author = data.volumeInfo.authors;
  } else {
    this.author = 'No Author';
  }
  this.title = data.volumeInfo.title;
  if (data.volumeInfo.imageLinks){
    this.img_url = data.volumeInfo.imageLinks.thumbnail;
  } else {
    this.img_url = 'https://via.placeholder.com/150'
  }
  this.description = data.volumeInfo.description;
  this.ISBN = data.volumeInfo.industryIdentifiers.identifier[1];
}

function getSavedBooks(request, response){
  let SQL = 'SELECT * FROM books;';
  console.log('this function is running');
  return client.query(SQL)
    .then( results => {
      console.log('results!!', results);
      response.render('../views/pages/index', { volumes: results.rows })
    })
    .catch(err => console.error(err));
}
function getResults(request, response) {
  console.log('my request body:', request.body);
  // response.sendfile('../views/pages/searches/show', {root: './public'});
  let input = request.body;
  fetchData(input)
    .then(result => {
      console.log(result);
      response.render('pages/searches/show', {renderedBooks: result,})
    });

}

let fetchData = (input =>{
  console.log('fetch is running');
  let query = input.bookSearch;
  let searchType = input.search;
  console.log( 'query and searchType', query, searchType);

  let titleUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}:intitle=${query}`;
  let authorUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}:inauthor=${query}`;
  let URL = '';
  console.log('ourURLs', titleUrl, authorUrl);
  if (searchType === 'author'){
    URL = authorUrl;
  } else if (searchType = 'title'){
    URL = titleUrl;
  }
  console.log('ifElse ran');

  return superagent.get(URL).then(result => {
    console.log('running');
    const allBooks = result.body.items.map(info => {
      const newBook = new Book(info);
      console.log('newBook', newBook);
      return newBook;
    });
    console.log('allBooks', allBooks);
    // renderBooks(allBooks);
    // console.log(response);
    // response.render('show', {newBook, allBooks,});
    return allBooks;
  });
});


// app.get('/seach', (request, response)=>{
//   response.render('show', {newBook: })
// })

// function renderBooks(books){
//   console.log('renderBooks');
//   response.render('show', {newBook: books,});
// };

//get detailed view
function getDetails(request, response) {
  let SQL = 'SELECT * FROM books WHERE id=$;';
  let values = [request.params.book_id];

  return client.query(SQL, values)
  .then(result => {
    return response.render('pages/detail', {book: result.row[0]});
  })
}
app.get('../views/pages/searches/show');

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
  });