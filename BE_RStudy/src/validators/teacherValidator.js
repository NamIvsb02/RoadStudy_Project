const { z } = require("zod");

const updateApprovalSchema = z.strictObject({
  approvalStatus: z.enum(["DA_DUYET", "TU_CHOI"]),
});

module.exports = { updateApprovalSchema };
