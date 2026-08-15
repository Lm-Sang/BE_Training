const users = [
  { id: 1, name: "Tùng", age: 25, role: "admin", isActive: true },
  { id: 2, name: "An", age: 20, role: "user", isActive: true },
  { id: 3, name: "Bình", age: 22, role: "user", isActive: false },
];

export function getActiveUsers(users) {
  return users.filter((user) => user.isActive);
}

export function getNames(users) {
  return users.map((user) => user.name);
}

export function printUserInfo({ name, age }) {
  console.log(`Tên: ${name} | Tuổi: ${age}`);
}

console.log(getActiveUsers(users));
console.log(getNames(users));
printUserInfo(users[0]);
