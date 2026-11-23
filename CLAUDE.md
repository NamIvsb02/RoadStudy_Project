# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

RoadStudy là website đăng ký và học trực tuyến (vai trò `STUDENT`, `TEACHER`, `ADMINISTRATOR`) có chatbot AI. Repo gồm hai project npm độc lập, không có workspace gốc: `BE_RStudy/` (Express 5 + Prisma 6 + PostgreSQL/Supabase, CommonJS) và `FE_RStudy/` (React 19 + Vite, JSX, Tailwind v4).

**`AGENTS.md` là tài liệu điều phối bắt buộc.** Đọc nó trước khi làm việc: giao tiếp và viết tài liệu bằng tiếng Việt, xin phép trước khi cài package / chạy migration / commit / push / tạo PR, không sửa chéo FE/BE khi nhiệm vụ chỉ thuộc một vùng.

## Tài liệu quy tắc

Đọc theo vùng làm việc:

- FE: `.agents/rules/frontend.md`, `FE_RStudy/docs/AI_RULES.md` (quy tắc cứng), `FE_RStudy/docs/specs/` (spec từng trang, mẫu `_TEMPLATE.md`), và `DESIGN_SYSTEM.md` + `design_system.json` (thư mục gốc) nếu là tác vụ giao diện.
- BE: `BE_RStudy/docs/02-quy-uoc-ky-thuat.md`, `03-quy-tac-nghiep-vu.md`, `enum.md`.
- `BE_RStudy/docs/api-spec.md` là nguồn chuẩn về endpoint cho cả hai bên. Mục 15 của file này liệt kê module nào chưa có tài liệu.
- Chung: `PRODUCT.md` (bối cảnh sản phẩm), `SETUP.md` (cài đặt), `BE_RStudy/docs/01-phan-cong-va-quy-trinh.md` (quy trình Git, database).
- Animation: mặc định không animation, trừ scroll-reveal cho các section chính của trang nội dung (đã chốt, chi tiết ở mục 4 `AI_RULES.md`) và lắc chuông thông báo. Mobile-first, tôn trọng `prefers-reduced-motion`.

## Lệnh

Backend (`cd BE_RStudy`, cần `.env` có `DATABASE_URL`, `DIRECT_URL`, `JWT_ACCESS_SECRET`, cấu hình AI/mail):

- `npm run dev`: chạy nodemon `src/app.js`, cổng `PORT` (mặc định 5000), kiểm tra sống tại `GET /health`
- `npm run db:generate`: chạy prisma generate sau khi sửa `prisma/schema.prisma`
- `npm run db:migrate` / `npx prisma db seed`: tạo migration / seed. **Phải xin phép trước.** Prisma CLI đọc `prisma.config.ts` và dùng `DIRECT_URL`. Cả nhóm dùng chung **một database Supabase**: chỉ Nam sửa schema và chạy migration, người khác sau khi pull chỉ chạy `npx prisma generate`. Không bao giờ chạy `migrate reset` hay seed lại khi chưa được duyệt.
- `npm test` chỉ là stub. Test là script Node gọi HTTP vào **server đang chạy** và DB thật: bật `npm run dev` trước, rồi chạy từng file, ví dụ `node tests/exam.test.js` (in ra PASS/FAIL). `node tests/ai-check.js` kiểm tra kết nối nhà cung cấp AI.
  - `tests/helpers/auth.js` tạo access token hợp lệ, không cần đăng nhập OTP. Một số test cũ (`category`, `comment`, `course`, `course.public`) vẫn gửi header `x-dev-role` mà `authMiddleware` không còn hỗ trợ, nên các route cần xác thực trong những test này có thể lỗi.
  - Tài khoản seed dùng chung mật khẩu `Password123!`: `leader@`, `admin@`, `teacher@`, `student@roadstudy.vn`.

Frontend (`cd FE_RStudy`, cần `VITE_API_URL` (vd `http://localhost:5000/api`) và `VITE_ASSET_URL`):

- `npm run dev`, `npm run build`, `npm run lint` (chạy lint trước khi báo xong). FE chưa có test.

## Kiến trúc backend

- Mỗi module (auth, account, teacher, admin, category, course, resource, enrollment, coupon, invoice, review, comment, exam, submission, chatbot, recommendation, report, notification, learning) có đủ 5 file: `routes/` → `controllers/` → `services/` → `repositories/` + `validators/`. Controller chỉ nhận req/res. Toàn bộ nghiệp vụ nằm ở service và báo lỗi bằng `throw new AppError(msg, status)`. Repository chỉ chứa lệnh Prisma. Tất cả route được mount ở `/api/<module>` trong `src/app.js`.
- Tên module khác tên bảng Prisma: coupon=`DiscountCode`, enrollment=`CourseRegistration`, submission=`ExamAttempt`, report=`ViolationReport`, chatbot=`AiConversation`/`AiMessage`, recommendation=`CourseRecommendation`, admin=`Administrator`+`SystemFunction`+`PermissionAssignment`, invoice=`Invoice`+`SupportRequest` (yêu cầu hoàn tiền), learning=`CourseLearning`+`CourseSession`.
- Phân quyền có hai tầng, gắn ở route:
  1. `authenticate` (JWT Bearer, gán `req.user = {id, role}`) rồi `authorize(...roles)`.
  2. Với admin, thêm `requireAdmin` / `requirePermission(PERMISSIONS.X)` / `requireLeader` (`middlewares/permissionMiddleware.js`). Các middleware này nạp `req.admin = {id, isLeader, permissions}` từ DB. Leader bỏ qua mọi kiểm tra quyền. Có 8 quyền, tên nằm ở `src/constants/permissions.js` và phải trùng với `functionName` trong DB. Route dùng chung cho giáo viên và admin chỉ kiểm tra quyền khi là admin (xem `examRoutes.js`, `learningRoutes.js`).
