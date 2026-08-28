import { books } from "../data.js";

export const bookRepository = {
  async findAll() {
    return books;
  },

  async findById(id) {
    return books.find((b) => b.id === id);
  },

  async create(bookData) {
    const newBook = {
      id: books.length > 0 ? books[books.length - 1].id + 1 : 1,
      ...bookData,
    };
    books.push(newBook);
    return newBook;
  },

  async update(id, bookData) {
    const index = books.findIndex((b) => b.id === id);
    if (index !== -1) {
      books[index] = { ...books[index], ...bookData };
      return books[index];
    }
    return null;
  },

  async delete(id) {
    const index = books.findIndex((b) => b.id === id);
    if (index !== -1) {
      const deletedBook = books[index];
      books.splice(index, 1);
      return deletedBook;
    }
    return null;
  },
};
