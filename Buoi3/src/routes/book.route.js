import express from "express";
import { books } from "../data.js";

const router = express.Router();

//API get all books
router.get("/books", (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Get all books successfully",
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
});

//API get book by id
router.get("/books/:id", (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const book = books.find((book) => book.id === bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Get book successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
});

//API create new book
router.post("/books", (req, res) => {
  try {
    const newBook = {
      id: books.length + 1,
      title: req.body.title,
      author: req.body.author,
    };
    books.push(newBook);
    res.status(201).json({
      success: true,
      message: "Create new book successfully",
      data: newBook,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
});

//API update book by id
router.patch("/books/:id", (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const book = books.find((book) => book.id === bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
        data: null,
      });
    }
    if (req.body.title) {
      book.title = req.body.title;
    }
    if (req.body.author) {
      book.author = req.body.author;
    }
    res.status(200).json({
      success: true,
      message: "Update book successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
});

//API delete book by id
router.delete("/books/:id", (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
        data: null,
      });
    }

    books.splice(bookIndex, 1);
    res.status(200).json({
      success: true,
      message: "Delete book successfully",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
});

export default router;
