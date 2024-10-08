/*const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Register a new user
regd_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
     return res.status(400).json({ message: "Username and password are required" });
  }

  if (users[username]) {
     return res.status(409).json({ message: "Username already exists" });
  }

  users[username] = { password };
  return res.status(201).json({ message: "User registered successfully" });
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
*/

const express = require('express');
const jwt = require('jsonwebtoken');
const users = {}; // This should be your user database or data structure

const auth_users = express.Router();

// Login route
auth_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const user = users[username];

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate JWT
  const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });

  // Save token in session
  req.session.token = token;

  return res.status(200).json({ message: "Login successful", token });
});

module.exports.authenticated = auth_users;


// Add or modify a book review
auth_users.post('/auth/review/:isbn', (req, res) => {
  const { review } = req.body;
  const { isbn } = req.params;
  const username = req.user.username; // Assuming user info is stored in req.user

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  let book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!book.reviews) {
    book.reviews = {};
  }

  book.reviews[username] = review;

  return res.status(200).json({ message: "Review added/modified successfully", reviews: book.reviews });
});


// Delete a book review
auth_users.delete('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const username = req.user.username; // Assuming user info is stored in req.user

  let book = books[isbn];

  if (!book || !book.reviews || !book.reviews[username]) {
    return res.status(404).json({ message: "Review not found" });
  }

  delete book.reviews[username];

  return res.status(200).json({ message: "Review deleted successfully", reviews: book.reviews });
});
