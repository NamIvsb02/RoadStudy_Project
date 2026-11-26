const crypto = require("crypto");

// Gán mã truy vết cho mỗi request: dùng X-Request-Id của client/proxy nếu có (giới hạn độ dài), không thì tạo mới.
// Mã này có trong log và trong header phản hồi để đối chiếu khi người dùng báo lỗi.
module.exports = (req, res, next) => {
  const incoming = req.get("x-request-id");
  req.id = incoming && /^[\w-]{1,64}$/.test(incoming) ? incoming : crypto.randomUUID();
  res.setHeader("X-Request-Id", req.id);
  next();
};
