import express from "express";
import { users } from "../data.js";

const router = express.Router();

//API get all users
router.get("/users", (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Get all users successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
});

//API get user by id
router.get("/users/:id", (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Get user successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
});

//API create new user
router.post("/users", (req, res) => {
  try {
    const newUser = req.body;
    newUser.id = users.length + 1;
    users.push(newUser);
    res.status(201).json({
      success: true,
      message: "Create new user successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
});

//API update user by id
router.patch("/users/:id", (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    if (req.body.name) {
      user.name = req.body.name;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    res.status(200).json({
      success: true,
      message: "Update user successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
});

//API delete user by id
router.delete("/users/:id", (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    users.splice(userIndex, 1);
    res.status(200).json({
      success: true,
      message: "Delete user successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
});

export default router;
