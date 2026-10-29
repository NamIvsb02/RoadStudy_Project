const authService = require("../services/authService");
const { formatResponse } = require("../utils/response");

const wrap = (fn) => async (req, res, next) => {
  try {
    res.locals.result = await fn(req, res);
  } catch (err) {
    return next(err);
  }
  next();
};

const register = async (req, res, next) => {
  try {
    const account = await authService.register(req.body);
    res.status(201).json(formatResponse(true, account, "Đăng ký thành công, vui lòng kiểm tra email để xác minh"));
  } catch (err) {
    next(err);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const result = await authService.verifyEmail(req.body.email, req.body.code);
    res.status(200).json(formatResponse(true, null, result.message));
  } catch (err) {
    next(err);
  }
};

const resendOtp = async (req, res, next) => {
  try {
    const result = await authService.resendOtp(req.body.email, req.body.purpose);
    res.status(200).json(formatResponse(true, null, result.message));
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    res.status(200).json(formatResponse(true, result, "Đăng nhập thành công"));
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const result = await authService.refreshAccessToken(req.body.refreshToken);
    res.status(200).json(formatResponse(true, result, "Làm mới token thành công"));
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const result = await authService.logout(req.body.refreshToken);
    res.status(200).json(formatResponse(true, null, result.message));
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    res.status(200).json(formatResponse(true, null, result.message));
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const result = await authService.resetPassword(req.body.email, req.body.code, req.body.newPassword);
    res.status(200).json(formatResponse(true, null, result.message));
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const result = await authService.changePassword(req.user.id, req.body.oldPassword, req.body.newPassword);
    res.status(200).json(formatResponse(true, null, result.message));
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    const account = await authService.getMe(req.user.id);
    res.status(200).json(formatResponse(true, account));
  } catch (err) {
    next(err);
  }
};

module.exports = { register, verifyEmail, resendOtp, login, refresh, logout, forgotPassword, resetPassword, changePassword, me };
