import UserService from "../services/user.service.js";
import successResponse from "../utils/apiResponse.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await UserService.getAllUsers();
    return successResponse(res, "Berhasil mengambil daftar user", users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    return successResponse(res, "Berhasil mengambil data user", user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const newUser = await UserService.createUser(req.body);
    return successResponse(res, "Berhasil membuat user", newUser, 201);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await UserService.updateUser(req.params.id, req.body);
    return successResponse(res, "Berhasil memperbarui", updatedUser);
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role_id } = req.body;

    if (req.user?.id === Number(id)) {
      return res.status(400).json({
        succes: false,
        message: "Anda tidak dapat mengubah role akun anda sendiri",
      });
    }

    const updatedUser = await UserService.changeUserRole(id, role_id);
    return successResponse(res, "Role user berhasil diperbarui", updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await UserService.deleteUser(req.params.id);
    return successResponse(res, "Berhasil menghapus user");
  } catch (error) {
    next(error);
  }
};

export const restoreUser = async (req, res, next) => {
  try {
    const user = await UserService.restoreUser(req.params.id);
    return successResponse(res, "User berhasil dipulihkan", user);
  } catch (error) {
    next(error);
  }
};
