import express from "express";
import * as productController from "../controllers/product.controller.js";
import { validateCreateProduct } from "../middlewares/validate.middleware.js";
import {
  requireAdmin,
  verifyToken,
} from "../middlewares/authorization.middleware.js";

const router = express.Router();

router.get("/", verifyToken, requireAdmin, productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", validateCreateProduct, productController.createProduct);
router.put("/:id", validateCreateProduct, productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
