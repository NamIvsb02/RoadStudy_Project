const { z } = require("zod");

const unknownKeysError = (issue) =>
    issue.code === "unrecognized_keys" ? `Không được gửi các trường: ${issue.keys.join(", ")}` : undefined;

const createEnrollmentSchema = z
    .object(
        {
            courseId: z.string().trim().min(1, "Thiếu courseId"),
            discountCode: z.string().trim().min(1).max(50).optional(),
        },
        { error: unknownKeysError }
    )
    .strict();

module.exports = { createEnrollmentSchema };