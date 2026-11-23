# RoadStudy — Hướng dẫn cài đặt & chạy dự án

Dự án **RoadStudy** gồm 3 thành phần, hiện chạy trực tiếp bằng Node.js trên máy (chưa dùng Docker):

| Thành phần      | Công nghệ                                  | URL                            |
| --------------- | ------------------------------------------ | ------------------------------ |
| **Database**    | PostgreSQL (Supabase) + Prisma             | _(dùng chuỗi `DATABASE_URL`)_  |
| **Backend API** | Node.js + Express 5 (CommonJS)             | http://localhost:5000          |
| **Frontend**    | React + Vite (JSX) + Tailwind CSS 4        | http://localhost:5173          |

---

## Mục lục

- [Yêu cầu](#1-yêu-cầu)
- [Cài đặt lần đầu](#2-cài-đặt-lần-đầu)
- [Chạy & dừng dự án](#3-chạy--dừng-dự-án)
- [Các URL quan trọng](#4-các-url-quan-trọng)
- [Quản lý migrations](#5-quản-lý-migrations-khi-đổi-schema)
- [Cấu trúc dự án](#6-cấu-trúc-dự-án)
- [Quy ước nhóm](#7-quy-ước-nhóm)

---

## 1. Yêu cầu

| Công cụ | Kiểm tra           | Ghi chú                          |
| ------- | ------------------ | -------------------------------- |
| Git     | `git --version`    |                                  |
| Node.js | `node --version`   | Nhóm đang dùng v24.x             |
| npm     | `npm --version`    |                                  |

> Database nằm trên Supabase, **không cần** cài PostgreSQL trên máy. Hỏi Nam để được cấp chuỗi kết nối.

---

## 2. Cài đặt lần đầu

### Bước 1 — Clone repo

```bash
git clone <repo-url>
cd RoadStudy
```

Repo chứa cả hai thư mục `BE_RStudy/` và `FE_RStudy/`.

### Bước 2 — Backend

```bash
cd BE_RStudy
npm install
cp .env.example .env
```

Mở `.env` và điền giá trị thật. Các nhóm biến cần có (tên chính xác xem trong `.env.example`):

| Nhóm        | Nội dung                                                         |
| ----------- | ---------------------------------------------------------------- |
| Database    | `DATABASE_URL` (qua pooler, app dùng) và `DIRECT_URL` (kết nối trực tiếp, Prisma CLI dùng cho migrate/seed). Cả nhóm dùng chung **một project Supabase**, Nam cấp hai chuỗi này |
| JWT         | Khóa bí mật cho access token (15 phút) và refresh token (7 ngày) |
| SMTP        | Tài khoản gửi mail OTP (Gmail + app password)                    |
| AI          | `AI_PROVIDER`; `gemini` dùng `GEMINI_API_KEY`, `GEMINI_MODEL`; `openai` (mặc định Groq) dùng `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL` |

> `.env.example` hiện chưa có `DIRECT_URL`, `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`. Nếu thiếu, tự thêm các dòng này vào `.env`.

> **Không commit `.env`** và **không dán nội dung `.env` / `DATABASE_URL` / `DIRECT_URL` vào chat hay tài liệu** — file này đã được `.gitignore` bỏ qua.

Sinh Prisma Client:

```bash
npx prisma generate
npx prisma migrate status   # kiểm tra DB chung đã có đủ migration
```

Database dùng chung **đã được Nam migrate và seed sẵn**, nên **không** chạy `npx prisma migrate dev` hay `npx prisma db seed`. Seed lại sẽ ghi đè dữ liệu của cả nhóm.

### Bước 3 — Frontend

```bash
cd ../FE_RStudy
npm install
cp .env.example .env
```

Nội dung `.env` của FE:

```dotenv
VITE_API_URL=http://localhost:5000/api
VITE_ASSET_URL=http://localhost:5000
```

### Tài khoản mẫu (sau khi seed)

| Vai trò               | Email                  |
| --------------------- | ---------------------- |
| Quản trị viên trưởng  | leader@roadstudy.vn    |
| Quản trị viên thường  | admin@roadstudy.vn     |
| Giáo viên (đã duyệt)  | teacher@roadstudy.vn   |
| Học viên              | student@roadstudy.vn   |

Mật khẩu chung của dữ liệu mẫu: `Password123!` (chỉ dùng khi phát triển, **đổi trước khi demo**).

> Khi gõ mật khẩu có dấu `!` trong Git Bash, chạy `set +H` trước để bash không diễn giải `!`.

---

## 3. Chạy & dừng dự án

Mở **2 terminal** riêng.

### Backend

```bash
cd BE_RStudy
npm run dev
```

### Frontend

```bash
cd FE_RStudy
npm run dev
```

### Dừng

Nhấn `Ctrl + C` ở từng terminal.

### Kiểm tra Backend sống

Mở http://localhost:5000/health.

### Chạy test Backend

Test là script Node gọi HTTP vào server đang chạy và DB thật (`npm test` chỉ là stub). Bật `npm run dev` trước, rồi chạy từng file:

```bash
cd BE_RStudy
node tests/exam.test.js      # in ra PASS/FAIL
node tests/ai-check.js       # kiểm tra kết nối dịch vụ AI
```

`tests/helpers/auth.js` tạo sẵn access token hợp lệ, không cần đăng nhập qua OTP.

### Reset dữ liệu mẫu

**Không tự chạy** `npx prisma migrate reset` hay `npx prisma db seed`. Hai lệnh này xóa hoặc ghi đè dữ liệu trên database Supabase dùng chung của cả nhóm. Cần reset thì báo Nam.

---

## 4. Các URL quan trọng

| URL                              | Mô tả                      |
| -------------------------------- | -------------------------- |
| http://localhost:5173            | Frontend (React)           |
| http://localhost:5000/api        | Gốc của Backend API        |
| http://localhost:5000/health     | Kiểm tra Backend sống      |
| http://localhost:5000/uploads/…  | Ảnh tĩnh (avatar, bìa khóa học, tài liệu) |

> Ảnh minh chứng thanh toán (`uploads/proofs`) **không** được phục vụ công khai; chỉ truy cập qua API có kiểm tra quyền.

Tài liệu Backend trong `BE_RStudy/docs/`: `api-spec.md` (API), `enum.md` (trạng thái, loại thông báo), `01-phan-cong-va-quy-trinh.md`, `02-quy-uoc-ky-thuat.md`, `03-quy-tac-nghiep-vu.md`.

---

## 5. Quản lý migrations (khi đổi schema)

**Chỉ Nam sửa `schema.prisma`.** Người khác cần đổi schema thì báo Nam.

### Quy trình của người sửa schema

```bash
cd BE_RStudy
npx prisma format
npx prisma migrate dev --name <ten_migration>
```

Lệnh này áp migration lên database chung. Sau đó commit thư mục `prisma/migrations/` cùng `schema.prisma` và báo cả nhóm.

### Thành viên còn lại khi pull code mới

```bash
cd BE_RStudy
npm install
npx prisma generate
```

Kiểm tra `.env` đủ biến so với `.env.example`. Migration đã được áp lên DB chung khi Nam chạy, nên chỉ cần sinh lại Prisma Client. **Không** tự chạy `migrate dev`.

### Kiểm tra trạng thái migrations

```bash
npx prisma migrate status
```

---

## 6. Cấu trúc dự án

```text
RoadStudy/
├── BE_RStudy/
│   ├── .env.example              # Mẫu biến môi trường — copy thành .env
│   ├── docs/                     # 01-…, 02-…, 03-…, api-spec.md, enum.md
│   ├── prisma/                   # schema.prisma, migrations/, seed.js
│   ├── tests/                    # Test tích hợp
│   ├── uploads/                  # Tệp tải lên (avatars, covers, resources, proofs)
│   └── src/
│       ├── app.js                # Cấu hình Express, mount các module
│       ├── config/               # database, mail, ai
│       ├── constants/            # permissions, errorCodes
│       ├── middlewares/          # auth, permission, upload, validate, errorHandler
│       ├── utils/                # AppError, response, jwt, hash, pagination
│       └── routes|controllers|services|repositories|validators/
│                                 # Mỗi module một file ở mỗi tầng
│
└── FE_RStudy/
    ├── .env.example
    ├── docs/                     # AI_RULES.md, specs/ (spec từng trang)
    └── src/
        ├── api/                  # Gọi API (axios), mỗi module một file *Api.js
        ├── assets/               # Ảnh, styles/theme.css (design tokens)
        ├── components/           # ui/ và common/
        ├── constants/            # ROUTES, ROLES, motion
        ├── context/              # AuthContext
        ├── hooks/
        ├── pages/                # auth, student, teacher, admin, …
        ├── routes/               # AppRoutes
        └── utils/
```

### Các module Backend

19 module: `auth`, `account`, `teacher`, `admin`, `category`, `course`, `resource`, `enrollment`, `coupon`, `invoice`, `review`, `comment`, `exam`, `submission`, `chatbot`, `recommendation`, `report`, `notification`, `learning`.

Hệ thống thiết kế giao diện nằm ở thư mục gốc: `DESIGN_SYSTEM.md`, `design_system.json`.

### Stack Backend

| Package                      | Mục đích                          |
| ---------------------------- | --------------------------------- |
| Express 5                    | Web framework                     |
| Prisma + PostgreSQL          | ORM + database                    |
| zod                          | Kiểm tra dữ liệu đầu vào          |
| jsonwebtoken + bcrypt        | Xác thực và mã hóa mật khẩu       |
| multer                       | Tải tệp lên                       |
| nodemailer                   | Gửi mail OTP                      |
| helmet, cors, morgan         | Bảo mật, CORS, log request        |

### Stack Frontend

| Package                          | Mục đích                          |
| -------------------------------- | --------------------------------- |
| React + Vite (JSX)               | UI framework + bundler            |
| Tailwind CSS 4                   | CSS tiện ích (tokens ở `theme.css`) |
| react-router-dom                 | Định tuyến                        |
| axios                            | HTTP client (chỉ qua `src/api`)   |
| react-hook-form + zod            | Form và kiểm tra dữ liệu          |
| @tanstack/react-query, dayjs     | Quản lý dữ liệu server, xử lý ngày giờ |
| lucide-react                     | Bộ icon duy nhất                  |
| framer-motion                    | Bộ animation duy nhất             |

---

## 7. Quy ước nhóm

### Commit

- ✅ Commit: source code, `prisma/migrations/`, `.env.example`, tài liệu trong `docs/`
- ❌ Không commit: `.env`, `uploads/` (trừ file giữ chỗ), log, build output, khóa bí mật thật

### Schema database

- Chỉ Nam sửa `schema.prisma`; sau mỗi thay đổi: `format` → `migrate dev` → commit migration → báo nhóm. Người khác chỉ chạy `prisma generate`.
- Database Supabase dùng chung: không `migrate reset`, không seed lại khi chưa báo cả nhóm.
- Dùng trạng thái (status) thay vì xóa cứng dữ liệu đã có quan hệ.

### API

- API chưa có trong `BE_RStudy/docs/api-spec.md` thì **chưa tính là xong**; người viết API tự điền phần của mình.
- Route quản trị phải kiểm tra cả vai trò lẫn quyền (`authenticate` + `authorize` + `requirePermission`); ẩn nút ở FE không phải là bảo mật.
- Danh sách có phân trang; tiền (Decimal) trả về dạng chuỗi trong JSON.

### Đặt tên

- Backend: file camelCase kèm hậu tố tầng (`authController.js`); các mount route dùng dạng số ít (`/api/resource`, `/api/category`).
- Frontend: thư mục con số ít (`pages/admin/course`), file trang số nhiều; component dùng PascalCase.

### Frontend

- Gọi API chỉ qua `src/api/*Api.js`; đường dẫn qua `ROUTES`, vai trò qua `ROLES`.
- Icon chỉ dùng `lucide-react`, animation chỉ dùng `framer-motion` (preset trong `constants/motion.js`).
- Màu sắc lấy từ token trong `src/assets/styles/theme.css`; quy tắc chi tiết ở `docs/AI_RULES.md`.
- Mọi trang và bộ lọc liên quan khóa học đều có nút **Tất cả**.

### Nhánh làm việc

- Mỗi tính năng một nhánh `feature/<ten>`; tạo pull request vào `main`, không push thẳng.
- CodeRabbit tự review PR, người tạo PR sửa theo góp ý, sau đó Nam duyệt và merge.
- Phân công và deadline: xem file Excel công việc của nhóm.
