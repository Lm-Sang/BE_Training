import * as productRepository from "../repositories/product.repository.js";

export const getAllProducts = async () => {
  return productRepository.findAllProductsFromDB();
};

export const searchProducts = async (search) => {
  if (!search || !search.trim()) {
    const error = new Error("Search keyword is required");
    error.statusCode = 400;
    throw error;
  }

  return productRepository.searchProductsByNameFromDB(search.trim());
};

const parseDivided = (page, limit) => {
  const numericPage = Number(page);
  const numericLimit = Number(limit);

  if (
    !Number.isInteger(numericPage) ||
    numericPage < 1 ||
    !Number.isInteger(numericLimit) ||
    numericLimit < 1
  ) {
    const error = new Error("Page and limit must be positive integers");
    error.statusCode = 400;
    throw error;
  }

  return {
    numericLimit,
    offset: (numericPage - 1) * numericLimit,
  };
};

export const getProductsDivided = async (page, limit) => {
  const { numericLimit, offset } = parseDivided(page, limit);

  return productRepository.findAllProductsDividedFromDB(numericLimit, offset);
};

export const searchProductsDivided = async (search, page, limit) => {
  if (!search || !search.trim()) {
    const error = new Error("Search text is required");
    error.statusCode = 400;
    throw error;
  }

  const { numericLimit, offset } = parseDivided(page, limit);

  return productRepository.searchProductsDividedFromDB(
    search.trim(),
    numericLimit,
    offset,
  );
};

export const getProductById = async (id) => {
  const numericId = Number(id);
  if (isNaN(numericId)) {
    const error = new Error("Invalid product ID (must be a number)");
    error.statusCode = 400;
    throw error;
  }

  const product = await productRepository.findProductByIdFromDB(numericId);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

export const createProduct = async (productData) => {
  const { name, price, stock, category_id } = productData;
  const newProductId = await productRepository.createProductInDB({
    name,
    price,
    stock,
    category_id,
  });
  return await productRepository.findProductByIdFromDB(newProductId);
};

export const updateProduct = async (id, productData) => {
  const productId = Number(id);
  if (Number.isNaN(productId)) {
    const error = new Error("Invalid product ID (must be a number)");
    error.statusCode = 400;
    throw error;
  }
  const product = await productRepository.findProductByIdFromDB(productId);
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  await productRepository.updateProductInDB(productId, productData);
  return productRepository.findProductByIdFromDB(productId);
};

export const deleteProduct = async (id) => {
  const productId = Number(id);
  if (Number.isNaN(productId)) {
    const error = new Error("Invalid product ID (must be a number)");
    error.statusCode = 400;
    throw error;
  }

  const product = await productRepository.findProductByIdFromDB(productId);
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }
  await productRepository.deleteProductInDB(productId);
  return { message: "Product deleted successfully" };
};
