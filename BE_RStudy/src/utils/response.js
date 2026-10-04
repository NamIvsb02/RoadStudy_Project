exports.formatResponse = (success, data = null, message = "") => ({
  success,
  message,
  data,
});
