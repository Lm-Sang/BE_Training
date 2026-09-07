import pool from "../configs/db.config.js";

// Get all users
export const getAllUsersFromDB = async () => {
  const [rows] = await pool.query(
    `
      SELECT * FROM users
      ORDER BY id ASC
    `,
  );
  return rows;
};

// Get user by ID
export const getUserByIdFromDB = async (id) => {
  const [rows] = await pool.query(
    `
      SELECT * FROM users
      WHERE id = ?
    `,
    [id],
  );
  return rows[0];
};

// Get user by email
export const getUserByEmailFromDB = async (email) => {
  const [rows] = await pool.query(
    `
      SELECT * FROM users
      WHERE email = ?
    `,
    [email],
  );
  return rows[0];
};

// Create a new user
export const createUserInDB = async (userData) => {
  const { full_name, email, password_hash, role } = userData;
  const [result] = await pool.query(
    `
      INSERT INTO users (full_name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `,
    [full_name, email, password_hash, role],
  );
  return result;
};
