const notificationService = require("../services/notificationService");
const { formatResponse } = require("../utils/response");

const handle = (action) => async (req, res, next) => {
  try {
    res.status(200).json(formatResponse(true, await action(req)));
  } catch (err) {
    next(err);
  }
};

const list = handle((req) => notificationService.list(req.user.id, req.query));
const unreadCount = handle((req) => notificationService.unreadCount(req.user.id));
const markRead = handle((req) => notificationService.markRead(req.user.id, req.params.id));
const markAllRead = handle((req) => notificationService.markAllRead(req.user.id));

module.exports = { list, unreadCount, markRead, markAllRead };
