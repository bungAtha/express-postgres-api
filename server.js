import "dotenv/config";
import app from "./src/app.js";
import pool from "./src/config/db.js";

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});

process.on("SIGINT", async () => {
  server.close(async () => {
    await pool.end();
    console.log("Server dan koneksi databse ditutup");
    process.exit(0);
  });
});
