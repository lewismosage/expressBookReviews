// router/general.js
const express = require('express');
let books = require("./booksdb.js"); // Preloaded book data
const public_users = express.Router();
const regd_users = express.Router(); // Define regd_users

// Get the list of all books
public_users.get('/', function (req, res) {
   res.status(200).json(books);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const filteredBooks = Object.values(books).filter(book => book.author === author);

  if (filteredBooks.length > 0) {
     res.status(200).json(filteredBooks);
  } else {
     res.status(404).json({ message: "No books found by this author" });
  }
});

// Get book details based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const filteredBooks = Object.values(books).filter(book => book.title === title);

  if (filteredBooks.length > 0) {
     res.status(200).json(filteredBooks);
  } else {
     res.status(404).json({ message: "No books found with this title" });
  }
});

// Get book reviews by ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.reviews) {
     res.status(200).json(book.reviews);
  } else {
     res.status(404).json({ message: "No reviews found for this book" });
  }
});

// Get the list of all books using async/await
public_users.get('/', async (req, res) => {
   try {
     const response = await axios.get('http://localhost:5000/books');
     res.status(200).json(response.data);
   } catch (error) {
     res.status(500).json({ message: "Error fetching books", error });
   }
 });

// Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
   const { isbn } = req.params;
   try {
     const response = await axios.get(`http://localhost:5000/books/${isbn}`);
     res.status(200).json(response.data);
   } catch (error) {
     res.status(404).json({ message: "Book not found", error });
   }
 });

// Get book details based on author using async/await
public_users.get('/author/:author', async (req, res) => {
   const { author } = req.params;
   try {
     const response = await axios.get(`http://localhost:5000/books/author/${author}`);
     res.status(200).json(response.data);
   } catch (error) {
     res.status(404).json({ message: "No books found by this author", error });
   }
 });

// Get book details based on title using async/await
public_users.get('/title/:title', async (req, res) => {
   const { title } = req.params;
   try {
     const response = await axios.get(`http://localhost:5000/books/title/${title}`);
     res.status(200).json(response.data);
   } catch (error) {
     res.status(404).json({ message: "No books found with this title", error });
   }
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

module.exports.general = public_users;
