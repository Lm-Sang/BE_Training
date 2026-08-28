import { bookService } from "../services/book.service.js";
import { HttpResponse } from "../utils/success.helper.js";

export const bookController = {
  async getAll(req, res, next) {
    try {
      const books = await bookService.getAllBooks();
      return new HttpResponse(res).success(
        books,
        "Fetched all books successfully",
      );
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const book = await bookService.getBookById(id);
      return new HttpResponse(res).success(book, "Fetched book successfully");
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const newBook = await bookService.createBook(req.body);
      return new HttpResponse(res).created(
        newBook,
        "Book created successfully",
      );
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const updatedBook = await bookService.updateBook(id, req.body);
      return new HttpResponse(res).success(
        updatedBook,
        "Book updated successfully",
      );
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      await bookService.deleteBook(id);
      return new HttpResponse(res).success(null, "Book deleted successfully");
    } catch (error) {
      next(error);
    }
  },
};
