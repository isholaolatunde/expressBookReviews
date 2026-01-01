const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  
  // Check if username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(400).json({message: "Username already exists"});
  }
  
  // Register the new user
  users.push({username: username, password: password});
  return res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
  try {
    // Simulate async operation - in real scenario this would be an external API call
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(books);
        }, 1000); // Simulate network delay
      });
    };
    
    const bookList = await getBooks();
    res.send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error retrieving books", error: error.message});
  }
});

// Get book details based on ISBN using async-await
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    
    // Simulate async operation - in real scenario this would be an external API call
    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const book = books[isbn];
          if (book) {
            resolve(book);
          } else {
            reject(new Error("Book not found"));
          }
        }, 1000); // Simulate network delay
      });
    };
    
    const book = await getBookByISBN(isbn);
    res.send(JSON.stringify(book, null, 4));
  } catch (error) {
    res.status(404).json({message: error.message});
  }
 });
  
// Get book details based on author using async-await
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    
    // Simulate async operation - in real scenario this would be an external API call
    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const bookKeys = Object.keys(books);
          const booksByAuthor = {};
          
          bookKeys.forEach(key => {
            if (books[key].author === author) {
              booksByAuthor[key] = books[key];
            }
          });
          
          if (Object.keys(booksByAuthor).length > 0) {
            resolve(booksByAuthor);
          } else {
            reject(new Error("No books found by this author"));
          }
        }, 1000); // Simulate network delay
      });
    };
    
    const booksByAuthor = await getBooksByAuthor(author);
    res.send(JSON.stringify(booksByAuthor, null, 4));
  } catch (error) {
    res.status(404).json({message: error.message});
  }
});

// Get all books based on title using async-await
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    
    // Simulate async operation - in real scenario this would be an external API call
    const getBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const bookKeys = Object.keys(books);
          const booksByTitle = {};
          
          bookKeys.forEach(key => {
            if (books[key].title === title) {
              booksByTitle[key] = books[key];
            }
          });
          
          if (Object.keys(booksByTitle).length > 0) {
            resolve(booksByTitle);
          } else {
            reject(new Error("No books found with this title"));
          }
        }, 1000); // Simulate network delay
      });
    };
    
    const booksByTitle = await getBooksByTitle(title);
    res.send(JSON.stringify(booksByTitle, null, 4));
  } catch (error) {
    res.status(404).json({message: error.message});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
    res.send(JSON.stringify(book.reviews, null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
