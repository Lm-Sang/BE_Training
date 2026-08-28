import { z } from "zod";
// Validation schema for creating a user, user's name must not contain special characters and number, and email must be a valid email format
export const createUserSchema = z.object({
  name: z
    .string("Name is required")
    .min(2, "Name must be at least 2 characters")
    .regex(
      /^[A-Za-z\s]+$/,
      "Name must not contain special characters or numbers",
    ),

  email: z.email({
    required_error: "Email is required",
    message: "Invalid email format",
  }),
});
// Validation schema for updating a user, user's name must not contain special characters and number, and email must be a valid email format
export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .regex(
        /^[A-Za-z\s]+$/,
        "Name must not contain special characters or numbers",
      )
      .optional(),
    email: z.email({ message: "Invalid email format" }).optional(),
  })
  .refine((data) => data.name !== undefined || data.email !== undefined, {
    message: "At least one field (name or email) must be provided to update",
    path: ["body"],
  });
