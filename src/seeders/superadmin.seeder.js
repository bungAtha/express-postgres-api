import bcrypt from "bcryptjs";
import "dotenv/config";
import pool from "../config/db.js";

async function seedSuperadmin() {
  const client = await pool.connect();

  const username = process.env.SUPERADMIN_USERNAME;
  const email = process.env.SUPERADMIN_EMAIL;
  const plainPassword = process.env.SUPERADMIN_PASSWORD;

  try {
    console.log("Memulai seeding Superadmin ......");

    await client.query("Begin");

    const queryText = `
            INSERT INTO roles (name)
            VALUES ('superadmin')
            ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
            RETURNING id;
        `;
    const roleResult = await client.query(queryText);
    const superadminRoleId = roleResult.rows[0].id;
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const checkUserQuery = `
            SELECT id FROM users
            WHERE email = $1 AND deleted_at IS NULL
        `;
    const existingUser = await client.query(checkUserQuery, [email]);

    if (existingUser.rows.length > 0) {
      const updateUserQuery = `
                UPDATE users
                SET username = $1,
                    password = $2,
                    role_id = $3,
                WHERE id = $4
                RETURNING id, username, email, role_id;
            `;
      const { rows } = await client.query(updateUserQuery, [
        username,
        hashedPassword,
        superadminRoleId,
        existingUser.rows[0].id,
      ]);
      console.log(
        "Akun Superadmin sudah ada, data berhasil diperbarui: ",
        rows[0],
      );
    } else {
      const insertUserQuery = `
                INSERT INTO users (username, email, password, role_id)
                VALUES ($1, $2, $3, $4)
                RETURNING id, username, email, role_id, created_at;
            `;
      const { rows } = await client.query(insertUserQuery, [
        username,
        email,
        hashedPassword,
        superadminRoleId,
      ]);
      console.log("Akun Superadmin baru berhasil dibuat: ", rows[0]);
    }
    await client.query("COMMIT");
    console.log(" Seeding Superadmin selesai");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Gagal melakukan seeding Superadmin", error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seedSuperadmin()