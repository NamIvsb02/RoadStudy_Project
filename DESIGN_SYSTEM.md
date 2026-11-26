---
name: RoadStudy
description: Nền tảng đăng ký khóa học trực tuyến đa cấp học, tích hợp AI gợi ý khóa học
source: FE_RStudy/src/assets/styles/theme.css
colors:
  primary: "#155e94"
  primary-dark: "#0f4a75"
  primary-light: "#3c79a6"
  accent: "#ff8a00"
  page: "#f7f8f9"
  surface: "#f0f3f7"
  white: "#ffffff"
  line: "#e5e7eb"
  ink: "#1f2937"
  muted: "#6b7280"
  success: "#16a34a"
  warning: "#d97706"
  danger: "#dc2626"
  info: "#2563eb"
typography:
  fontFamily: '"Be Vietnam Pro", ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif'
  weights:
    regular: 400
    medium: 500
    semibold: 600
    bold: 700
  display:
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.1
  headline:
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.3
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
rounded:
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
shadows:
  card: "0 1px 3px rgb(16 24 40 / 0.08)"
  card-hover: "0 6px 16px rgb(16 24 40 / 0.12)"
breakpoints:
  sm: "640px"
  md: "768px"
  lg: "1024px"
  xl: "1280px"
  2xl: "1536px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    hoverBackground: "{colors.primary-dark}"
    textColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.white}"
    border: "1px {colors.line}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "44px"
  button-outline:
    backgroundColor: "transparent"
    border: "1px {colors.primary}"
    textColor: "{colors.primary}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "44px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "44px"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "44px"
  input-text:
    backgroundColor: "{colors.white}"
    border: "1px {colors.line}"
    focusBorder: "{colors.primary}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "0 12px"
    height: "44px"
  status-badge:
    rounded: "{rounded.full}"
    padding: "2px 10px"
    fontSize: "0.75rem"
  card-stat:
    backgroundColor: "{colors.white}"
    border: "1px {colors.line}"
    rounded: "{rounded.xl}"
    padding: "20px"
  card-course:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.xl}"
    padding: "16px"
    shadow: "{shadows.card}"
  dialog-base:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.2xl}"
    padding: "24px"
    shadow: "{shadows.card-hover}"
  toast:
    backgroundColor: "{colors.white}"
    border: "1px {colors.line}"
    rounded: "{rounded.xl}"
    padding: "12px"
    shadow: "{shadows.card-hover}"
  manage-sidebar:
    backgroundColor: "{colors.primary}"
    width: "240px"
  notification-bell:
    backgroundColor: "{colors.surface}"
    size: "40px"
    rounded: "{rounded.full}"
---

# Design System: RoadStudy

Tài liệu thiết kế chính thức của RoadStudy. Token ở YAML frontmatter phía trên khớp với `FE_RStudy/src/assets/styles/theme.css` (nguồn trong code) và `FE_RStudy/src/constants/motion.js` (preset chuyển động). Đổi token thì sửa cả hai nơi trong cùng một commit.

## 1. Triết lý thiết kế

**Creative North Star: "The Clear Roadmap"**

RoadStudy giúp học viên tìm khóa, thanh toán và vào học mà không bị phân tâm. Xanh đại dương dẫn hướng tới hành động chính, mọi thứ khác lùi về nền. Giáo viên và quản trị viên làm việc trên cùng ngôn ngữ thị giác, chỉ khác bố cục (khu quản lý có thanh bên xanh và các khối số liệu).

- **Rõ ràng hơn trang trí:** mỗi màn hình có một hành động chính nổi bật.
- **Tiết chế:** không hiệu ứng trang trí; chuyển động chỉ để định hướng.
- **Nhất quán thao tác:** cùng một loại việc (lọc, xác nhận, gửi form) luôn trông và phản hồi như nhau.

## 2. Ngôn ngữ thị giác

- **Phẳng có trật tự:** khối nội dung nền trắng, viền 1px `line`, không đổ bóng. Bóng chỉ dành cho header cố định, thẻ khóa học và lớp nổi.
- **Bo góc theo cấp:** càng lớn và càng nổi thì bo càng nhiều, tối đa `rounded-2xl`.
- **Chữ tiếng Việt dễ đọc:** Be Vietnam Pro, cỡ cơ bản 14px, dấu thanh rõ.
- **Chỉ giao diện sáng:** chưa có chế độ tối.

## 3. Màu sắc

