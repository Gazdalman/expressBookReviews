const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  // Add new user to the users array
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });

});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const book = books[req.params.isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Not Found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  let book_list = Object.values(books).filter(
    (book) => book.author.toLowerCase() === req.params.author.toLowerCase()
  );
  return res.status(200).json(book_list);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let book = Object.values(books).filter(
    (book) => book.title.toLowerCase() === req.params.title.toLowerCase()
  )[0];
  return res.status(200).json(book);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const book = books[req.params.isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Reviews not found for this book" });
  }
});


async function getBooks() {
  try {
    const response = await axios.get('http://localhost:5000/'); // or '/books/' if mounted differently
    console.log("Books list:", response.data);
  } catch (error) {
    console.error("Error fetching books:", error.message);
  }
}

getBooks();


async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log("Book details:", response.data);
  }
  catch (error) {
    console.error("Error fetching book by ISBN:", error.message);
  }
}
getBookByISBN('1');

module.exports.general = public_users;
