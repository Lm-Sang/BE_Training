import pool from "../configs/db.config.js";

// Get all products
export const findAllProductsFromDB = async () => {
  const [rows] = await pool.query(
    `
    SELECT 
        p.id,
        p.name,
        p.price,
        p.stock,
        p.created_at,
        c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.id ASC
    `,
  );
  return rows;
};

// Get product by ID
export const findProductByIdFromDB = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT 
        p.id,
        p.name,
        p.price,
        p.stock,
        p.created_at,
        c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
    `,
    [id],
  );
  return rows[0] ?? null;
};

// Create a new product
export const createProductInDB = async (productData) => {
  const { name, price, stock, category_id } = productData;
  const [rows] = await pool.query(
    `
    INSERT INTO products (name, price, stock, category_id)
    VALUES (?, ?, ?, ?)
    `,
    [name, price, stock, category_id],
  );
  return rows.insertId;
};

// Update an existing product
export const updateProductInDB = async (id, productData) => {
  const { name, price, stock, category_id } = productData;
  const [rows] = await pool.query(
    `
    UPDATE products
    SET name = ?, price = ?, stock = ?, category_id = ?
    WHERE id = ?
    `,
    [name, price, stock, category_id, id],
  );
  return rows.affectedRows > 0;
};

// Delete a product
export const deleteProductInDB = async (id) => {
  const [rows] = await pool.query(
    `
    DELETE FROM products
    WHERE id = ?
    `,
    [id],
  );
  return rows.affectedRows > 0;
};

// Get product by name
export const searchProductsByNameFromDB = async (search) => {
  const [rows] = await pool.query(
    `
    SELECT 
        p.id,
        p.name,
        p.price,
        p.stock,
        p.created_at,
        c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE LOWER(p.name) LIKE ?
    `,
    [`%${search.toLowerCase()}%`],
  );
  return rows;
};

// Product page division
export const findAllProductsDividedFromDB = async (limit, offset) => {
  const [rows] = await pool.query(
    `
    SELECT
      p.id,
      p.name,
      p.price,
      p.stock,
      p.created_at,
      c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.id ASC
    LIMIT ? OFFSET ?
    `,
    [Number(limit), Number(offset)],
  );

  return rows;
};

// Search products by name with page division
export const searchProductsDividedFromDB = async (search, limit, offset) => {
  const [rows] = await pool.query(
    `
    SELECT
      p.id,
      p.name,
      p.price,
      p.stock,
      p.created_at,
      c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE LOWER(p.name) LIKE ?
    ORDER BY p.id ASC
    LIMIT ? OFFSET ?
    `,
    [`%${search.toLowerCase()}%`, Number(limit), Number(offset)],
  );

  return rows;
};
