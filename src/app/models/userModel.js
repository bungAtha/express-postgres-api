import { query } from "../../configs/dbConfig.js";

export const getAllUsersModel = async () => {
  const result = await query("SELECT * FROM users ORDER BY id ASC");
  return result.rows;
};

export const getUserByIdModel = async (id) => {
  const result = await query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

export const createUserModel = async (name, email) => {
  const queryText =
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *";
  const result = await query(queryText, [name, email]);
  return result.rows[0];
};

export const updateUserModel = async (id, name, email) => {
  const queryText = `
    UPDATE users
    SET name = $1, email = $2
    WHERE id = $3
    RETURNING *`;
  const result = await query(queryText, [name, email, id]);
  return result.rows[0];
};

export const deleteUserModel = async (id) => {
  const result = await query("DELETE FROM users WHERE id = $1 RETURNING *", [
    id,
  ]);
  return result.rows[0];
};
