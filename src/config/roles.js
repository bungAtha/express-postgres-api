export const PERMISSIONS = {
  USER_READ_ALL: "user:read_all",
  USER_MANAGE: "user:manage",
  USER_RESTORE: "user:restore",
  USER_MANAGE_ROLES: "user:manage_roles",
};

export const ROLE_PERMISSIONS = {
  superadmin: ["*"],
  admin: [
    PERMISSIONS.USER_READ_ALL,
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.USER_RESTORE,
  ],
  user: [],
};

export const hasPermission = (role, permission) => {
  const userPermissions = ROLE_PERMISSIONS[role] || [];
  return userPermissions.includes("*") || userPermissions.includes(permission);
};
