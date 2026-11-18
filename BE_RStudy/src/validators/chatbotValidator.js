const { z } = require("zod");

const unknownKeysError = (issue) =>
    issue.code === "unrecognized_keys" ? `Không được gửi các trường: ${issue.keys.join(", ")}` : undefined;

const sendMessageSchema = z
    .object(
        {
            conversationId: z.string().trim().min(1, "conversationId không hợp lệ").optional(),
            content: z.string().trim().min(1, "Vui lòng nhập nội dung tin nhắn").max(500, "Tin nhắn tối đa 500 ký tự"),
        },
        { error: unknownKeysError }
    )
    .strict();

module.exports = { sendMessageSchema };