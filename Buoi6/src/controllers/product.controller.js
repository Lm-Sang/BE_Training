import * as productService from "../services/product.service.js";

export const getAllProducts = async (req, res, next) => {
  try {
    const { search, page, limit } = req.query;
    const hasSearch = search !== undefined;
    const hasDivided = page !== undefined || limit !== undefined;
    let products;
    if (hasSearch && hasDivided) {
      products = await productService.searchProductsDivided(
        search,
        page,
        limit,
      );
    } else if (hasSearch) {
      products = await productService.searchProducts(search);
    } else if (hasDivided) {
      products = await productService.getProductsDivided(page, limit);
    } else {
      products = await productService.getAllProducts();
    }

    return res.status(200).json({
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
    const { name, price, stock, category_id } = req.body;
    const newProduct = await productService.createProduct({
      name,
      price,
      stock,
      category_id,
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

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, stock, category_id } = req.body;
    const updatedProduct = await productService.updateProduct(id, {
      name,
      price,
      stock,
      category_id,
    });
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await productService.deleteProduct(id);
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};
