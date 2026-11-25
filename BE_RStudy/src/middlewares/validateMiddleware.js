const AppError = require("../utils/AppError");

// apiDoc: thông tin cho Swagger (src/docs/openapi.js) đọc lại, không ảnh hưởng xử lý request
const validate = (schema, source = "body") => {
  const middleware = (req, res, next) => {
    const result = schema.safeParse(req[source] ?? {}); // Express 5: không gửi body thì req.body là undefined
    if (!result.success) {
      const message = result.error.issues.map((i) => (i.path.length > 0 ? `${i.path.join(".")}: ${i.message}` : i.message)).join("; ");
      return next(new AppError(message, 400));
    }
    req[source] = result.data; // dữ liệu đã được Zod parse/coerce
    next();
  };
  middleware.apiDoc = { validate: { schema, source } };
  return middleware;
};

module.exports = validate;
