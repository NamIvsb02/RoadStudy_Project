---
paths:
  - "FE_RStudy/**"
---

# Quy ước frontend

React 19 + Vite (JSX, không TypeScript), Tailwind CSS v4 (plugin `@tailwindcss/vite`, không có `tailwind.config.js`), React Router 7, Axios, TanStack Query 5, react-hook-form + zod, dayjs (locale `vi`), `lucide-react`, `framer-motion`, `lightswind-ui`. **Không thêm thư viện UI, icon, animation khác.**

Giao diện, màu, animation: `design.md` + `DESIGN_SYSTEM.md`. Phân quyền: `security.md`.

## Quy tắc cứng

1. Chỉ làm đúng phần trong spec. Không tự thêm trang, tính năng, nút, icon, hiệu ứng.
2. Thêm trang: đúng **1 dòng** trong `src/routes/AppRoutes.jsx` và **1 hằng** trong `src/constants/routes.js`, không đụng dòng người khác.
3. Không viết cứng chuỗi: đường dẫn dùng `ROUTES`, vai trò `ROLES`, quyền `PERMISSIONS`, trạng thái `STATUS_MAPS` (`src/constants/`).
4. Component không gọi axios trực tiếp. Mọi request đi qua `src/api/<module>Api.js`.
5. Không `console.log`, comment thừa, code chết. Không dữ liệu giả khi API đã có; API chưa có thì ghi `// TODO: nối API` và hỏi.
6. Biến môi trường chỉ đọc qua `import.meta.env.VITE_*`. Không đọc, in, sửa file `.env`.
7. Text giao diện tiếng Việt; tên biến, hàm, file tiếng Anh.

## Cấu trúc `src/`

| Thư mục               | Nội dung                                                                                                                         |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `api/`                | `axiosClient.js` + một file `<module>Api.js` mỗi module BE, export object `<module>Api`                                          |
| `assets/styles/`      | `theme.css` (design token)                                                                                                       |
| `components/ui/`      | Thành phần nhỏ: `Button`, `FormField`, `TextField`, `Switch`, `StatusBadge`, `Toast`...                                          |
| `components/common/`  | Thành phần ghép: `CourseCover`, `ProofImage`, `ConfirmDialog`, `NoteDialog`, `NotificationBell`, `DashboardPanel`, `StatCard`... |
| `components/manage/`  | `manageNav.js`: menu khu quản lý và quyền của từng mục                                                                           |
| `components/chatbot/` | Khung chat AI                                                                                                                    |
| `components/*.jsx`    | Layout (`Layout`, `AuthLayout`, `ManageLayout`, `ExamLayout`) và guard (`ProtectedRoute`, `PermissionRoute`, `LeaderRoute`)      |
| `constants/`          | `routes`, `roles`, `permissions`, `statuses`, `motion`, `siteInfo`                                                               |
| `context/`            | `AuthContext`, `ToastContext`                                                                                                    |
| `hooks/`, `lib/`      | Hook `useXxx.js`; `queryClient.js`                                                                                               |
| `pages/`              | `auth/`, `student/`, `teacher/`, `admin/`... trang dùng chung nhiều vai trò để ở gốc                                             |
| `utils/`              | `format.js` (`assetUrl`, tiền, ngày giờ), `permission.js`, `tokenStorage.js`                                                     |

- Component dùng ở ≥ 2 trang → `components/`; chỉ 1 trang → để cạnh trang đó. Kiểm tra `components/ui` và `components/common` trước khi tạo mới, không tạo bản trùng chức năng.
- Một file một component, PascalCase trùng tên. Thư mục con trong `pages/` số ít (`pages/admin/course`), file trang số nhiều (`AdminCoursesPage.jsx`).
- Function component + hooks. Component quá ~150 dòng thì tách.

## Gọi API

