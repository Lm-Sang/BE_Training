import pool from "../configs/db.config.js";

export const authRepository = {
  async findUserByEmail(email) {
    const [rows] = await pool.query(
      `
        SELECT * FROM users WHERE email = ?
        `,
      [email],
    );
    return rows[0];
  },

  async createUser(user) {
    const { name, email, password } = user;
    const [result] = await pool.query(
      `
        INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)
      `,
      [name, email, password, "user"],
    );
    return result.insertId;
  },

  async findUserById(id) {
    const [rows] = await pool.query(
      `
        SELECT * FROM users WHERE id = ?
        `,
      [id],
    );
    return rows[0];
  },

  async saveRefreshTokenHash(userId, tokenHash) {
    await pool.query(
      `UPDATE users
     SET refresh_token_hash = ?,
         refresh_token_expires_at = DATE_ADD(NOW(), INTERVAL 7 DAY)
     WHERE id = ?`,
      [tokenHash, userId],
    );
  },

  async findUserForRefresh(userId) {
    const [rows] = await pool.query(
      `SELECT id, role, refresh_token_hash
     FROM users
     WHERE id = ?
       AND refresh_token_hash IS NOT NULL
       AND refresh_token_expires_at > NOW()`,
      [userId],
    );

    return rows[0];
  },

  async rotateRefreshTokenHash(userId, oldHash, newHash) {
    const [result] = await pool.query(
      `UPDATE users
     SET refresh_token_hash = ?,
         refresh_token_expires_at = DATE_ADD(NOW(), INTERVAL 7 DAY)
     WHERE id = ?
       AND refresh_token_hash = ?
       AND refresh_token_expires_at > NOW()`,
      [newHash, userId, oldHash],
    );

    return result.affectedRows === 1;
  },

  async revokeRefreshTokenHash(userId, oldHash) {
    const [result] = await pool.query(
      `UPDATE users
     SET refresh_token_hash = NULL,
         refresh_token_expires_at = NULL
     WHERE id = ?
       AND refresh_token_hash = ?`,
      [userId, oldHash],
    );

    return result.affectedRows === 1;
  },
};
