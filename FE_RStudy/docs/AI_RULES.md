# AI_RULES.md

## 1. Stack

- React + Vite (JSX, không TypeScript)
- React Router (src/routes/AppRoutes.jsx)
- Axios (src/api/axiosClient.js)
- Auth qua src/context/AuthContext.jsx
- Icon: **chỉ dùng `lucide-react`**
- Animation: **chỉ dùng `framer-motion`** (import từ `framer-motion`)
- Styling: Tailwind CSS v4 (plugin @tailwindcss/vite, không có tailwind.config.js). Form: react-hook-form + zod
- Thư viện UI khác: "không dùng"

## 2. Quy tắc cứng

1. **Không cài thêm package** nếu chưa được hỏi và đồng ý.
2. **Chỉ làm đúng phần được giao** trong file spec. Không tự thêm trang, tính năng, nút.
3. **Không sửa file ngoài phạm vi** (đặc biệt: axiosClient, AuthContext, ProtectedRoute) trừ khi được yêu cầu. Ngoại lệ: mỗi trang chỉ được thêm đúng 1 dòng vào AppRoutes.jsx và 1 hằng vào routes.js, không đụng dòng người khác (đỡ conflict git khi làm song song)
4. Không viết cứng đường dẫn: dùng `ROUTES` từ `src/constants/routes.js`. Role dùng `ROLES`.
5. Không gọi axios trực tiếp trong component: mọi request đi qua `src/api/*.js`.
6. Không để `console.log`, code comment thừa, code chết.
7. Không dùng dữ liệu giả hardcode trong trang nếu API đã có. Nếu API chưa có, ghi rõ `// TODO: nối API` và hỏi.
8. Giao diện (text hiển thị) bằng tiếng Việt; tên biến/hàm/file bằng tiếng Anh.
9. Không tự git commit / push / đổi branch. Làm xong chỉ báo danh sách file đã tạo/sửa.
10. Biến môi trường chỉ đọc qua `import.meta.env.VITE_*`; không đọc, in hay sửa file .env.

## 3. Icon

- Chỉ import từ `lucide-react`, import theo tên: `import { Plus, Trash2 } from 'lucide-react'`.
- Không dùng emoji làm icon, không dùng bộ icon khác, không tự vẽ SVG.
- Icon nào dùng cho nút nào **phải ghi trong spec**. Spec không ghi thì không thêm icon.
- Kích thước thống nhất: 16 (trong nút/text), 20 (mặc định), 24 (tiêu đề/empty state).

## 4. Animation / hiệu ứng

- Thư viện duy nhất: `framer-motion`. Không dùng GSAP, anime.js, AOS, react-spring hay CSS keyframes tự viết cho hiệu ứng.
- **Mặc định: không animation.** Chỉ làm hiệu ứng có ghi trong spec (phần tử nào, hiệu ứng gì, bao lâu).
- Hover/focus nhẹ của nút, link, input dùng CSS `transition` 150–200ms, không cần framer-motion.
- Dùng chung các preset trong `src/constants/motion.js` (fadeIn, slideUp, stagger...), không tự bịa thông số mới trong từng component.
- Thời lượng: 0.15–0.4s, easing `easeOut`. Không dùng spring nảy (bouncy), không `repeat: Infinity`.
- Cấm: bounce, shake, pulse, gradient chuyển động, parallax, animation tự chạy khi load trang nếu spec không yêu cầu.
- Chỉ animate `opacity` và `transform` (x, y, scale), không animate width/height/top/left.
- Dùng `AnimatePresence` cho modal/toast/dropdown khi mount-unmount; danh sách dài (>20 item) không stagger.
- Tôn trọng `prefers-reduced-motion` (dùng `useReducedMotion` hoặc `MotionConfig reducedMotion="user"` bọc ở gốc app).
- Ngoại lệ: spinner = icon `Loader2` của lucide + class `animate-spin` của Tailwind.

## 5. Cấu trúc thư mục

```
docs/
  AI_RULES.md
  specs/          spec từng trang (copy từ _TEMPLATE.md)
  design/         ảnh thiết kế
src/
  api/            gọi backend (authApi, axiosClient, ...)
  assets/         images/, icons/
  components/
    ui/           thành phần nhỏ tái sử dụng (Button, Input, Modal...)
    common/       thành phần ghép dùng chung nhiều trang
    Layout.jsx, ProtectedRoute.jsx
  constants/      routes.js, roles.js, motion.js
  context/        AuthContext
  hooks/          custom hooks (useXxx)
  pages/
    auth/         đăng nhập, đăng ký, quên mật khẩu...
    teacher/      trang riêng giáo viên
    student/      trang riêng học sinh
    admin/        trang riêng quản trị viên
    (gốc)         trang dùng chung nhiều role: HomePage, ProfilePage...
  routes/         AppRoutes.jsx
  utils/          hàm tiện ích thuần, tokenStorage
```

- Component dùng ở ≥2 trang → `components/`. Chỉ dùng 1 trang → để cạnh trang đó.
- Một file một component, tên file PascalCase trùng tên component. Hook: `useXxx.js`.

## 6. Quy ước code

- Function component + hooks, không class component.
- Mỗi component tối đa ~150 dòng; dài hơn thì tách.
- Mọi form/danh sách phải có đủ trạng thái: loading, empty, error.
- Nút gọi API phải có `disabled` + trạng thái loading để tránh bấm đúp.
- Thông báo lỗi lấy từ response backend, không tự bịa message.
- Giao diện responsive theo spec; không tự đổi layout so với ảnh thiết kế.

