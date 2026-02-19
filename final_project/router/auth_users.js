const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  const userExists = users.some(user => user.username === username);
  return !userExists;
}

const authenticatedUser = (username, password) => { //returns boolean
  if (!username || !password) {
    return false;
  }
  const user = users.find(user => user.username === username && user.password === password);
  return !!user; // returns true if user is found, otherwise false
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, 'secretKey', { expiresIn: '1h' });
    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const { review } = req.body;

  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  if (books[isbn]) {
    const username = req.user.username;
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added/updated successfully", "book": books[isbn] });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    const username = req.user.username;
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username]; 
      return res.status(200).json({ message: "Review deleted successfully", "book": books[isbn] });
    } else {
      return res.status(404).json({ message: "Review not found for the user" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
}
);
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
