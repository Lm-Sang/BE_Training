import {
  getAllUsersFromDB,
  getUserByIdFromDB,
  getUserByEmailFromDB,
  createUserInDB,
} from "../repositories/mock.data.js";

import {
  filterActiveUsers,
  formatUsers,
  formatUser,
} from "../utils/user.util.js";

export const getUsers = async ({ active } = {}) => {
  let users = await getAllUsersFromDB();

  if (active !== undefined) {
    const isActive = active === "true" || active === true;
    users = isActive
      ? filterActiveUsers(users)
      : users.filter((u) => !u.is_active);
  }

  return formatUsers(users);
};

export const getUserById = async (id) => {
  const numericId = parseInt(id);
  if (isNaN(numericId)) {
    const error = new Error("ID người dùng không hợp lệ!");
    error.statusCode = 400;
    throw error;
  }

  const user = await getUserByIdFromDB(numericId);
  if (!user) {
    const error = new Error(`Không tìm thấy người dùng với ID: ${id}`);
    error.statusCode = 404;
    throw error;
  }

  return formatUser(user);
};

export const createUser = async ({
  fullName,
  email,
  role = "user",
  password,
}) => {
  // 1. Validation nghiệp vụ
  if (!fullName || fullName.trim().length < 2) {
    const error = new Error("Họ và tên phải có ít nhất 2 ký tự!");
    error.statusCode = 400;
    throw error;
  }

  if (!email || !email.includes("@")) {
    const error = new Error("Email không hợp lệ!");
    error.statusCode = 400;
    throw error;
  }

  if (!password || password.length < 6) {
    const error = new Error("Mật khẩu phải có tối thiểu 6 ký tự!");
    error.statusCode = 400;
    throw error;
  }

  // 2. Kiểm tra email trùng lặp
  const existingUser = await getUserByEmailFromDB(email);
  if (existingUser) {
    const error = new Error("Email này đã được sử dụng trong hệ thống!");
    error.statusCode = 409; // 409 Conflict
    throw error;
  }

  // 3. Tạo user và lưu vào DB
  const createdUser = await createUserInDB({
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    role,
    password,
  });

  return formatUser(createdUser);
};
