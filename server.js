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

app.post('/search', (request, response) => {
  console.log('my request: ', request.body);
  response.sendfile('../views/pages/seaches/show.ejs', {root: './public'});
});

app.get ('/', (request, response) => {
  response.render('../views/pages/index');
});











app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
  });