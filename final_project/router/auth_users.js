const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  //write code to check if username is valid
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return users.some(user => user.username === username && user.password === password);
}

regd_users.delete("/auth/review/:isbn", (req, res) => {

  //Write your code here
  let book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (!req.user || !req.user.username) {
    return res.status(403).json({ message: "User not authenticated" });
  }
  if (!book.reviews[req.user.username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }
  delete book.reviews[req.user.username];
  return res.status(200).json({ message: "Review deleted successfully", book });
});

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  // Generate JWT token
  const accessToken = jwt.sign({ username, password }, "fingerprint_customer");
  req.session.authorization = { accessToken };
  return res.status(200).json({ message: "User logged in successfully"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  const { review } = req.body;
  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }
  book.reviews[req.user.username] = review;
  return res.status(200).json({ message: "Review added successfully", book });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
