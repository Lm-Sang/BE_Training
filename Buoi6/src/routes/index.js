import express from "express";
import userRouter from "./user.route.js";
import productRouter from "./product.route.js";
import authRouter from "./auth.route.js";

const rootRouter = express.Router();

rootRouter.use("/users", userRouter);
rootRouter.use("/products", productRouter);
rootRouter.use("/auth", authRouter);

export default rootRouter;
