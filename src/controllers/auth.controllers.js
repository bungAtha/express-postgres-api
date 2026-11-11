import AuthService from "../services/auth.service.js";
import  successResponse  from "../utils/apiResponse.js";

export const register = async (req, res, next) => {
  try {
    const user = await AuthService.register(req.body);
    return successResponse(res, "Pendaftaran Berhasil", user, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login({ email, password });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return successResponse(res, "Login Berhasil", { user, token });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return successResponse(res, "Logout Berhasil");
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    return successResponse(
      res,
      "Berhasil mengambil data profil user",
      req.user,
    );
  } catch (error) {
    next(error);
  }
};