Bảng màu hai sắc: xanh đại dương chủ đạo, cam điểm nhấn rất nhỏ, trên nền trung tính sáng.

| Nhóm    | Token                                  | Dùng cho                                                                      |
| ------- | -------------------------------------- | ----------------------------------------------------------------------------- |
| Primary | `primary`                              | Nút chính, thanh bên quản lý, tiêu đề nhấn, số liệu thống kê, trạng thái chọn |
| Primary | `primary-dark`                         | Hover của nút chính                                                           |
| Primary | `primary-light`                        | Vòng sáng focus, điểm nhấn thứ cấp                                            |
| Accent  | `accent`                               | Chỉ nhãn danh mục và điểm nhấn nhỏ. Không dùng cho nút hay khối lớn           |
| Neutral | `page`                                 | Nền trang                                                                     |
| Neutral | `surface`                              | Khung ảnh khi chưa có bìa, nền nút tròn, hover nút lọc                        |
| Neutral | `white`                                | Nền thẻ, panel, bảng, hộp thoại                                               |
| Neutral | `line`                                 | Viền 1px của thẻ, bảng, ô nhập, vách ngăn                                     |
| Neutral | `ink`                                  | Chữ chính                                                                     |
| Neutral | `muted`                                | Chữ phụ, mô tả, ngày giờ                                                      |
| Status  | `success`, `warning`, `danger`, `info` | Huy hiệu trạng thái, thông báo, hành động phá hủy (`danger`)                  |

### Quy tắc màu

- **Token-Only:** mọi màu, bóng, font đi qua token trong `theme.css`, dùng bằng class Tailwind (`bg-primary`, `text-muted`, `border-line`). Không viết mã hex, không dùng `slate`, `gray` của Tailwind cho chữ và viền. Màu mới phải khai báo thành token trước.
- **Primary Restraint:** `primary` dành cho hành động chính và số liệu; `accent` chỉ cho nhãn danh mục. Không đặt chữ nhỏ màu trắng lên nền cam.
- **Huy hiệu trạng thái:** nền 10% màu (`bg-success/10`), chữ màu đầy (`text-success`); tông xám `muted` cho trạng thái trung tính. Nhãn và tông lấy từ `STATUS_MAPS` trong `src/constants/statuses.js`, khớp `BE_RStudy/docs/enum.md`.
- **Không dùng màu thay chữ:** trạng thái luôn có nhãn văn bản, màu chỉ bổ trợ.

## 4. Typography

Font duy nhất: **Be Vietnam Pro** (fallback `ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif`), khai báo ở `--font-sans`.

| Cấp      | Cỡ / độ đậm          | Dùng cho                                                                 |
| -------- | -------------------- | ------------------------------------------------------------------------ |
| Display  | 2.25rem (36px), 700  | Số liệu lớn, đồng hồ đếm ngược bài thi, điểm trên màn kết quả. Hiếm dùng |
| Headline | 1.25–1.5rem, 600–700 | Tiêu đề trang, tên khóa học hoặc đề thi ở đầu trang                      |
| Title    | 1–1.125rem, 600      | Tên khối nội dung, tiêu đề hộp thoại, tên khóa trên thẻ (tối đa 2 dòng)  |
| Body     | 0.875rem (14px), 400 | Nội dung, ô bảng, nút, ô nhập. Màu `ink`, phụ `muted`                    |
| Label    | 0.75–0.875rem, 500   | Nhãn form, huy hiệu, ghi chú, lỗi nhỏ. Số trên chuông 11px semibold      |

**Weight Rule:** `font-bold` chỉ cho tiêu đề trang lớn, số liệu thống kê (`text-3xl font-bold text-primary`) và đồng hồ. Nút, nhãn, tiêu đề khối tối đa `font-semibold`; nhãn form `font-medium`.

## 5. Layout

- **Trang công khai:** header cố định, nội dung căn giữa, footer xanh đậm. Điện thoại có thanh điều hướng dưới (`BottomNav`).
- **Khu quản lý (giáo viên, admin):** thanh bên 240px nền `primary` ở desktop; thu thành ngăn kéo (`slideInLeft`) trên màn nhỏ. Thanh trên có chuông thông báo và menu người dùng.
- **Khoảng cách:** hệ 4/8px: 4, 8, 16, 24, 32. Panel và thẻ padding 16–24px.
- **Vùng chạm:** nút và ô nhập cao 44px.
- **Trang quản lý:** nút tạo mới ở góc phải trên; hàng lọc đặt trên bảng.

## 6. Elevation & Depth

