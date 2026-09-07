import express from "express";
import dotenv from "dotenv";
import rootRouter from "./routes/index.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.js";
import { validateCreateProduct } from "./middlewares/validate.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware đọc JSON body
app.use(express.json());
//

// Root test route
app.get("/", (req, res) => {
  res.json({
    message: "🚀 API Server is running!",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", rootRouter);

// Handler
// 1. NotFound (404)
app.use(notFoundHandler);

// 2. Error handler
app.use(errorHandler);

// 3. Validation error handler (400)
app.use(validateCreateProduct);

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
