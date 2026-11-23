# Quy ước kỹ thuật

## Công nghệ

- Backend: Node v24, Express 5, Prisma 6.19, PostgreSQL trên Supabase (cả nhóm dùng chung một project), CommonJS (dùng `require`). Thư viện: bcrypt (không dùng bcryptjs), jsonwebtoken, zod, multer, nodemailer, helmet, morgan.
- Prisma: app kết nối bằng `DATABASE_URL` (pooler); Prisma CLI (`migrate`, `db seed`) đọc `prisma.config.ts` và dùng `DIRECT_URL` (kết nối trực tiếp). Thiếu `DIRECT_URL` thì migrate/seed lỗi.
- AI: `config/ai.js` chọn nhà cung cấp theo `AI_PROVIDER`. `gemini` dùng `GEMINI_API_KEY`, `GEMINI_MODEL`. `openai` dùng mọi dịch vụ tương thích OpenAI (mặc định Groq) với `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`. Không đặt `AI_PROVIDER` thì tự chọn `gemini` khi chỉ có `GEMINI_API_KEY`. Thời gian chờ `AI_TIMEOUT_MS` (mặc định 20 giây). Kiểm tra kết nối bằng `node tests/ai-check.js`.
- Frontend: React + Vite, react-router-dom, axios, Tailwind CSS, react-hook-form + zod.

## Cấu trúc backend

19 module: auth, account, teacher, admin, category, course, resource, enrollment, coupon, invoice, review, comment, exam, submission, chatbot, recommendation, report, notification, learning.

Mỗi module có 5 file: `routes/{module}Routes.js`, `controllers/{module}Controller.js`, `services/{module}Service.js`, `repositories/{module}Repository.js`, `validators/{module}Validator.js`.

| Lớp        | Việc của lớp                                           |
| ---------- | ------------------------------------------------------ |
| Route      | Gắn URL với controller, gắn validate và kiểm tra quyền |
| Controller | Nhận req/res, gọi service. Không chứa logic nghiệp vụ  |
| Service    | Toàn bộ logic nghiệp vụ, ném lỗi bằng AppError         |
| Repository | Chỉ thao tác Prisma, không có logic nghiệp vụ          |
| Validator  | Zod schema kiểm tra dữ liệu đầu vào                    |

Thứ tự viết code trong 1 module: Repository, Service, Controller, Route.

Tên module và tên bảng: coupon = DiscountCode, enrollment = CourseRegistration, submission = ExamAttempt, report = ViolationReport, chatbot = AiConversation/AiMessage, recommendation = CourseRecommendation, account = Account + Student, admin = Administrator + SystemFunction + PermissionAssignment, invoice = Invoice + SupportRequest (yêu cầu hoàn tiền), notification = Notification, learning = CourseLearning (link lớp, link Drive, bật/tắt mục bài thi) + CourseSession (lịch học).

## Đồ có sẵn, dùng luôn không viết lại

- `config/database.js`: PrismaClient
- `config/ai.js`: `generateJson({ system, prompt })` gọi AI và trả JSON, ném `AiError` khi lỗi hoặc hết thời gian chờ
- `utils/AppError.js`: `throw new AppError('thông báo', mã_http)`
- `utils/response.js`: `formatResponse(success, data, message)`
- `utils/pagination.js`: `getPagination`, `buildPaginationMeta`
- `utils/hash.js`, `utils/jwt.js`
- `middlewares/authMiddleware.js`: `authenticate`, `authorize('TEACHER', 'ADMINISTRATOR')`
- `middlewares/permissionMiddleware.js` (đặt sau `authenticate`):
  - `requireAdmin`: phải là admin đang hoạt động, gán `req.admin = { id, isLeader, permissions }`
  - `requireLeader`: chỉ quản trị viên trưởng
  - `requirePermission(PERMISSIONS.X, ...)`: admin có ít nhất một quyền trong danh sách. Leader luôn qua. Tên quyền lấy từ `constants/permissions.js`
  - Route vừa cho giáo viên vừa cho admin thì chỉ kiểm tra quyền khi là admin, ví dụ `(req, res, next) => (req.user.role === "ADMINISTRATOR" ? requirePermission(...)(req, res, next) : next())` (xem `examRoutes.js`, `learningRoutes.js`)
- `middlewares/uploadMiddleware.js`: `uploadAvatar` (trường `avatar`, ảnh, 2MB), `uploadCover` (trường `cover`, ảnh, 3MB), `uploadResource` (trường `file`, tài liệu, 10MB). Minh chứng thanh toán lưu ở `uploads/proofs` và **không** phục vụ công khai
- `middlewares/validateMiddleware.js`: `validate(zodSchema)` (mặc định kiểm tra body, `validate(schema, "params")` cho params)
- `middlewares/errorHandler.js`: đã tự xử lý lỗi Prisma (P2002 trả 409, P2003 trả 400, P2025 trả 404)
- `services/notificationService.js`: `notify(accountId, payload)`, `notifyStudent(studentId, …)`, `notifyTeacher(teacherId, …)`, `notifyCourseTeacher(courseId, …)`, `notifyCourseStudents(courseId, …)` (học viên `DA_THANH_TOAN`), `notifyAdmins(functionName, …)` (Leader và admin có quyền đó). `payload = { type, title, body?, link? }`. Các hàm này **tự nuốt lỗi** (chỉ ghi log), nên lỗi tạo thông báo không làm hỏng nghiệp vụ chính. Gọi sau khi nghiệp vụ đã thành công

## Định dạng response

Mọi API trả `{ success, message, data }`.

## Đăng nhập khi test API

Không còn đăng nhập giả. Gọi `POST /api/auth/login`, lấy `accessToken`, gửi kèm header `Authorization: Bearer <accessToken>`. Access token sống 15 phút (hết hạn thì đăng nhập lại hoặc gọi `POST /api/auth/refresh`), refresh token sống 7 ngày.

Vai trò: STUDENT, TEACHER, ADMINISTRATOR. Route của admin phải gắn cả `authenticate`, `authorize("ADMINISTRATOR")` và `requirePermission(PERMISSIONS.X)`, ví dụ `[authenticate, authorize("ADMINISTRATOR"), requirePermission(PERMISSIONS.QUAN_LY_KHOA_HOC)]`. Ẩn nút ở FE không thay cho bước này.

Script test trong `tests/` là script Node gọi HTTP vào server đang chạy: bật `npm run dev` trước rồi chạy `node tests/<tên>.test.js`. `tests/helpers/auth.js` tạo sẵn access token hợp lệ, không cần đăng nhập qua OTP.

Tài khoản mẫu (đã seed), mật khẩu chung `Password123!`: leader@roadstudy.vn, admin@roadstudy.vn, teacher@roadstudy.vn, student@roadstudy.vn (đuôi `@roadstudy.vn`).

## Quy ước khác

- Tiền (Decimal) trả về JSON dạng chuỗi.
- Mọi API danh sách phải phân trang.
- Không bao giờ trả `passwordHash` ra response.
- Upload file phải giới hạn loại và kích thước (multer).
- Dùng trường `status` thay vì xóa cứng. Prisma để `onDelete: Restrict`.
- Express 5 tự chuyển lỗi async sang errorHandler, không bắt buộc bọc try/catch.
- FE gọi API qua `VITE_API_URL` (mặc định `http://localhost:5000/api`).
