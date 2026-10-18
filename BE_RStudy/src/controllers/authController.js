const authService = require("../services/authService");
const { formatResponse } = require("../utils/response");

const register = async (req, res, next) => {
  try {
    const account = await authService.register(req.body);
    return res.status(201).json(formatResponse(true, account, "Đăng ký thành công"));
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    return res.status(200).json(formatResponse(true, result, "Đăng nhập thành công"));
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    const account = await authService.getMe(req.user.id);
    return res.status(200).json(formatResponse(true, account));
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, me };
