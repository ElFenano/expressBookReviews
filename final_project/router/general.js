const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Book list successfully retrieved");
  }, 1000)
});

public_users.post("/register", (req, res) => {
  username = req.body.username;
  password = req.body.password;
  if (isValid(username)) {
    return res.status(208).json({ message: "Username already exists" });
  } else {
    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered" });
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  promise.then((message) => {
    return res.status(200).json({ "Books": books, message: message });
  });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  isbn = req.params.isbn;
  let book = books.filter((book) => {
    return (book.isbn === isbn)
  });
  promise.then((message) => {
    if (book.length > 0) {
      return res.status(200).json({ "Book found": {title: book[0].title, author: book[0].author, reviews: book[0].reviews}, message: message });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  author = req.params.author;
  let book = books.filter((book) => {
    return (book.author === author)
  });
  promise.then((message) => {
    if (book.length > 0) {
      return res.status(200).json({ "Book found": {title: book[0].title, isbn: book[0].isbn, reviews: book[0].reviews}, message: message });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  title = req.params.title;
  let book = books.filter((book) => {
    return (book.title === title)
  });
  promise.then((message) => {
    if (book.length > 0) {
      return res.status(200).json({ "Book found": {author: book[0].author, isbn: book[0].isbn, reviews: book[0].reviews}, message: message });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  isbn = req.params.isbn;
  let book = books.filter((book) => {
    return (book.isbn === isbn)
  });
  if (book.length > 0) {
    return res.status(200).json({ "Book found": {reviews: book[0].reviews} });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
