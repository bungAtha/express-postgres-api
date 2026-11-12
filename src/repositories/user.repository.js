import { query } from "../config/db.js";

class UserRepository {
  static async findAll() {
    const queryText = `
        SELECT u.id, u.username, u.email, r.name as role, u.created_at
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE u.deleted_at IS NULL
        ORDER BY u.created_at DESC
        `;
    const { rows } = await query(queryText);
    return rows;
  }

  static async findById(id) {
    const queryText = `
        SELECT u.id, u.username, u.email, u.role_id, r.name as role u.created_at
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE u.id = $1 AND u.deleted_at IS NULL
    `;
    const { rows } = await query(queryText, [id]);
    return rows[0];
  }

  static async findByEmail(email) {
    const queryText = `
        SELECT u.*, r.name as role_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE u.email = $1 AND u.deleted IS NULL
    `;
    const { rows } = await query(queryText, [email]);
    return rows[0];
  }

  static async create({ username, email, password, roleId }) {
    const queryText = `
        INSERT INTO users (username, email, password, role_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, username, email, password, role_id, created_at
    `;
    const { rows } = await query(queryText, [
      username,
      email,
      password,
      roleId,
    ]);
    return rows[0];
  }

  static async update(id, { username, email, roleId }) {
    const queryText = `
        UPDATE users
        SET username = COALESCE($1, username),
            email = COALESCE ($2, email),
            role_id = COALESCE ($3, role_id)
        WHERE id = $4 AND deleted_at IS NULL
        RETURNING id, username, email, role_id, created_at, updated_at
    `;
    const { rows } = await query(queryText, [username, email, roleId, id]);
    return rows[0];
  }

  static async softDelete(id) {
    const queryText = `
        UPDATE users
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING id, username, email, deleted_at
    `;
    const { rows } = await query(queryText, [id]);
    return rows[0];
  }

  static async restore(id) {
    const queryText = `
        UPDATE users
        SET deleted_at = NULL
        WHERE id = $1 AND deleted_at IS NOT NULL
        RETURNING id, username, email, role_id, created_at
    `;
    const { rows } = await query(queryText, [id]);
    return rows[0];
  }

  static async hardDelete(id) {
    const queryText = `
        DELETE FROM users
        WHERE id = $1
        RETURNING id
    `;
    const { rows } = await query(queryText, [id]);
    return rows[0];
  }
}

export default UserRepository;
