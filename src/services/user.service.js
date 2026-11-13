import bcrypt from "bcryptjs";
import UserRepository from "../repositories/user.repository.js";
import ApiError from "../utils/ApiError.js";

class UserService {
  static async getAllUsers() {
    return await UserRepository.findAll();
  }

  static async getUserById(id) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new ApiError(404, "User tidak ditemukan");
    }
    return user;
  }

  static async createUser(userData) {
    const existingUser = await UserRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ApiError(400, "Email sudah digunakan");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return await UserRepository.create({
      ...userData,
      password: hashedPassword,
      roleId: userData.roleId || 2,
    });
  }

  static async updateUser(id, updateData) {
    await this.getUserById(id);

    return await UserRepository.update(id, updateData);
  }

  static async changeUserRole(userId, roleId) {
    const roleExists = await UserRepository.findRoleById(roleId);
    if (!roleExists) {
      throw new ApiError(404, "Role tidak di temukan");
    }

    const updatedUser = await UserRepository.updateRole(userId, roleId);
    if (!updatedUser) {
      throw new ApiError(404, "User tidak ditemukan atau sudah di hapus");
    }

    return updatedUser;
  }

  static async deleteUser(id) {
    await this.getUserById(id);

    return await UserRepository.softDelete(id);
  }

  static async restoreUser(id) {
    const restoredUser = await UserRepository.restore(id);
    if (!restoredUser) {
      throw new ApiError(404, "User tidak ditemukan di kotak sampah");
    }
    return restoredUser;
  }
}

export default UserService;
