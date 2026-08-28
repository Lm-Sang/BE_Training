import { z } from "zod";

export const createBookSchema = z.object({
  title: z
    .string("Title is required")
    .min(2, "Title must be at least 2 characters")
    .regex(
      /^[A-Za-z\s]+$/,
      "Title must not contain special characters or numbers",
    ),

  author: z
    .string("Author is required")
    .min(2, "Author must be at least 2 characters")
    .regex(
      /^[A-Za-z\s]+$/,
      "Author must not contain special characters or numbers",
    ),
});

export const updateBookSchema = z
  .object({
    title: z
      .string()
      .min(2, "Title must be at least 2 characters")
      .regex(
        /^[A-Za-z\s]+$/,
        "Title must not contain special characters or numbers",
      )
      .optional(),
    author: z
      .string()
      .min(2, "Author must be at least 2 characters")
      .regex(
        /^[A-Za-z\s]+$/,
        "Author must not contain special characters or numbers",
      )
      .optional(),
  })
  .refine((data) => data.title !== undefined || data.author !== undefined, {
    message: "At least one field (title or author) must be provided to update",
    path: ["body"],
  });
