import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import bookRouter from "./routes/book.route.js";
import morgan from "morgan";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const localhost = "localhost";
app.use(express.json());
app.use(morgan("dev"));
app.get("/", (req, res) => {
  res.send("Login Successfully!");
});

app.use("/", userRouter);
app.use("/", bookRouter);

app.listen(port, localhost, () => {
  console.log(`Server is running at http://${localhost}:${port}`);
});
