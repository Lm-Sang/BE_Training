export const formatUser = ({
  id,
  full_name,
  email,
  role,
  is_active,
  created_at,
}) => ({
  id,
  fullName: full_name,
  email,
  role,
  isActive: is_active,
  createdAt: created_at,
});

export const formatUsers = (users) => users.map(formatUser);

export const filterActiveUsers = (users) => users.filter((u) => u.is_active);