Triết lý **Flat-by-Default**: khối tĩnh phẳng, tách bằng viền `line`.

| Token               | Giá trị                           | Dùng cho                                                                                 |
| ------------------- | --------------------------------- | ---------------------------------------------------------------------------------------- |
| (không bóng)        | `none`                            | Panel, thẻ số liệu, bảng trong khu quản lý                                               |
| `shadow-card`       | `0 1px 3px rgb(16 24 40 / 0.08)`  | Header cố định, thẻ khóa học lúc nghỉ, thẻ tin nhắn trong chat                           |
| `shadow-card-hover` | `0 6px 16px rgb(16 24 40 / 0.12)` | Hộp thoại, dropdown, toast, bảng thông báo, khung chat, nút chat nổi, thẻ khóa khi hover |

Không tự chế bóng, không dùng `shadow-sm`, `shadow-md` của Tailwind thay cho token.

## 7. Shapes

| Thành phần                                                       | Bo góc         |
| ---------------------------------------------------------------- | -------------- |
| Nút, ô nhập                                                      | `rounded-lg`   |
| Thẻ, panel, toast                                                | `rounded-xl`   |
| Hộp thoại                                                        | `rounded-2xl`  |
| Huy hiệu, avatar, nút tròn (chuông, nút chat), ô tìm kiếm header | `rounded-full` |

**Radius Ladder Rule:** không bo khối nội dung quá `rounded-2xl`; không đổi nút thường sang `rounded-full`.

## 8. Icon

- Chỉ `lucide-react`, import theo tên: `import { Plus, Trash2 } from "lucide-react";`.
- Cỡ: 16 (trong nút/chữ), 20 (mặc định), 24 (tiêu đề, trạng thái rỗng).
- Icon cho nút nào phải ghi trong spec trang; spec không ghi thì không thêm.
- Không emoji làm icon, không bộ icon khác, không tự vẽ SVG.

## 9. Component guidelines

Dùng component có sẵn: `Button`, `FormField`, `TextField`, `StatusBadge`, `Switch`, `Toast` (`components/ui`); `ConfirmDialog`, `DashboardPanel`, `StatCard`, `CourseCard`, `CourseCover`, `Pagination`, `LoadingState`, `EmptyState`, `ErrorState`, `NotificationBell` (`components/common`).

### Buttons (`components/ui/Button.jsx`)

- Cao 44px (`h-11`), `rounded-lg`, `px-5`, `text-sm font-semibold`, `transition-colors`.
- Prop `loading` hiện `Loader2` quay và tự `disabled` (`disabled:opacity-60`).

| Variant     | Class                                                      | Dùng cho                                        |
| ----------- | ---------------------------------------------------------- | ----------------------------------------------- |
| `primary`   | `bg-primary text-white hover:bg-primary-dark`              | Hành động chính                                 |
| `secondary` | `border border-line bg-white text-ink hover:bg-primary/10` | Hủy, Đóng, Quay lại                             |
| `outline`   | `border border-primary text-primary hover:bg-primary/10`   | Hành động thứ yếu có chủ đích (Áp dụng mã)      |
| `ghost`     | `text-ink hover:bg-primary/10`                             | Hành động phụ trong thanh công cụ               |
| `danger`    | `bg-danger text-white hover:bg-danger/90`                  | Chỉ trong hộp thoại xác nhận xóa, khóa, từ chối |

### Inputs (`FormField` + `inputClass`)

- `h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink placeholder:text-muted`.
- Focus: `focus:border-primary focus:ring-2 focus:ring-primary-light/40`. Lỗi: `border-danger focus:ring-danger/30` và dòng lỗi `text-xs` (`role="alert"`) ngay dưới. Textarea thêm `min-h-28 py-2`.
- Nhãn `font-medium`, dấu `*` đỏ cho ô bắt buộc. Nội dung lỗi lấy từ BE.
- Ô tìm kiếm header: `rounded-full`, tìm qua `/courses?search=`.

### Cards & Panels

- **StatCard:** `rounded-xl border border-line bg-white p-5`; nhãn `text-sm text-muted`, số `text-3xl font-bold text-primary`. Phẳng.
- **CourseCard:** ảnh bìa qua `CourseCover`, nhãn danh mục màu `accent` góc trái trên, tên khóa tối đa 2 dòng, giá màu `primary`, hover nâng nhẹ (`translateY`) bằng CSS transition.
- **CourseCover:** luôn khung 16:9 (`aspect-video overflow-hidden`, ảnh `object-cover`, nền `surface` khi chưa có ảnh). Ảnh bìa cắt 1280×720. Không tự viết `<img>` cho ảnh bìa.
- **DashboardPanel:** `rounded-xl border border-line bg-white p-5`, bọc bảng và form trong khu quản lý.

