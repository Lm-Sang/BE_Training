import {
  getAllProductsFromDB,
  getProductByIdFromDB,
  createProductInDB,
} from "../repositories/mock.data.js";

export const getProducts = async () => {
  let products = await getAllProductsFromDB();

  return products;
};

export const getProductById = async (id) => {
  const numericId = parseInt(id);
  if (isNaN(numericId)) {
    const error = new Error("Product ID is not valid!");
    error.statusCode = 400;
    throw error;
  }

  const product = await getProductByIdFromDB(numericId);
  if (!product) {
    const error = new Error("Product ID is not found!");
    error.statusCode = 404;
    throw error;
  }
  return product;
};

export const createProduct = async ({ name, price, category, inStock }) => {
  if (!name || name.trim().length < 2) {
    const error = new Error("Product name must be at least 2 characters long!");
    error.statusCode = 400;
    throw error;
  }

  if (!price || typeof price !== "number" || price <= 0) {
    const error = new Error("Product price must be a positive number!");
    error.statusCode = 400;
    throw error;
  }

  if (!category || category.trim().length < 2) {
    const error = new Error(
      "Product category must be at least 2 characters long!",
    );
    error.statusCode = 400;
    throw error;
  }

  if (!inStock || typeof inStock !== "boolean") {
    const error = new Error("Product inStock must be a boolean value!");
    error.statusCode = 400;
    throw error;
  }

  const existingProduct = await getAllProductsFromDB();
  if (
    existingProduct.some(
      (p) => p.name.trim().toLowerCase() === name.trim().toLowerCase(),
    )
  ) {
    const error = new Error("Product name already exists!");
    error.statusCode = 409;
    throw error;
  }

  const newProduct = await createProductInDB({
    name: name.trim(),
    price,
    category: category.trim(),
    inStock,
  });
  return newProduct;
};
