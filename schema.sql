DROP DATABASE book_app;
CREATE DATABASE book_app;
\c book_app;

DROP TABLE IF EXISTS books;

CREATE TABLE books (
id SERIAL PRIMARY KEY,
title VARCHAR(255),
author VARCHAR(255),
isbn VARCHAR(255),
image_url VARCHAR(255),
description TEXT
);

INSERT INTO books (title, author, isbn, image_url, description) VALUES ('The Hobbit', 'J.R.R. Tolkien', '1234566', 'https://via.placeholder.com/150', 'Bilbo goes on an Adventure');