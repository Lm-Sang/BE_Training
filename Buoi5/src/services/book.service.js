import { bookRepository } from "../repositories/book.repository.js";
import { NotFoundError } from "../utils/error.helper.js";

export const bookService = {
  async getAllBooks() {
    return await bookRepository.findAll();
  },

  async getBookById(id) {
    const book = await bookRepository.findById(id);
    if (!book) {
      throw new NotFoundError(`Book not found with id: ${id}`);
    }
    return book;
  },

  async createBook(bookData) {
    return await bookRepository.create(bookData);
  },

  async updateBook(id, bookData) {
    const existingBook = await bookRepository.findById(id);
    if (!existingBook) {
      throw new NotFoundError(`Book not found with id: ${id} to update`);
    }
    return await bookRepository.update(id, bookData);
  },

  async deleteBook(id) {
    const deletedBook = await bookRepository.delete(id);
    if (!deletedBook) {
      throw new NotFoundError(`Book not found with id: ${id} to delete`);
    }
    return deletedBook;
  },
};
