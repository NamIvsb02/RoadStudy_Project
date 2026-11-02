const { z } = require('zod');

const MAX_CONTENT_LENGTH = 1000;

const content = z
  .string()
  .trim()
  .min(1, 'Nội dung không được để trống')
  .max(MAX_CONTENT_LENGTH, `Nội dung tối đa ${MAX_CONTENT_LENGTH} ký tự`);

const idField = (message) => z.string().min(1, message).max(36, message);

const courseIdParamSchema = z.object({ courseId: idField('Mã khóa học không hợp lệ') });
const idParamSchema = z.object({ id: idField('Mã bình luận không hợp lệ') });
const replyIdParamSchema = z.object({ replyId: idField('Mã phản hồi không hợp lệ') });


const contentBodySchema = z.object({ content });

module.exports = {
  MAX_CONTENT_LENGTH,
  courseIdParamSchema,
  idParamSchema,
  replyIdParamSchema,
  contentBodySchema,
};