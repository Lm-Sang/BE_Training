import * as userRepository from "../repositories/user.repository.js";

import { formatUsers, formatUser } from "../utils/user.util.js";

export const getAllUsers = async () => {
  const users = await userRepository.getAllUsersFromDB();
  return formatUsers(users);
};

export const getUserById = async (id) => {
  const numericId = Number(id);
  if (isNaN(numericId)) {
    const error = new Error("Invalid user ID (must be a number)");
    error.statusCode = 400;
    throw error;
  }
  const user = await userRepository.getUserByIdFromDB(numericId);
  if (!user) {
    const error = new Error(`User not found`);
    error.statusCode = 404;
    throw error;
  }

  return formatUser(user);
};

export const getUserByEmail = async (email) => {
  const user = await userRepository.getUserByEmailFromDB(email);
  if (!user) {
    const error = new Error(`User not found`);
    error.statusCode = 404;
    throw error;
  }
  return formatUser(user);
};

export const createUser = async (userData) => {
  const { full_name, email, password_hash, role = "user" } = userData;
  if (!full_name || full_name.trim().length < 2) {
    const error = new Error("Full name must be at least 2 characters long.");
    error.statusCode = 400;
    throw error;
  }

  if (!email || !email.includes("@")) {
    const error = new Error("Invalid email address.");
    error.statusCode = 400;
    throw error;
  }

  if (!password_hash || password_hash.length < 6) {
    const error = new Error("Password must be at least 6 characters long.");
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await userRepository.getUserByEmailFromDB(email);
  if (existingUser) {
    const error = new Error("Email is already in use.");
    error.statusCode = 409;
    throw error;
  }

  const newUserId = await userRepository.createUserInDB({
    full_name: full_name.trim(),
    email: email.trim().toLowerCase(),
    password_hash,
    role,
  });
  return await userRepository.getUserByIdFromDB(newUserId);
};
