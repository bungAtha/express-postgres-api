import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

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
