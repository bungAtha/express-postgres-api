import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { hasPermission } from "../config/roles.js";

export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new ApiError(401, "Akses ditolak. Silahkan login terlebih dahulu");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Token Tidak Valid"));
    }
    if (error.name === "TokenExpiredError") {
      return next(
        new ApiError(401, "Token telah kadaluarsa, silahkan login kembali"),
      );
    }

    next(error);
  }
};

export const requirePermission = (permission) => (req, res, next) => {
  if (!hasPermission(req.user?.role, permission)) {
    return next(
      new ApiError(403, `Forbidden: Membutuhkan izin '${permission}'`),
    );
  }

  next();
};

export const requireOwnerOrPermission =
  (permission, paramName = "id") =>
  (req, res, next) => {
    const isOwner = String(req.user?.id) === String(req.params[paramName]);

    if (!isOwner && !hasPermission(req.user?.role, permission)) {
      return next(
        new ApiError(
          403,
          "Forbidden: Anda tidak memiliki akses ke resouce ini",
        ),
      );
    }
    next()
  };
