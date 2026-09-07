import * as userService from "../services/user.service.js";

export const getUsers = async (req, res, next) => {
  try {
    const { active } = req.query;
    const users = await userService.getAllUsers({ active });
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { full_name, email, role, password_hash } = req.body;
    const newUser = await userService.createUser({
      full_name,
      email,
      role,
      password_hash,
    });
    return res.status(201).json({
      success: true,
      message: "Tạo tài khoản thành công",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};
