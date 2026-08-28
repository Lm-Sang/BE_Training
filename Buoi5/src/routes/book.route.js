import express from "express";
import { bookController } from "../controllers/book.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createBookSchema,
  updateBookSchema,
} from "../validations/book.validation.js";

const router = express.Router();

// GET: Fetch all books
router.get("/books", bookController.getAll);

// GET: Fetch book by id
router.get("/books/:id", bookController.getById);

// POST: Create a new book
router.post("/books", validate(createBookSchema), bookController.create);

// PATCH: Update a book
router.patch("/books/:id", validate(updateBookSchema), bookController.update);

// DELETE: Delete a book
router.delete("/books/:id", bookController.delete);

export default router;