- Giá trị enum, nhãn, tông màu trạng thái và loại thông báo: `BE_RStudy/docs/enum.md`. `STATUS_MAPS` trong `src/constants/statuses.js` phải khớp file này; trạng thái chưa có trong `enum.md` thì hỏi, không tự đặt.
- Nguồn chuẩn endpoint: `BE_RStudy/docs/api-spec.md`. Đọc method, URL, body, response, lỗi, vai trò trước khi viết hàm. Endpoint chưa có trong spec → `// TODO: nối API` và hỏi.
- `axiosClient` trả thẳng `{ success, message, data }`, tự gắn Bearer, tự refresh khi 401 (gom refresh đồng thời), phát `auth:logout` khi refresh thất bại. Trang không tự xử lý 401.
- Danh sách: `data.items` + `data.pagination`. Lỗi hiển thị `err.message` từ BE, không tự bịa.
- Server state dùng TanStack Query; `queryFn` / `mutationFn` gọi hàm trong `src/api/`.
- Form dùng react-hook-form + zod. Mọi form/danh sách có đủ loading, empty, error. Nút gọi API phải `disabled` + loading.

## Auth và phân quyền

- Người dùng hiện tại qua `useAuth()` (`account`, `login`, `logout`, `updateAccount`). Không đụng `localStorage`. Chuyển trang theo vai trò bằng `ROLE_HOME`.
- `AuthContext` gọi `/auth/me`; ADMINISTRATOR gọi thêm `/admin/me` và gộp `isLeader`, `permissions` vào `account`. Component không tự gọi `/admin/me`.
- Kiểm tra quyền bằng `hasPermission(account, PERMISSIONS.X)` và `isLeader(account)` trong `utils/permission.js`. Mục "Phân quyền" chỉ dùng `isLeader`.
- Trang riêng vai trò bọc `<ProtectedRoute allowedRoles={[ROLES.X]}>`; trang admin cần quyền dùng `PermissionRoute`, thiếu quyền chuyển trang 403 (không đăng xuất). 403 từ API: hiện "Bạn không có quyền thực hiện chức năng này", giữ phiên.
- Màn gán quyền lấy danh sách từ `GET /admin/system-functions`, gửi `PUT /admin/administrators/:id/permissions` với mảng `functionIds` (ghi đè toàn bộ).
- Đăng nhập chỉ hiển thị `err.message` của BE; FE không tự kiểm tra `approvalStatus` của giáo viên.

## Dữ liệu hiển thị

- Đường dẫn upload là tương đối: dùng `assetUrl(path)`, không tự ghép `VITE_ASSET_URL`.
- Ảnh bìa khóa học luôn qua `components/common/CourseCover`.
- Ảnh minh chứng cần token: dùng `hooks/useProofImage` / `components/common/ProofImage` (tải blob), không đặt vào `<img src>`.
- Thời gian BE trả ISO UTC; hiển thị giờ Việt Nam bằng `formatDate`, `formatDateTime`, `timeAgo` trong `utils/format.js`, không tự format trong component.
- Tiền là chuỗi: chuyển số khi tính, hiển thị bằng `formatVND`.

## Quy tắc giao diện đã chốt

- Mọi trang và bộ lọc liên quan khóa học có nút **Tất cả** đứng đầu.
- Nút **Nộp bài** `disabled` tới khi trả lời đủ mọi câu (chỉ chặn ở FE; tự nộp khi hết giờ vẫn được).

## Spec trang

- Spec của trang/component được giao nằm trong yêu cầu của task (kèm ảnh thiết kế nếu có), viết theo mẫu dưới. Không lưu spec thành file trong repo.
- Đọc spec và ảnh trước khi làm. Spec thiếu icon, hiệu ứng, API, trạng thái thì hỏi, không đoán.
- Không có spec thì chỉ làm đúng phần được mô tả trong yêu cầu và theo `DESIGN_SYSTEM.md`.

```markdown
# <Tên component / trang>

- Vị trí file: src/...
- Role truy cập: STUDENT | TEACHER | ADMINISTRATOR (quyền nếu là admin)
- Ảnh thiết kế: <đính kèm trong task, nếu có>

## Mục đích

(1-2 câu)

## Thành phần & chức năng

| Thành phần | Chức năng | API gọi | Ghi chú |
| ---------- | --------- | ------- | ------- |

## Nút / hành động

| Nút | Icon (lucide) | Hành động | Trạng thái (loading/disabled) |
| --- | ------------- | --------- | ----------------------------- |

## Hiệu ứng (chỉ liệt kê cái được duyệt)

| Phần tử | Hiệu ứng | Thời lượng |
| ------- | -------- | ---------- |

## Trạng thái giao diện

- Loading:
- Empty:
- Error:

## Validate / thông báo
```
