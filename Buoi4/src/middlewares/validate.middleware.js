export const validateCreateProduct = (req, res, next) => {
  const { name, price, category, inStock } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Product name must be at least 2 characters long.",
    });
  }

  if (!price || typeof price !== "number" || price <= 0) {
    return res.status(400).json({
      success: false,
      message: "Product price must be a positive number.",
    });
  }

  next();
};
