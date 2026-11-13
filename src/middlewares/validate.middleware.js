import ApiError from "../utils/ApiError.js";

export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (parsed.body) req.body = parsed.body;
    if (parsed.params) Object.assign(req.params, parsed.params);
    if (parsed.query) Object.assign(req.query, parsed.query);

    return next();
  } catch (error) {
    const errorMessages = error.errors?.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
    next(new ApiError(400, "Validasi gagal", errorMessages));
  }
};
