import ApiError from "../utils/ApiError.js";

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Pengguna belum terautentikasi"));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(403, "Akses ditolak. Anda tidak memiliki hak akses"),
      );
    }
    next();
  };
};
