import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import AuthRepository from "../repositories/auth.repository.js";
import ApiError from "../utils/ApiError.js";

class AuthService {
  static async register({ username, email, password, roleId }) {
    const existingEmail = await AuthRepository.findByEmail(email);
    if (existingEmail) {
      throw new ApiError(400, "Email sudah terdaftar");
    }

    const existingUsername = await AuthRepository.findByUsername(username);
    if (existingUsername) {
      throw new ApiError(400, "Username sudah digunakan");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await AuthRepository.createUser({
      username,
      email,
      password: hashedPassword,
      roleId,
    });

    return newUser;
  }

  static async login({ email, password }) {
    const user = await AuthRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(401, "Email atau password salah");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new ApiError(401, "Email atau password salah");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }
}

export default AuthService;