## 7. Quy trình làm việc

1. Đọc spec của trang/component được giao và ảnh thiết kế đính kèm.
2. Nếu spec thiếu thông tin (icon, hiệu ứng, API) → **hỏi, không đoán**.
3. Code đúng phạm vi, báo lại danh sách file đã tạo/sửa.
4. Chạy `npm run lint` trước khi báo xong.

## 8. API (Backend) và đăng nhập

- Nguồn sự thật về endpoint: `../BE_RStudy/docs/api-spec.md` (FE_RStudy và BE_RStudy nằm cạnh nhau trong repo). Không đọc được thì yêu cầu người dùng dán/đính kèm, không tự đoán.
- Trước khi viết hàm gọi API: đọc api-spec để lấy đúng method, URL, body, response, mã lỗi, role được gọi. Endpoint chưa có hoặc chưa tick [x] → ghi `// TODO: nối API` và hỏi.
- Mỗi module BE một file `src/api/<module>Api.js`, export object `<module>Api` (xem authApi.js), mỗi hàm một request. Kiểm tra `src/api/` trước để không tạo hàm trùng.
- Hàm api trả về `{ success, message, data }`. Danh sách phân trang: `data.items` + `data.pagination`. Lỗi hiển thị lấy từ `err.message` (axiosClient đã chuẩn hóa).
- Không tự xử lý 401 / refresh token trong trang hay component; axiosClient lo.
- Người dùng hiện tại lấy qua `useAuth()` (`account`, `login`, `logout`, `updateAccount`). Không đọc/ghi localStorage trực tiếp. Chuyển trang theo role bằng `ROLE_HOME`.
- Đường dẫn file upload (avatarUrl...) là đường dẫn tương đối: ghép với `import.meta.env.VITE_ASSET_URL`.
- Tiền (Decimal) BE trả dạng chuỗi: ép số khi tính, định dạng VND khi hiển thị. Thời gian là ISO UTC: hiển thị giờ Việt Nam.
- Trang riêng của role nào thì đặt trong `<ProtectedRoute allowedRoles={[ROLES.X]}>`.

## Phân quyền admin ở FE

- Sau khi đăng nhập hoặc mở lại app, AuthContext gọi `GET /api/auth/me`. Nếu `role` là ADMINISTRATOR thì gọi thêm `GET /api/admin/me` và gộp `isLeader`, `permissions` vào `account`. Component chỉ đọc `account.isLeader` và `account.permissions` qua `useAuth()`, không tự gọi `/admin/me`.
- Ẩn hiện menu, nút theo quyền chỉ để giao diện gọn. BE mới là nơi chặn thật, FE không được coi việc ẩn nút là bảo mật.
- Tên quyền khai báo một chỗ duy nhất trong `src/constants/permissions.js`, trùng đúng với `functionName` của BE. Không gõ chuỗi quyền trực tiếp trong component.

```javascript
export const PERMISSIONS = {
  QUAN_LY_KHOA_HOC: "QUAN_LY_KHOA_HOC",
  QUAN_LY_TAI_KHOAN: "QUAN_LY_TAI_KHOAN",
  QUAN_LY_MA_GIAM_GIA: "QUAN_LY_MA_GIAM_GIA",
  QUAN_LY_BAI_THI: "QUAN_LY_BAI_THI",
  XU_LY_BAO_CAO_VI_PHAM: "XU_LY_BAO_CAO_VI_PHAM",
  XU_LY_HOAN_TIEN: "XU_LY_HOAN_TIEN",
};
```

- Kiểm tra quyền bằng một hàm duy nhất trong `src/utils/permission.js`, dùng lại ở menu, route guard và nút:

```javascript
export const hasPermission = (user, name) =>
  user?.role === "ADMINISTRATOR" &&
  (user.isLeader === true || user.permissions?.includes(name) === true);
```

- Map menu admin với quyền:

| Mục menu                  | Điều kiện hiện                                        |
| ------------------------- | ----------------------------------------------------- |
| Khóa học, danh mục        | `QUAN_LY_KHOA_HOC`                                    |
| Tài khoản                 | `QUAN_LY_TAI_KHOAN`                                   |
| Mã giảm giá               | `QUAN_LY_MA_GIAM_GIA`                                 |
| Bài thi                   | `QUAN_LY_BAI_THI`                                     |
| Duyệt giáo viên           | `DUYET_GIAO_VIEN`                                     |
| Báo cáo vi phạm           | `XU_LY_BAO_CAO_VI_PHAM`                               |
| Hoàn tiền                 | `XU_LY_HOAN_TIEN`                                     |
| Quản lý admin, phân quyền | `user.isLeader === true` (không dùng `hasPermission`) |

- Route guard: vào trang admin mà thiếu quyền thì chuyển về trang "Không có quyền" (403), không đăng xuất.
- Lỗi API: `401` thì thử refresh token, thất bại thì về trang đăng nhập. `403` thì hiện thông báo "Bạn không có quyền thực hiện chức năng này" và giữ nguyên phiên đăng nhập.
- Màn hình gán quyền cho admin lấy danh sách chức năng từ `GET /api/admin/system-functions`, không hardcode danh sách. Gửi lên `PUT /api/admin/administrators/:id/permissions` mảng `functionIds` (ghi đè toàn bộ, gửi mảng rỗng để thu hồi hết).
- Quyền của admin có thể được Leader đổi khi admin đang đăng nhập. Gọi lại `/api/auth/me` khi mở lại ứng dụng để lấy quyền mới nhất.
