const teacherService = require("../services/teacherService");
const { formatResponse } = require("../utils/response");

const listPublic = async (req, res, next) => {
  try {
    res.status(200).json(formatResponse(true, await teacherService.listPublic(req.query)));
  } catch (err) {
    next(err);
  }
};

const getPublic = async (req, res, next) => {
  try {
    res.status(200).json(formatResponse(true, await teacherService.getPublic(req.params.id)));
  } catch (err) {
    next(err);
  }
};

const listForAdmin = async (req, res, next) => {
  try {
    res.status(200).json(formatResponse(true, await teacherService.listForAdmin(req.query)));
  } catch (err) {
    next(err);
  }
};

const setApproval = async (req, res, next) => {
  try {
    const teacher = await teacherService.setApproval(req.params.id, req.body.approvalStatus);
    const message = req.body.approvalStatus === "DA_DUYET" ? "Đã duyệt giáo viên" : "Đã từ chối giáo viên";
    res.status(200).json(formatResponse(true, teacher, message));
  } catch (err) {
    next(err);
  }
};

const getMyStats = async (req, res, next) => {
  try {
    res.status(200).json(formatResponse(true, await teacherService.getMyStats(req.user.id)));
  } catch (err) {
    next(err);
  }
};

module.exports = { listPublic, getPublic, listForAdmin, setApproval, getMyStats };
