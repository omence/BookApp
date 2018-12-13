'use strict';

const express = require('express');
const ejs = require('ejs');
const superagent = require('superagent');
const cors = require('cors');
const pg = require('pg');
const methodOverride = require('method-override');
const app = express();


app.use(cors());

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.use(methodOverride((request, response) => {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}));

require('dotenv').config();

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', error => console.error(error));
client.connect();


app.set('view engine', 'ejs');


// app.get('/', (req, res) => {
//   res.render('../views/pages/index');
// });


app.get('/new', (req, res) => {
  res.render('../views/pages/searches/new');
});

app.get('/', getSavedBooks);

app.get('/:id', getDetails);

app.post('/show', getResults);

app.post('/save', addBook);

app.put('/update', updateBook);

app.delete('/delete', deleteBook);

function Book(data) {
  this.selfLink = data.selfLink;
  if(data.volumeInfo.authors){
    this.author = data.volumeInfo.authors;
  } else {
    this.author = 'No Author';
  }
  this.title = data.volumeInfo.title;
  if (data.volumeInfo.imageLinks){
    this.image_url = data.volumeInfo.imageLinks.thumbnail;
  } else {
    this.image_url = 'https://via.placeholder.com/150';
  }
  this.description = data.volumeInfo.description;
  this.isbn = data.volumeInfo.industryIdentifiers[0].identifier;
}

function getSavedBooks(request, response){
  let SQL = 'SELECT * FROM books;';

  return client.query(SQL)
    .then( results => {
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
      response.render('pages/searches/show', {renderedBooks: result,});
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
      return newBook;
    });
 
    return allBooks;
  });
});


//get detailed view
function getDetails(request, response) {
  console.log('running getDetails');
  let SQL = 'SELECT * FROM books WHERE id=$1;';
  let values = [request.params.id];

  return client.query(SQL, values)
  .then(result => {

    response.render('../views/pages/books/detail', {book: result.rows[0]});
  });
}
app.get('../views/pages/searches/show');
app.get('../views/pages/searches/save');
app.get('../views/pages/searches/update');
app.get('../views/pages/searches/delete');


function addBook(request, response) {
  console.log('addBook running');
  let {title, author, isbn, image_url, description} = request.body;
  let SQL = `INSERT INTO books(title, author, isbn, image_url, description) VALUES ($1, $2, $3, $4, $5);`;
  let values = [title, author, isbn, image_url, description];

  return client.query(SQL, values)
    .then(response.redirect('/'))
    .catch(err => console.error(err));
}

function updateBook(request, response){
  let {title, author, isbn, image_url, description} = request.body;
  let SQL =`UPDATE books SET title = $1, author = $2, isbn = $3, image_url = $4, description = $5 WHERE id = $6;`;
  let values = [title, author, isbn, image_url, description, request.params.id];
  client.query(SQL, values)
    .then(response.redirect(`/:id${request.params.id}`));

};

function deleteBook(request, response){
  let {title, author, isbn, image_url, description} = request.body;
  let SQL =`DELETE FROM books SET title = $1, author = $2, isbn = $3, image_url = $4 description = $ 5 WHERE id = $6;`;
  let values = [title, author, isbn, image_url, description, request.params.id];
  client.query(SQL, values)
    .then(response.redirect('/'));
};



app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});