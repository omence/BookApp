'use strict';

const express = require('express');
const ejs = require('ejs');
const superagent = require('superagent');
const app = express();
const cors = require('cors');
const pg = require('pg');
const PORT = process.env.PORT || 3000;
require('dotenv').config();

app.use(cors());
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', error => console.log(error));
client.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.post('/search', (request, response) => {

});












app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
  });