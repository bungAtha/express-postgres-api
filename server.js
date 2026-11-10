import express from "express";
import "dotenv/config";
import userRoutes from "./src/routes/userRoutes.js";
import errorHandler from "./src/middlewares/errorHandler.js";

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/api", userRoutes);
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Aplikasi Berjalan di port ${port}`);
});