### Tables

- Đầu bảng nền `primary/10`, chữ `primary`, `text-xs font-semibold`. Ô có viền dưới `line`, `px-3 py-2.5 text-sm text-ink`.
- Bảng rộng cuộn ngang trong khung riêng, không làm trang tràn ngang.

### Badges & Filter tabs

- **StatusBadge:** `rounded-full px-2.5 py-0.5 text-xs font-medium`, năm tông: xám, vàng (`warning`), xanh lá (`success`), đỏ (`danger`), xanh dương (`info`).
- **Filter tabs:** nút đầu tiên luôn là **Tất cả**. Đang chọn `bg-primary text-white`; chưa chọn `bg-white text-ink hover:bg-surface`.

### Navigation

- **Manage sidebar:** mục hiện tại nền trắng, chữ `primary`, `font-semibold`; mục khác chữ trắng 85%, hover nền trắng 10%. Menu admin lọc theo quyền; mục Phân quyền chỉ Leader thấy.

### Overlays & Feedback

- **Dialog (`ConfirmDialog`, hộp thoại form):** lớp phủ `bg-black/40` (`fadeIn`), hộp `rounded-2xl bg-white p-6 shadow-card-hover` (`scaleIn`), rộng `max-w-md` đến `max-w-lg`. Esc để đóng, khóa đóng khi đang gửi.
- **Toast:** `rounded-xl border border-line bg-white p-3 shadow-card-hover`, icon theo loại (`CircleCheck`, `CircleX`, `TriangleAlert`, `Info`) + nút đóng, vào bằng `slideInRight`.
- **NotificationBell:** nút tròn 40px nền `surface`, icon `Bell` cỡ 20, huy hiệu số `bg-danger` chữ trắng 11px, `99+` khi vượt. Mở bảng thông báo bằng `dropdown`.
- **Trạng thái:** mọi danh sách, bảng, form có loading (`LoadingState` hoặc `Loader2 animate-spin`), rỗng (`EmptyState`), lỗi (`ErrorState`).

## 10. Motion

**Mặc định không animation.** Chỉ làm hiệu ứng có ghi trong spec (phần tử, hiệu ứng, thời lượng), trừ hai ngoại lệ đã chốt bên dưới. Thư viện duy nhất `framer-motion`, preset trong `src/constants/motion.js`.

| Preset         | Hiệu ứng                                        | Dùng cho                                       |
| -------------- | ----------------------------------------------- | ---------------------------------------------- |
| `fadeIn`       | opacity 0 → 1, 0.2s (thoát 0.15s)               | Lớp phủ hộp thoại                              |
| `scaleIn`      | opacity + scale 0.96 → 1, 0.2s                  | Hộp thoại, cửa sổ nổi                          |
| `dropdown`     | opacity + y -8 → 0, 0.15s                       | Menu người dùng, bảng thông báo                |
| `slideUp`      | opacity + y 12 → 0, 0.3s                        | Scroll-reveal section, khối nội dung theo spec |
| `slideInLeft`  | x -100% → 0, 0.25s                              | Ngăn kéo menu quản lý trên điện thoại          |
| `slideInRight` | opacity + x 24 → 0, 0.25s                       | Toast                                          |
| `stepSlide`    | opacity + x 16 → 0, 0.25s                       | Chuyển bước trong form nhiều bước              |
| `stagger`      | `staggerChildren` 0.05s                         | Danh sách ngắn (dưới 20 phần tử)               |
| bell shake     | rotate `[0, -16, 14, -10, 6, 0]`, 0.5s, một lần | Chuông thông báo (trong `NotificationBell`)    |

### Scroll-reveal cho section chính (chốt 23/11)

- Áp dụng trên trang nội dung: trang chủ, danh sách và chi tiết khóa học, trang giáo viên, thư viện tài liệu.
- Mẫu:

  ```jsx
  <motion.section variants={slideUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
  ```

- Chạy **một lần**, animate cả section, không animate từng phần tử nhỏ bên trong (lưới thẻ khóa học dưới 20 item được dùng `stagger`).
- **Không áp dụng** cho bảng, form, khu quản lý (giáo viên, admin), trang làm bài thi và luồng tác vụ (đăng ký, thanh toán).
- Section đầu tiên (nằm trong màn hình lúc mở trang) không ẩn chờ cuộn. Nội dung thiết yếu không phụ thuộc vào animation.

