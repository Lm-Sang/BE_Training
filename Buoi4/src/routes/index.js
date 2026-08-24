import express from "express";
import userRouter from "./user.route.js";
import productRouter from "./product.route.js";

const rootRouter = express.Router();

rootRouter.use("/users", userRouter);
rootRouter.use("/products", productRouter);

export default rootRouter;
