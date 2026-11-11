import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import ApiError from "./utils/ApiError.js";
import globalErrorHandler from "./middlewares/error.middleware.js";
import v1Routes from "./routes/v1/index.js";

const app = express();

app.use(helmet());
app.use(
  cors({ origin: process.env.ALLOWED_ORIGINS?.split(","), credential: true }),
);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", v1Routes);

app.use((req, res, next) =>
  next(new ApiError(400, "Endpoint tidak ditemukan")),
);
app.use(globalErrorHandler);

export default app