- Giáo viên `CHO_DUYET` / `TU_CHOI` bị chặn 403 ở cả `login` lẫn `refresh` (`assertTeacherApproved`).
- Thông báo trên chuông: gọi các hàm `notify*` trong `services/notificationService.js` sau khi nghiệp vụ thành công. Các hàm này tự nuốt lỗi. Danh sách loại thông báo ở `enum.md`.
- Response luôn có dạng `formatResponse(success, data, message)` → `{ success, message, data }`. Danh sách phải phân trang (`utils/pagination.js`) và trả về `data.items` + `data.pagination`. Express 5 tự chuyển lỗi async sang `errorHandler`, và `errorHandler` đã ánh xạ lỗi Prisma (P2002→409, P2003→400, P2025→404).
- Quy ước dữ liệu: tiền (Decimal) trả dạng chuỗi; xóa mềm bằng trường `status` (ví dụ `HOAT_DONG`), không xóa cứng; quan hệ Prisma dùng `onDelete: Restrict`; không bao giờ trả `passwordHash`.
- AI (`src/config/ai.js`): chọn nhà cung cấp qua `AI_PROVIDER`. `gemini` dùng `GEMINI_API_KEY`. `openai` dùng mọi API tương thích OpenAI (Groq mặc định) với `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`. Chỉ chatbot gọi AI (`generateJson` trong `recommendationService.recommend`). Khối "Dành cho bạn" (`GET /recommendation/me`) không gọi AI.
- Upload qua multer (`uploadMiddleware.js`) và được phục vụ tĩnh tại `/uploads/{avatars,covers,resources}`. DB lưu đường dẫn tương đối. Minh chứng thanh toán lưu ở `uploads/proofs` và **không** được phục vụ công khai.

## Kiến trúc frontend

- `src/api/axiosClient.js` trả thẳng `response.data` (tức `{success, message, data}`), tự gắn Bearer token, và tự refresh khi gặp 401 (gom các lần refresh đồng thời thành một). Nếu refresh thất bại, nó phát sự kiện `auth:logout`. Không xử lý 401 trong trang. Mỗi module BE có một file `src/api/<module>Api.js`; component không gọi axios trực tiếp.
- `AuthContext` gọi `/auth/me`. Với ADMINISTRATOR, nó gọi thêm `/admin/me` và gộp `isLeader` + `permissions` vào `account`. Component đọc các giá trị này qua `useAuth()`, không đụng localStorage (đã có `utils/tokenStorage`).
- Định tuyến nằm ở `src/routes/AppRoutes.jsx`, với các guard `ProtectedRoute` (role), `PermissionRoute` và `LeaderRoute`, và các layout `Layout` / `AuthLayout` / `ManageLayout` (khu quản trị/giáo viên) / `ExamLayout`. Dùng hằng `ROUTES`, `ROLES`, `PERMISSIONS` từ `src/constants/`, không viết cứng chuỗi. Khi thêm trang, chỉ thêm 1 dòng vào `AppRoutes.jsx` và 1 hằng vào `routes.js`.
- Chỉ dùng icon `lucide-react` và animation `framer-motion` với preset trong `src/constants/motion.js`. Form dùng react-hook-form + zod. Server state dùng TanStack Query (`src/lib/queryClient.js`). Text giao diện bằng tiếng Việt.
- Ảnh/file upload: dùng `assetUrl(path)` trong `src/utils/format.js`, không tự ghép với `VITE_ASSET_URL`. Ảnh bìa khóa học luôn qua `components/common/CourseCover`. Ảnh minh chứng cần token nên tải dạng blob qua `hooks/useProofImage` / `components/common/ProofImage`, không đặt vào `<img src>`.
- Thời gian BE trả ISO UTC, hiển thị theo giờ Việt Nam bằng các hàm dayjs trong `utils/format.js` (`formatDate`, `formatDateTime`, `timeAgo`). Tiền chuyển sang số khi tính và định dạng VND bằng `formatVND`.
- Màu lấy từ token trong `src/assets/styles/theme.css`, không ghi mã màu trực tiếp. Menu khu quản lý và quyền ứng với từng mục nằm ở `src/components/manage/manageNav.js`.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:

- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. When the answer is under a Markdown heading, `graphify section "<heading>"` prints that section's text, so the .md need not be opened. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