### Lắc chuông (chốt 16/11)

- `NotificationBell` lắc **một lần** khi số chưa đọc tăng: chỉ `rotate`, khoảng 0.5s, không lặp, bỏ qua khi bật giảm chuyển động (`useReducedMotion`).
- Đây là ngoại lệ duy nhất cho lệnh cấm shake.

### Quy tắc chuyển động

- Thời lượng 0.15–0.4s, easing `easeOut`. Không spring nảy, không `repeat: Infinity`.
- Chỉ animate `opacity` và `transform` (x, y, scale, rotate); không animate width, height, top, left.
- `AnimatePresence` cho modal, toast, dropdown khi mount/unmount. Danh sách dài (trên 20 item) không stagger.
- Hover/focus của nút, link, input dùng CSS `transition` 150–200ms, không dùng framer-motion.
- Spinner: icon `Loader2` + `animate-spin`.
- Cấm: bounce, shake (trừ chuông), pulse, gradient chuyển động, parallax, animation tự chạy khi load trang nếu spec không yêu cầu, GSAP, anime.js, AOS, react-spring, CSS keyframes tự viết.

## 11. Responsive

- **Mobile-first:** class gốc cho màn hẹp, mở rộng bằng `sm:`, `md:`, `lg:`, `xl:`, `2xl:` (breakpoint chuẩn Tailwind ở frontmatter).
- Không tràn ngang ở 320, 375, 768, 1024, 1440px. Bảng rộng cuộn ngang trong khung riêng.
- Trang học viên dùng thanh điều hướng dưới trên điện thoại. Khu quản lý ưu tiên desktop, menu thành ngăn kéo trên màn nhỏ.
- Không tự đổi layout so với ảnh thiết kế đính kèm trong task.

## 12. Accessibility

- Vùng chạm 44px cho nút và ô nhập.
- Focus luôn nhìn thấy (`ring` màu `primary-light`). Esc đóng hộp thoại. Dùng đúng vai trò `dialog`, `switch`, `tab`, `alert` và nhãn truy cập cho nút chỉ có icon.
- Tôn trọng `prefers-reduced-motion`: gốc app bọc `MotionConfig reducedMotion="user"` (`src/main.jsx`); hiệu ứng tự kích hoạt kiểm tra thêm `useReducedMotion`.
- Tương phản: chữ nhỏ màu `accent`, `success`, `warning` trên nền trắng hoặc nền nhạt cùng tông có thể chưa đạt 4.5:1. Đo bằng công cụ trước khi coi là đạt, dùng tông đậm hơn cho chữ khi cần.
- Chữ tiếng Việt có dấu, cỡ cơ bản 14px.

## 13. Do's and Don'ts

| Do                                                               | Don't                                                               |
| ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| Dùng token (`primary`, `ink`, `line`...) qua class Tailwind      | Viết mã hex, `rgb(...)`, dùng `slate`/`gray` của Tailwind           |
| Dùng component sẵn có trong `components/ui`, `components/common` | Tạo component trùng chức năng với cái đã có                         |
| Bo góc theo bậc `lg` → `xl` → `2xl`                              | Bo khối nội dung quá `rounded-2xl` hoặc đổi nút sang `rounded-full` |
| `font-bold` chỉ cho tiêu đề lớn và số liệu                       | Dùng `font-bold` cho nút, nhãn, văn bản thường                      |
| Icon `lucide-react` cỡ 16/20/24, có trong spec                   | Emoji, bộ icon khác, SVG tự vẽ                                      |
| Preset trong `motion.js`, scroll-reveal đúng phạm vi             | Thư viện animation khác, bounce, pulse, lặp vô hạn                  |
| Bộ lọc có nút **Tất cả** đứng đầu                                | Bộ lọc khóa học thiếu lựa chọn Tất cả                               |
| Đủ loading, rỗng, lỗi; nút gọi API `disabled` + loading          | Để người dùng bấm đúp gửi trùng                                     |
| Ảnh bìa qua `CourseCover`, ảnh minh chứng qua `ProofImage`       | `<img src>` trực tiếp cho ảnh bìa hoặc ảnh minh chứng               |
| Đối chiếu spec và ảnh thiết kế; thiếu thông tin thì hỏi          | Tự đổi phong cách, layout hay thêm hiệu ứng không có trong spec     |
