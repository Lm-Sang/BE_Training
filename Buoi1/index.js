import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT;
const localhost = "localhost";
app.get("/login", (req, res) => {
  res.send("Login Successfully!");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, localhost, () => {
  console.log(`Server is running at http://${localhost}:${port}`);
});
