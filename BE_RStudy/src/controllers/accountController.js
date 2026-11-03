const accountService = require("../services/accountService");
const { formatResponse } = require("../utils/response");

const updateProfile = async (req, res, next) => {
  try {
    const account = await accountService.updateProfile(req.user, req.body);
    res.status(200).json(formatResponse(true, account, "Cập nhật hồ sơ thành công"));
  } catch (err) {
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const account = await accountService.updateAvatar(req.user, req.file);
    res.status(200).json(formatResponse(true, account, "Cập nhật ảnh đại diện thành công"));
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const result = await accountService.listAccounts(req.query);
    res.status(200).json(formatResponse(true, result));
  } catch (err) {
    next(err);
  }
};

const changeStatus = async (req, res, next) => {
  try {
    const account = await accountService.changeStatus(req.user, req.params.id, req.body.status);
    const message = req.body.status === "BI_KHOA" ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản";
    res.status(200).json(formatResponse(true, account, message));
  } catch (err) {
    next(err);
  }
};

module.exports = { updateProfile, updateAvatar, list, changeStatus };
