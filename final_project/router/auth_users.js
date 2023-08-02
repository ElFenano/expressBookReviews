const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: "user1", password: "pass1" },
  { username: "user2", password: "pass2" },
  { username: "user3", password: "pass3" }
];

const isValid = (username) => {
  let validusers = users.filter((user) => {
    return (user.username === username)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send({ message: "User successfully logged in" });
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;

  // Find the book with the given ISBN
  const book = books.filter((book) => book.isbn === isbn);

  // If the book exists, add the review to its reviews array
  if (book.length > 0) {
    const reviewObj = { review };
    if (!book.reviews) {
      book.reviews = [];
    }
    book.reviews.push(reviewObj);
    return res.status(200).json({ message: "Review added successfully" });
  } else {
    return res.status(400).json({ message: "Invalid ISBN" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;

  // Find the book with the given ISBN
  const book = books.filter((book) => book.isbn === isbn);

  // If the book exists, add the review to its reviews array
  if (book.length > 0) {
    const reviewObj = { review };
    if (!book.reviews) {
      book.reviews = [];
    }
    book.reviews.pop(reviewObj);
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(400).json({ message: "Invalid ISBN" });
  }
});

module.exports = {
  authenticatedUser
};

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
