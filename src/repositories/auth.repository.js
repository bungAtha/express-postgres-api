import { query } from "../config/db.js";

class AuthRepository {
  static async findByEmail(email) {
    const queryText = `
        SELECT u.id, u.username, u.email, u.password, u.role_id, r.name as role
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE u.email = $1
    `;
    const { rows } = await query(queryText, [email]);
    return rows[0];
  }

  static async findByUsername(username) {
    const queryText = `
        SELECT u.id, u.username, u.email
        FROM users u
        WHERE u.username = $1
    `;
    const { rows } = await query(queryText, [username]);
    return rows[0];
  }

  static async createUser({ username, email, password, roleId }) {
    const queryText = `
        INSERT INTO users (username, email, password, role_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, username, email, role_id, created_at
    `;
    const { rows } = await query(queryText, [
      username,
      email,
      password,
      roleId,
    ]);
    return rows[0];
  }
}

export default AuthRepository;
