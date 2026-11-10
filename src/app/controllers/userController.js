import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  getAllUsersModel,
  getUserByIdModel,
  createUserModel,
  updateUserModel,
  deleteUserModel,
} from "../models/userModel.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsersModel();
  res.status(200).json({
    success: true,
    data: users,
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await getUserByIdModel(id);

  if (!user) {
    throw ApiError.notFound("User tidak ditemukan");
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new ApiError(400, "Nama dan email wajib diisi");
  }

  const newUser = await createUserModel(name, email);
  res.status(201).json({
    success: true,
    data: newUser,
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    throw ApiError.badRequest("Nama dan email wajib diisi");
  }

  const updatedUser = await updateUserModel(id, name, email);
  if (!updatedUser) {
    throw ApiError.notFound("User tidak ditemukan");
  }
  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedUser = await deleteUserModel(id);

  if (!deletedUser) {
    throw ApiError.notFound("User tidak ditemukan");
  }
  res.status(200).json({
    success: true,
    message: "Data user berhasil dihapus",
    data: deletedUser,
  });
});
