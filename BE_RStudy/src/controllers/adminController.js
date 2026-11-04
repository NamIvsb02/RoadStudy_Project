const service = require("../services/adminService");
const v = require("../validators/adminValidator");

const getMe = async (req, res) => {
  const data = await service.getMyAccess(req.admin);
  res.json({ success: true, data });
};

const listSystemFunctions = async (req, res) => {
  const data = await service.listSystemFunctions();
  res.json({ success: true, data });
};

const listAdministrators = async (req, res) => {
  const query = v.parse(v.listQuerySchema, req.query);
  const data = await service.listAdministrators(query);
  res.json({ success: true, data });
};

const getAdministrator = async (req, res) => {
  const { id } = v.parse(v.idParamSchema, req.params);
  const data = await service.getAdministrator(id);
  res.json({ success: true, data });
};

const createAdministrator = async (req, res) => {
  const body = v.parse(v.createAdminSchema, req.body);
  const data = await service.createAdministrator(body);
  res.status(201).json({ success: true, data });
};

const setAdministratorStatus = async (req, res) => {
  const { id } = v.parse(v.idParamSchema, req.params);
  const { status } = v.parse(v.updateStatusSchema, req.body);
  const data = await service.setAdministratorStatus(id, status, req.user.id);
  res.json({ success: true, data });
};

const setAdministratorPermissions = async (req, res) => {
  const { id } = v.parse(v.idParamSchema, req.params);
  const { functionIds } = v.parse(v.updatePermissionsSchema, req.body);
  const data = await service.setAdministratorPermissions(id, functionIds);
  res.json({ success: true, data });
};

module.exports = {
  getMe,
  listSystemFunctions,
  listAdministrators,
  getAdministrator,
  createAdministrator,
  setAdministratorStatus,
  setAdministratorPermissions,
};
