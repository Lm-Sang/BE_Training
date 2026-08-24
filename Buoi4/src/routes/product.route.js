import express from "express";
import * as productController from "../controllers/product.controller.js";
import { requireAdminRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", requireAdminRole, productController.getProducts);
router.get("/:id", requireAdminRole, productController.getProductById);
router.post("/", requireAdminRole, productController.createProduct);

export default router;
