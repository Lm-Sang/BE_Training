import * as productService from "../services/product.service.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getProducts();
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, price, category, inStock } = req.body;
    const newProduct = await productService.createProduct({
      name,
      price,
      category,
      inStock,
    });
    return res.status(201).json({
      success: true,
      message: "Create product successfully",
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};
