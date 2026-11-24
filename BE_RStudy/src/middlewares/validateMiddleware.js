const AppError = require("../utils/AppError");

const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const result = schema.safeParse(req[source] ?? {}); // Express 5: không gửi body thì req.body là undefined
    if (!result.success) {
      const message = result.error.issues.map((i) => (i.path.length > 0 ? `${i.path.join(".")}: ${i.message}` : i.message)).join("; ");
      return next(new AppError(message, 400));
    }
    req[source] = result.data; // dữ liệu đã được Zod parse/coerce
    next();
  };

module.exports = validate;
