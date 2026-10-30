# Quy ước kỹ thuật

## Công nghệ

- Backend: Node v24, Express 5, Prisma 6.19, PostgreSQL, CommonJS (dùng `require`). Thư viện: bcrypt (không dùng bcryptjs), jsonwebtoken, zod, multer, nodemailer, helmet, morgan.
- Frontend: React + Vite, react-router-dom, axios, Tailwind CSS, react-hook-form + zod.

## Cấu trúc backend

17 module: auth, account, teacher, admin, category, course, resource, enrollment, coupon, invoice, review, comment, exam, submission, chatbot, recommendation, report.

Mỗi module có 5 file: `routes/{module}Routes.js`, `controllers/{module}Controller.js`, `services/{module}Service.js`, `repositories/{module}Repository.js`, `validators/{module}Validator.js`.

| Lớp        | Việc của lớp                                           |
| ---------- | ------------------------------------------------------ |
| Route      | Gắn URL với controller, gắn validate và kiểm tra quyền |
| Controller | Nhận req/res, gọi service. Không chứa logic nghiệp vụ  |
| Service    | Toàn bộ logic nghiệp vụ, ném lỗi bằng AppError         |
| Repository | Chỉ thao tác Prisma, không có logic nghiệp vụ          |
| Validator  | Zod schema kiểm tra dữ liệu đầu vào                    |

Thứ tự viết code trong 1 module: Repository, Service, Controller, Route.

Tên module và tên bảng: coupon = DiscountCode, enrollment = CourseRegistration, submission = ExamAttempt, report = ViolationReport, chatbot = AiConversation/AiMessage, recommendation = CourseRecommendation, account = Account + Student, admin = Administrator + SystemFunction + PermissionAssignment.

## Đồ có sẵn, dùng luôn không viết lại

- `config/database.js`: PrismaClient
- `utils/AppError.js`: `throw new AppError('thông báo', mã_http)`
- `utils/response.js`: `formatResponse(success, data, message)`
- `utils/pagination.js`: `getPagination`, `buildPaginationMeta`
- `utils/hash.js`, `utils/jwt.js`
- `middlewares/authMiddleware.js`: `authenticate`, `authorize('TEACHER', 'ADMINISTRATOR')`
- `middlewares/validateMiddleware.js`: `validate(zodSchema)`
- `middlewares/errorHandler.js`: đã tự xử lý lỗi Prisma (P2002 trả 409, P2003 trả 400, P2025 trả 404)

## Định dạng response

Mọi API trả `{ success, message, data }`.

## Đăng nhập khi test API

Không còn đăng nhập giả. Gọi `POST /api/auth/login`, lấy `accessToken`, gửi kèm header `Authorization: Bearer <accessToken>`. Access token sống 15 phút (hết hạn thì đăng nhập lại hoặc gọi `POST /api/auth/refresh`), refresh token sống 7 ngày.

Vai trò: STUDENT, TEACHER, ADMINISTRATOR. Hàm kiểm tra quyền chi tiết của admin (`requirePermission`) do Nam làm trong module Admin.

Tài khoản mẫu (đã seed), mật khẩu chung `Password123!`: leader@roadstudy.vn, admin@roadstudy.vn, teacher@roadstudy.vn, student@roadstudy.vn (đuôi `@roadstudy.vn`).

## Quy ước khác

- Tiền (Decimal) trả về JSON dạng chuỗi.
- Mọi API danh sách phải phân trang.
- Không bao giờ trả `passwordHash` ra response.
- Upload file phải giới hạn loại và kích thước (multer).
- Dùng trường `status` thay vì xóa cứng. Prisma để `onDelete: Restrict`.
- Express 5 tự chuyển lỗi async sang errorHandler, không bắt buộc bọc try/catch.
- FE gọi API qua `VITE_API_URL` (mặc định `http://localhost:5000/api`).
