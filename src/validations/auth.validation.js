import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    username: z
      .string({ error: "Username wajib diisi" })
      .min(3, "username minimal 3 karakter")
      .max(50, "username maksimal 50 karakter")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "username hanya boleh mengandung huruf, angka, dan underscore",
      ),
    email: z.email("Format email tidak valid"),
    password: z
      .string({ error: "Password wajib diisi" })
      .min(6, "Password minimal 6 karakter"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email("format email tidak valid"),
    password: z.string({ error: "Password wajib diisi" })
    .min(1, "Password wajib diisi"),
  }),
});
