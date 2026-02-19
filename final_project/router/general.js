const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    if (isValid(username)) {
      users.push({ username, password });
      return res.status(201).json({ message: "User registered successfully" });
    }
    return res.status(400).json({ message: "Username already exists" });
  } catch (error) {
    return res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

// Get the book list available in the shop using Promise
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        resolve(books);
      });
    };
    const bookList = await getBooks();
    return res.status(200).json({ books: bookList });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Get book details based on ISBN using Promise
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
          resolve(book);
        } else {
          reject(new Error("Book not found"));
        }
      });
    };
    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get book details based on author using Promise
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        const bookList = Object.values(books);
        const filteredBooks = bookList.filter(book => book.author.toLowerCase() === author.toLowerCase());
        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject(new Error("No books found for the given author"));
        }
      });
    };
    const filteredBooks = await getBooksByAuthor(author);
    return res.status(200).json(filteredBooks);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get all books based on title using Promise
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const getBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        const bookList = Object.values(books);
        const filteredBooks = bookList.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject(new Error("No books found for the given title"));
        }
      });
    };
    const filteredBooks = await getBooksByTitle(title);
    return res.status(200).json(filteredBooks);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

//  Get book review using Promise
public_users.get('/review/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const getBookReview = (isbn) => {
      return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
          resolve(book.reviews);
        } else {
          reject(new Error("Book not found"));
        }
      });
    };
    const reviews = await getBookReview(isbn);
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

module.exports.general = public_users;
