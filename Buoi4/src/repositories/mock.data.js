let MOCK_USERS = [
  {
    id: 1,
    full_name: "Nguyen Van An",
    email: "an@gmail.com",
    role: "admin",
    is_active: true,
    password_hash: "$2b$10$abc...",
  },
  {
    id: 2,
    full_name: "Tran Thi Binh",
    email: "binh@gmail.com",
    role: "user",
    is_active: true,
    password_hash: "$2b$10$def...",
  },
  {
    id: 3,
    full_name: "Le Van Cuong",
    email: "cuong@gmail.com",
    role: "user",
    is_active: false,
    password_hash: "$2b$10$ghi...",
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getAllUsersFromDB = async () => {
  await delay(200);
  return [...MOCK_USERS];
};

export const getUserByIdFromDB = async (id) => {
  await delay(100);
  return MOCK_USERS.find((u) => u.id === id) ?? null;
};

export const getUserByEmailFromDB = async (email) => {
  await delay(100);
  return MOCK_USERS.find((u) => u.email === email) ?? null;
};

export const createUserInDB = async ({
  fullName,
  email,
  role = "user",
  password,
}) => {
  await delay(200);
  const newUser = {
    id: MOCK_USERS.length + 1,
    full_name: fullName,
    email,
    role,
    is_active: true,
    password_hash: `$2b$10$mockhashed_${password}`,
    created_at: new Date().toISOString(),
  };
  MOCK_USERS.push(newUser);
  return { ...newUser };
};

let MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Laptop Asus TUF Gaming F15",
    price: 999.99,
    category: "electronics",
    inStock: true,
  },
  {
    id: 2,
    name: "Tai nghe Airpods Pro 2",
    price: 149.99,
    category: "electronics",
    inStock: true,
  },
  {
    id: 3,
    name: "iPhone 16 Pro Max",
    price: 1199.99,
    category: "electronics",
    inStock: false,
  },
  {
    id: 4,
    name: "Nồi chiên không dầu",
    price: 89.5,
    category: "home",
    inStock: true,
  },
  {
    id: 5,
    name: "Áo thun basic",
    price: 19.99,
    category: "fashion",
    inStock: true,
  },
  {
    id: 6,
    name: "Sách học lập trình JavaScript",
    price: 39.99,
    category: "books",
    inStock: false,
  },
];

export const getAllProductsFromDB = async () => {
  await delay(200);
  return MOCK_PRODUCTS.map((product) => ({ ...product }));
};

export const getProductByIdFromDB = async (id) => {
  await delay(100);
  const product = MOCK_PRODUCTS.find((item) => item.id === id);
  return product ? { ...product } : null;
};

export const createProductInDB = async ({
  name,
  price,
  category,
  inStock = true,
}) => {
  await delay(200);

  const newProduct = {
    id: Math.max(...MOCK_PRODUCTS.map((product) => product.id), 0) + 1,
    name: name.trim(),
    price: Number(price),
    category,
    inStock,
    createdAt: new Date().toISOString(),
  };

  MOCK_PRODUCTS.push(newProduct);
  return { ...newProduct };
};
