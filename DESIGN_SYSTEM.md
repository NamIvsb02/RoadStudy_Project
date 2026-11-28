---
name: RoadStudy
description: Nền tảng đăng ký khóa học trực tuyến đa cấp học, tích hợp AI gợi ý khóa học
source: FE_RStudy/src/assets/styles/theme.css
colors:
  primary: "#155e94"
  primary-dark: "#0f4a75"
  primary-light: "#3c79a6"
  primary-50: "#eef5fb"
  primary-100: "#d7e8f5"
  primary-200: "#b0d0ea"
  primary-950: "#0a2e4a"
  sky: "#4aa8e0"
  accent: "#3d8bd9"
  accent-soft: "#e8f1fb"
  accent-strong: "#1e5fa0"
  secondary: "#2bb3c0"
  secondary-strong: "#0e6e78"
  page: "#f7f8f9"
  surface: "#f0f3f7"
  white: "#ffffff"
  line: "#e5e7eb"
  line-strong: "#d3dae3"
  ink: "#1f2937"
  ink-strong: "#0f1f33"
  muted: "#646b78"
  success: "#16a34a"
  success-strong: "#15803d"
  warning: "#d97706"
  warning-strong: "#b45309"
  danger: "#dc2626"
  danger-strong: "#b91c1c"
  info: "#2563eb"
  info-strong: "#1d4ed8"
typography:
  fontFamily: '"Montserrat", ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif'
  weights:
    regular: 400
    medium: 500
    semibold: 600
    bold: 700
  display:
    fontSize: "clamp(2rem, 1.25rem + 3.2vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontSize: "clamp(1.5rem, 1.2rem + 1.2vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
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
  eyebrow:
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.05em"
    textTransform: uppercase
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
  card-hover: "0 10px 24px -8px rgb(16 24 40 / 0.16)"
  raised: "0 24px 48px -20px rgb(15 74 117 / 0.35)"
gradients:
  brand: "linear-gradient(135deg, primary-dark, primary 55%, sky)"
  glow: "radial-gradient(60% 60% at 70% 30%, primary-100 80%, transparent 70%)"
  fade-page: "linear-gradient(to bottom, white, page)"
  dot-grid: "radial-gradient(circle, primary-200 1px, transparent 1.5px), size 22px"
motion:
  duration:
    micro: 0.16
    component: 0.28
    reveal: 0.55
    hero: 0.8
  stagger:
    tight: 0.06
    base: 0.08
    loose: 0.12
  ease:
    out: "cubic-bezier(0.25, 1, 0.5, 1)"
    inOut: "cubic-bezier(0.65, 0, 0.35, 1)"
  viewport: "once, amount 0.2"
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
  button-lg:
    height: "48px"
    padding: "0 24px"
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
    border: "1px {colors.line}"
    rounded: "{rounded.xl}"
    shadowHover: "{shadows.card-hover}"
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

**Creative North Star: "The Learning Road"**

RoadStudy là con đường học tập: học viên tìm khóa, thanh toán và vào học theo một lộ trình rõ ràng. Xanh đại dương dẫn hướng tới hành động chính, mọi thứ khác lùi về nền. Bản sắc riêng là motif **con đường**: đường cong nét đứt nối các "trạm" (điểm tròn có số thứ tự) xuyên các section công khai.

- **Rõ ràng hơn trang trí:** mỗi màn hình có một hành động chính nổi bật.
- **Mật độ theo vùng:** trang công khai giàu hình ảnh và chuyển động; khu học viên gọn, tập trung; khu quản lý phẳng, mật độ cao như dashboard SaaS.
- **Chuyển động có mục đích:** định hướng và tạo nhịp đọc, không phô diễn; luôn có đường lui khi bật giảm chuyển động.
- **Nhất quán thao tác:** cùng một loại việc (lọc, xác nhận, gửi form) luôn trông và phản hồi như nhau.

## 2. Ngôn ngữ thị giác

- **Viền trước, bóng sau:** khối nội dung nền trắng, viền 1px `line`. Bóng chỉ cho header khi cuộn, thẻ khi hover, lớp nổi và khung hero (`shadow-raised`).
- **Nhịp section:** trang công khai xen kẽ nền `white`, `page` và dải `primary-950` để tạo nhịp.
- **Bố cục bất đối xứng:** lưới 7/5, 5/7 và bento cho trang công khai; khu quản lý dùng lưới đều.
- **Bo góc theo cấp:** càng lớn và càng nổi thì bo càng nhiều, tối đa `rounded-2xl`.
- **Chữ tiếng Việt dễ đọc:** Montserrat (có bộ ký tự tiếng Việt), cỡ cơ bản 14px, dấu thanh rõ.
- **Chỉ giao diện sáng:** chưa có chế độ tối.
- **Glassmorphism:** không dùng, trừ duy nhất header khi cuộn (`bg-white/90 backdrop-blur`).

## 3. Màu sắc

Bảng màu: xanh đại dương chủ đạo (thang `primary-50` đến `primary-950`), tông `sky` sáng chỉ dùng trong gradient, xanh `accent` và xanh ngọc `secondary` làm điểm nhấn nhỏ, trên nền trung tính sáng. **Không dùng màu cam** ở bất kỳ đâu (trừ `warning` hổ phách cho trạng thái chờ).

| Nhóm      | Token                                                              | Dùng cho                                                                              |
| --------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Primary   | `primary`                                                          | Nút chính, thanh bên quản lý, tiêu đề nhấn, số liệu thống kê, trạng thái chọn         |
| Primary   | `primary-dark`                                                     | Hover của nút chính                                                                   |
| Primary   | `primary-light`                                                    | Vòng sáng focus, điểm nhấn thứ cấp                                                    |
| Primary   | `primary-50`, `primary-100`, `primary-200`                         | Nền hover, nền mục active, đường `RoadPath`, lưới chấm                                |
| Primary   | `primary-950`                                                      | Footer, dải nội dung tối                                                              |
| Sky       | `sky`                                                              | Chỉ trong gradient. Không dùng cho chữ                                                |
| Accent    | `accent`, `accent-soft`                                            | Ngôi sao đánh giá, trạm đang active, nền nhãn nhỏ. Không dùng cho nút                 |
| Accent    | `accent-strong`                                                    | Chữ điểm nhấn trên nền sáng (nhãn danh mục, eyebrow nhỏ)                              |
| Secondary | `secondary`, `secondary-strong`                                    | Xanh ngọc phụ: `secondary` cho chấm, viền, nền; nền chữ trắng dùng `secondary-strong` |
| Neutral   | `page`                                                             | Nền trang                                                                             |
| Neutral   | `surface`                                                          | Khung ảnh khi chưa có bìa, nền skeleton, nền nút tròn, hover nút lọc                  |
| Neutral   | `white`                                                            | Nền thẻ, panel, bảng, hộp thoại                                                       |
| Neutral   | `line`, `line-strong`                                              | Viền 1px, vách ngăn; `line-strong` cho hover viền ô nhập và sao rỗng                  |
| Neutral   | `ink`, `ink-strong`                                                | Chữ chính; `ink-strong` cho tiêu đề lớn                                               |
| Neutral   | `muted`                                                            | Chữ phụ, mô tả, ngày giờ                                                              |
| Status    | `success`, `warning`, `danger`, `info`                             | Chấm trạng thái, biểu tượng, nền 10%, hành động phá hủy (`danger`)                    |
| Status    | `success-strong`, `warning-strong`, `danger-strong`, `info-strong` | Chữ trạng thái trên nền sáng hoặc nền 10% (đạt 4.5:1)                                 |

### Gradient

Khai báo bằng biến CSS trong `:root` và `@utility` của Tailwind v4, không viết gradient trong JSX.

| Utility             | Dùng cho                                                     |
| ------------------- | ------------------------------------------------------------ |
| `bg-brand-gradient` | Hero frame, CTA band, panel xác thực, thanh `ScrollProgress` |
| `bg-glow`           | Quầng sáng nền hero                                          |
| `bg-fade-page`      | Nối hai section (trắng sang `page`)                          |
| `bg-dot-grid`       | Lưới chấm mờ nền hero và CTA                                 |

Gradient chỉ dùng ở hero, CTA band, panel xác thực, footer. **Không** gradient trên nút hay thẻ thường.

### Quy tắc màu

- **Token-Only:** mọi màu, bóng, font đi qua token trong `theme.css`, dùng bằng class Tailwind (`bg-primary`, `text-muted`, `border-line`). Không viết mã hex, không dùng `slate`, `gray`, `amber`, `red` của Tailwind. Màu mới phải khai báo thành token trước.
- **Primary Restraint:** `primary` dành cho hành động chính và số liệu; `accent` chỉ cho điểm nhấn nhỏ. Không dùng chữ `accent`, `secondary` trên nền trắng (dùng `accent-strong`, `secondary-strong`).
- **Huy hiệu trạng thái:** nền 10% màu (`bg-success/10`), chữ tông `*-strong`, có chấm tròn màu đứng trước nhãn; tông xám `muted` cho trạng thái trung tính. Nhãn và tông lấy từ `STATUS_MAPS` trong `src/constants/statuses.js`, khớp `BE_RStudy/docs/enum.md`.
- **Không dùng màu thay chữ:** trạng thái luôn có nhãn văn bản, màu chỉ bổ trợ.

## 4. Typography

Font duy nhất: **Montserrat** (fallback `ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif`), khai báo ở `--font-sans`.

| Cấp      | Cỡ / độ đậm                                                   | Dùng cho                                                                |
| -------- | ------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Display  | `text-display`: clamp 2rem đến 3.5rem, 700, tracking -0.02em  | Tiêu đề hero, số liệu lớn, đồng hồ đếm ngược, điểm trên màn kết quả     |
| Headline | `text-headline`: clamp 1.5rem đến 2.25rem, 700                | Tiêu đề trang, tên khóa học hoặc đề thi ở đầu trang                     |
| Title    | 1–1.125rem, 600                                               | Tên khối nội dung, tiêu đề hộp thoại, tên khóa trên thẻ (tối đa 2 dòng) |
| Body     | 0.875rem (14px), 400                                          | Nội dung, ô bảng, nút, ô nhập. Màu `ink`, phụ `muted`                   |
| Label    | 0.75–0.875rem, 500                                            | Nhãn form, huy hiệu, ghi chú, lỗi nhỏ. Số trên chuông 11px semibold     |
| Eyebrow  | `text-xs font-semibold tracking-wider uppercase text-primary` | Nhãn nhỏ phía trên tiêu đề section                                      |

**Weight Rule:** `font-bold` chỉ cho tiêu đề trang và section, giá trên thẻ khóa học, số liệu thống kê (`text-3xl font-bold text-primary`) và đồng hồ. Nút, nhãn, tiêu đề khối tối đa `font-semibold`; nhãn form `font-medium`.

## 5. Layout

- **Trang chủ:** full-bleed, không `Sidebar`; từng section tự quản `max-w-[1440px]` và nền tràn viền.
- **Trang công khai khác:** header cố định, container `max-w-[1440px]` với `px-4 lg:px-6`, `Sidebar` chỉ hiện từ `xl` (`hidden xl:block`), footer `primary-950`. Điện thoại có thanh điều hướng dưới (`BottomNav`).
- **`PageColumns`:** chỉ chia cột, không tự thêm `max-w`, `px`, `py` vì đã nằm trong container của `Layout`.
- **Tải trang lazy:** `Suspense` bọc `Outlet` bên trong layout với `PageSkeleton`, nên header và footer không biến mất. Chuyển trang dùng `pageEnter` (không exit); đổi query string không remount. `ScrollToTop` đưa trang về đầu khi đổi `pathname` (bỏ qua khi có hash).
- **Khu quản lý (giáo viên, admin):** thanh bên 240px nền `primary` ở desktop, mục active có nền trắng trượt (`layoutId`); thu thành ngăn kéo (`slideInLeft`) trên màn nhỏ. Thanh trên có chuông thông báo và menu người dùng.
- **Khoảng cách:** hệ 4/8px: 4, 8, 16, 24, 32. Panel và thẻ padding 16–24px.
- **Vùng chạm:** nút và ô nhập cao 44px.
- **Trang quản lý:** nút tạo mới ở góc phải trên; hàng lọc đặt trên bảng.

## 6. Elevation & Depth

Triết lý **Border-First**: khối tĩnh tách bằng viền `line`; bóng là phần thưởng cho tương tác và lớp nổi.

| Token               | Giá trị                                   | Dùng cho                                                         |
| ------------------- | ----------------------------------------- | ---------------------------------------------------------------- |
| (không bóng)        | `none`                                    | Panel, thẻ số liệu, bảng, thẻ khóa học lúc nghỉ                  |
| `shadow-card`       | `0 1px 3px rgb(16 24 40 / 0.08)`          | Header khi cuộn, núm `Switch`                                    |
| `shadow-card-hover` | `0 10px 24px -8px rgb(16 24 40 / 0.16)`   | Hộp thoại, dropdown, toast, khung chat, thẻ khóa khi hover       |
| `shadow-raised`     | `0 24px 48px -20px rgb(15 74 117 / 0.35)` | Khung ảnh hero, CTA band, thẻ nổi. Bóng tông xanh, dùng tiết chế |

Không tự chế bóng, không dùng `shadow-sm`, `shadow-md`, `shadow-lg` của Tailwind.

## 7. Shapes

| Thành phần                                                       | Bo góc         |
| ---------------------------------------------------------------- | -------------- |
| Nút, ô nhập                                                      | `rounded-lg`   |
| Thẻ, panel, toast                                                | `rounded-xl`   |
| Hộp thoại, khung ảnh hero, bento tile lớn, CTA band              | `rounded-2xl`  |
| Huy hiệu, avatar, nút tròn (chuông, nút chat), ô tìm kiếm header | `rounded-full` |

**Radius Ladder Rule:** không bo khối nội dung quá `rounded-2xl`; không đổi nút thường sang `rounded-full`.

## 8. Icon và Motif

- Chỉ `lucide-react`, import theo tên: `import { Plus, Trash2 } from "lucide-react";`.
- Cỡ: 16 (trong nút/chữ), 20 (mặc định), 24 (tiêu đề, trạng thái rỗng).
- Icon cho nút nào phải ghi trong spec trang; spec không ghi thì không thêm.
- Không emoji làm icon, không bộ icon khác.
- **Ngoại lệ duy nhất cho SVG tự vẽ: `RoadPath`.** Đường cong nét đứt trang trí (`aria-hidden`, nhiều hình định sẵn qua prop `variant`: `hero`, `wide`, `vertical`), vẽ dần bằng `pathDraw` khi vào viewport, chạy một lần, ẩn dưới `md`. Màu `primary-200` trên nền sáng, trắng mờ trên nền tối.

## 9. Component guidelines

Dùng component có sẵn. `components/ui`: `Button`, `FormField`, `TextField`, `PasswordInput`, `StatusBadge`, `Switch`, `Toast`, `Skeleton`. `components/common`: `ConfirmDialog`, `DashboardPanel`, `StatCard`, `CourseCard`, `CourseCover`, `CourseGrid`, `SectionHeader`, `Pagination`, `LoadingState`, `EmptyState`, `ErrorState`, `NotificationBell`, và các thành phần mới bên dưới.

### Thành phần dùng chung mới

| Component                                                             | API chính                                                                                                   | Ghi chú                                                                                                                                                                                                                                                                                                        |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Reveal`                                                              | `as`, `variant` (`fadeUp`, `revealLeft`, `revealRight`, `scaleReveal`, `imageReveal`), `delay`, `className` | Nơi duy nhất cấu hình scroll reveal (`whileInView`, chạy một lần)                                                                                                                                                                                                                                              |
| `RevealGroup`                                                         | `as`, `variant`, `stagger`, `delayChildren`, `trigger` (`view` hoặc `mount`), `className`, `itemClassName`  | Bọc mỗi con trong `motion.div`; dùng cho danh sách dưới 20 phần tử                                                                                                                                                                                                                                             |
| `Skeleton` (`ui`)                                                     | `className`                                                                                                 | Khối `bg-surface` tĩnh, `aria-hidden`. Không `animate-pulse`                                                                                                                                                                                                                                                   |
| `CourseCardSkeleton`, `TableSkeleton`, `ListSkeleton`, `PageSkeleton` | `count`; `rows`, `cols`; `rows`; không prop                                                                 | Bọc `role="status"` kèm chữ `sr-only` "Đang tải". Cùng kích thước nội dung thật                                                                                                                                                                                                                                |
| `RoadPath`                                                            | `variant`, `hideOnMobile`, `className`                                                                      | Xem mục 8                                                                                                                                                                                                                                                                                                      |
| `GlobalLoadingOverlay`                                                | `open`, `message`                                                                                           | Lớp phủ `bg-black/38` toàn màn hình (`z-[70]`), logo `SoftLogoCanvas` và dòng trạng thái, fade vào/ra, chặn tương tác. Gọi qua `useGlobalLoading().run(task, message)`, chỉ cho tác vụ quan trọng (đăng nhập, đăng ký, xác thực, đăng ký khóa, minh chứng, hủy đơn, hoàn tiền, lưu hồ sơ); không thay skeleton |
| `SoftLogoCanvas`                                                      | không prop                                                                                                  | Logo `logo-loader.webp` nghiêng 17° quanh chân phải chữ R, chỉ vùng góc chạm sàn bị ép rồi đàn hồi, bóng ellipse đổi theo; chu kỳ 1.55s, vẽ bằng canvas + `requestAnimationFrame`                                                                                                                              |
| `ScrollProgress`                                                      | không prop                                                                                                  | Thanh 3px đầu trang, `scaleX` theo cuộn. Chỉ trang chủ và chi tiết khóa học                                                                                                                                                                                                                                    |
| `ScrollToTop`                                                         | không prop                                                                                                  | Đặt trong layout                                                                                                                                                                                                                                                                                               |
| `useMediaQuery(query)` (`hooks/`)                                     | trả về boolean                                                                                              | Tắt parallax dưới `lg`                                                                                                                                                                                                                                                                                         |

`LoadingState` (spinner) giữ cho chỗ chưa biết hình dạng nội dung; nơi biết trước hình dạng dùng skeleton. `EmptyState({ title, description, action })`, `ErrorState({ message, onRetry })`, `Pagination({ pagination, onChange })` với `pagination = data.pagination` là bản duy nhất, nằm ở `components/common`.

### Buttons (`components/ui/Button.jsx`)

- `rounded-lg`, `text-sm font-semibold`, chuyển màu và `transform` 150ms `ease-out-soft`, nhấn xuống `active:scale-[0.98]`.
- Prop `size`: `md` (44px, `px-5`, mặc định), `lg` (48px, `px-6`, cho CTA hero).
- Prop `loading` hiện `Loader2` quay và tự `disabled` (`disabled:opacity-60`).

| Variant     | Class                                                      | Dùng cho                                        |
| ----------- | ---------------------------------------------------------- | ----------------------------------------------- |
| `primary`   | `bg-primary text-white hover:bg-primary-dark`              | Hành động chính                                 |
| `secondary` | `border border-line bg-white text-ink hover:bg-primary/10` | Hủy, Đóng, Quay lại                             |
| `outline`   | `border border-primary text-primary hover:bg-primary/10`   | Hành động thứ yếu có chủ đích (Áp dụng mã)      |
| `ghost`     | `text-ink hover:bg-primary/10`                             | Hành động phụ trong thanh công cụ               |
| `danger`    | `bg-danger text-white hover:bg-danger/90`                  | Chỉ trong hộp thoại xác nhận xóa, khóa, từ chối |

Màu `accent` và màu `secondary` không dùng làm nền nút (variant `secondary` của `Button` là nút viền trắng, không liên quan màu `secondary`).

### Inputs (`FormField` + `inputClass`)

- `h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink placeholder:text-muted`; hover `border-line-strong`; chuyển viền và ring 150ms.
- Focus: `focus:border-primary focus:ring-2 focus:ring-primary-light/40`. Lỗi: `border-danger focus:ring-danger/30` và dòng lỗi `text-xs text-danger-strong` có icon `CircleAlert` 14px (`role="alert"`) ngay dưới. Textarea thêm `min-h-28 py-2`.
- Nhãn `font-medium`, dấu `*` đỏ cho ô bắt buộc. Nội dung lỗi lấy từ BE.
- Ô tìm kiếm header: `rounded-full`, tìm qua `/courses?search=`.

### Cards & Panels

- **StatCard:** `rounded-xl border border-line bg-white p-5`; nhãn `text-sm text-muted`, số `text-3xl font-bold text-primary`. Phẳng.
- **CourseCard:** viền `line`, ảnh qua `CourseCover`, nhãn danh mục `bg-white/95 text-accent-strong` góc trái trên, tên tối đa 2 dòng `text-ink-strong`, hàng giáo viên, chân thẻ có giá `text-lg font-bold text-primary` và đánh giá. Hover nâng `-translate-y-1` + `shadow-card-hover` (CSS), ảnh zoom `group-hover:scale-105` 400ms; focus bàn phím cũng nâng thẻ.
- **CourseCover:** luôn khung 16:9 (`aspect-video overflow-hidden`, ảnh `object-cover`, nền `surface` khi chưa có ảnh), `loading="lazy" decoding="async"` kèm `width/height`. Ảnh bìa cắt 1280×720. Không tự viết `<img>` cho ảnh bìa.
- **SectionHeader:** `title`, `eyebrow`, `description`, link "Xem tất cả" có gạch chân trượt và mũi tên dịch 2px khi hover.
- **DashboardPanel:** `rounded-xl border border-line bg-white p-5`, bọc bảng và form trong khu quản lý.

### Tables

- Đầu bảng nền `primary/10`, chữ `primary`, `text-xs font-semibold`. Ô có viền dưới `line`, `px-3 py-2.5 text-sm text-ink`.
- Bảng rộng cuộn ngang trong khung riêng, không làm trang tràn ngang.

### Badges & Filter tabs

- **StatusBadge:** `rounded-full px-2.5 py-0.5 text-xs font-medium`, chấm tròn 6px + nhãn, năm tông: xám, vàng (`warning`), xanh lá (`success`), đỏ (`danger`), xanh dương (`info`); chữ dùng tông `*-strong`.
- **Bộ lọc** (trang khóa học, thư viện tài liệu): nằm ở cột trái (`PageColumns left`, dính khi cuộn) trong `FilterPanel` (tiêu đề "Bộ lọc" + nút "Đặt lại", mobile thu gọn sau nút "Bộ lọc"), mỗi nhóm là một `FilterSection`. Ô tìm kiếm nằm trong bộ lọc (lọc sau 400ms ngừng gõ). Danh mục và sắp xếp dùng `FilterRadioList`, lựa chọn đầu tiên là **Tất cả**, đổi là lọc ngay. Học phí dùng nút khoảng giá nhanh cùng thanh kéo hai đầu (`PriceRangeSlider`, 0 đến 5 triệu, bước 100 nghìn; kéo hết đầu phải là không giới hạn trên).
- **Filter tabs:** nút đầu tiên luôn là **Tất cả**. Mục đang chọn có nền `bg-primary` chữ trắng, nền này **trượt** giữa các mục bằng `layoutId` + `tabIndicator`; chưa chọn `bg-surface text-ink hover:bg-primary-100`.
- **Switch:** núm trượt bằng `layout` + `tabIndicator`.

### Navigation

- **Header:** nền trắng; khi cuộn quá 8px chuyển `bg-white/90 backdrop-blur` + `shadow-card`. Ô tìm kiếm mobile mở bằng `dropdown`. `SearchBox` gợi ý tối đa 6 khóa học khi gõ từ 2 ký tự (chờ 300ms, `GET /course?q=`), bảng gợi ý mở bằng `dropdown`, chọn bằng chuột hoặc phím mũi tên + Enter, Esc để đóng; Enter khi chưa chọn gợi ý thì sang `/courses?q=`.
- **MainNav:** chỉ icon ở `lg`, icon kèm nhãn ở `xl`; nền mục active (`primary-50`) trượt (`layoutId="main-nav"`).
- **BottomNav:** gạch chỉ báo active trượt (`layoutId="bottom-nav"`), icon đậm nét khi active, vùng chạm tối thiểu 44px, chừa `safe-area-inset-bottom`.
- **Manage sidebar:** mục hiện tại có nền trắng trượt (`layoutId="manage-nav"`), chữ `primary`, `font-semibold`; mục khác chữ trắng 85%, hover nền trắng 10%. Menu admin lọc theo quyền; mục Phân quyền chỉ Leader thấy.
- **Footer:** nền `primary-950`, `RoadPath` mờ, cột liên kết; chữ trắng 80% (đạt tương phản).

### Overlays & Feedback

- **Dialog (`ConfirmDialog`, hộp thoại form):** lớp phủ `bg-black/40` (`fadeIn`), hộp `rounded-2xl bg-white p-6 shadow-card-hover` (`scaleIn`), rộng `max-w-md` đến `max-w-lg`. Esc để đóng, khóa đóng khi đang gửi.
- **Toast:** `rounded-xl border border-line bg-white p-3 shadow-card-hover`, thanh màu theo loại ở cạnh trái, icon theo loại (`CircleCheck`, `CircleX`, `TriangleAlert`, `Info`) + nút đóng, vào bằng `slideInRight`, có `layout` để toast xếp lại mượt.
- **NotificationBell:** nút tròn 40px nền `surface`, icon `Bell` cỡ 20, huy hiệu số `bg-danger` chữ trắng 11px, `99+` khi vượt. Mở bảng thông báo bằng `dropdown`.
- **Trạng thái:** mọi danh sách, bảng, form có loading (skeleton đúng hình, hoặc `LoadingState`), rỗng (`EmptyState`), lỗi (`ErrorState`).

## 10. Motion

Hệ chuyển động phục vụ nhịp đọc và định hướng. Thư viện duy nhất `framer-motion`, preset trong `src/constants/motion.js` (kèm hằng `DURATION`, `STAGGER`, `EASE`, `VIEWPORT`).

### Dải thời lượng

| Nhóm         | Thời lượng | Hằng                 | Dùng cho                              |
| ------------ | ---------- | -------------------- | ------------------------------------- |
| Vi tương tác | 120–200ms  | `DURATION.micro`     | Hover, dropdown, lớp phủ, thoát       |
| Thành phần   | 200–350ms  | `DURATION.component` | Hộp thoại, drawer, toast, chuyển bước |
| Hiện section | 400–650ms  | `DURATION.reveal`    | Scroll reveal, ảnh                    |
| Hero         | 600–900ms  | `DURATION.hero`      | Tiêu đề hero, mở đầu trang chủ        |

Stagger 60–120ms (`STAGGER.tight`, `base`, `loose`). Easing `EASE.out` (`ease-out-soft`) cho hiện ra, `EASE.inOut` cho đường vẽ.

### Preset

| Preset                            | Hiệu ứng                                                     | Dùng cho                                                  |
| --------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------- |
| `fadeIn`                          | opacity                                                      | Lớp phủ hộp thoại                                         |
| `scaleIn`                         | opacity + scale 0.96 → 1                                     | Hộp thoại, cửa sổ nổi                                     |
| `dropdown`                        | opacity + y -8 → 0                                           | Menu người dùng, bảng thông báo, ô tìm kiếm mobile        |
| `slideUp`                         | opacity + y 12 → 0                                           | Khối nhỏ xuất hiện                                        |
| `slideInLeft`                     | x -100% → 0                                                  | Ngăn kéo menu quản lý                                     |
| `slideInRight`                    | opacity + x 24 → 0                                           | Toast                                                     |
| `stepSlide`                       | opacity + x 16 → 0 (thoát -16)                               | Chuyển bước trong form nhiều bước                         |
| `stagger`                         | `staggerChildren` 0.06s                                      | Danh sách ngắn                                            |
| `fadeUp`                          | opacity + y 24 → 0, 0.55s                                    | Section, khối chữ, thẻ trong lưới                         |
| `revealLeft`, `revealRight`       | opacity + x ∓32 → 0, 0.55s                                   | Khối hai cột bất đối xứng                                 |
| `scaleReveal`                     | opacity + scale 0.94 → 1, 0.55s                              | Bento tile, CTA band                                      |
| `imageReveal`                     | opacity + scale 1.08 → 1, 0.7s (khung cha `overflow-hidden`) | Ảnh hero, ảnh bìa chi tiết khóa                           |
| `heroLine`                        | y 105% → 0, 0.8s (khung cha `overflow-hidden`)               | Từng dòng tiêu đề hero                                    |
| `staggerOf(delay, delayChildren)` | factory `staggerChildren`                                    | Mọi container stagger                                     |
| `listItem`                        | opacity + scale 0.98, có `exit`                              | Kết quả lọc khóa học (`AnimatePresence mode="popLayout"`) |
| `pageEnter`                       | opacity + y 8 → 0, 0.25s, không exit                         | Chuyển trang                                              |
| `chatPanel`                       | opacity, scale 0.96, y 16, `visibility` khi đóng             | Mở/đóng chat (panel luôn mount)                           |
| `messageIn`                       | opacity + y 8 → 0, 0.2s                                      | Tin nhắn mới                                              |
| `pathDraw`                        | `pathLength` 0 → 1, 1.2s                                     | `RoadPath`                                                |
| `typingDot(index)`                | opacity 0.3 → 1 → 0.3, 1s, lặp khi đang chờ                  | Ba chấm "đang trả lời" của chatbot (ngoại lệ lặp)         |
| `accordion`                       | height 0 → auto + opacity, 0.28s (đóng 0.16s), có `exit`     | Câu trả lời FAQ (`AnimatePresence initial={false}`)       |
| `tabIndicator`                    | transition tween 0.28s                                       | `layoutId` của tab, chip, nav, `Switch`                   |
| `REVEAL_PRESETS`                  | bảng tên → preset                                            | Dùng bởi `Reveal`, `RevealGroup`                          |
| bell shake                        | rotate `[0, -16, 14, -10, 6, 0]`, 0.5s, một lần              | Chuông thông báo (trong `NotificationBell`)               |

### Mật độ chuyển động theo vùng

| Mức       | Vùng                                                                          | Được dùng                                                                                              |
| --------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Giàu      | Trang chủ, danh sách và chi tiết khóa học, trang giáo viên, thư viện tài liệu | Scroll reveal, stagger, ảnh reveal, parallax nhẹ (chỉ `lg` trở lên)                                    |
| Vừa       | Trang xác thực, khu học viên                                                  | `pageEnter`, `stepSlide`, indicator trượt, dialog, toast                                               |
| Tối thiểu | Form, thanh toán, thi, khu quản lý (giáo viên, admin)                         | Chỉ `pageEnter`/`fadeIn`, dropdown, dialog, toast, indicator sidebar. Không reveal, không stagger bảng |

Trang làm bài thi (`ExamLayout`) không có animation trang.

### Scroll reveal

- Dùng `Reveal` hoặc `RevealGroup`; mặc định chạy **một lần** (`VIEWPORT = { once: true, amount: 0.2 }`).
- Section đầu tiên (nằm trong màn hình lúc mở trang) không chờ cuộn: chạy ngay khi mount (`trigger="mount"`, tổng thời gian không quá 0.9s).
- Nội dung thiết yếu không phụ thuộc vào animation. Danh sách trên 20 phần tử không stagger.

### Quy tắc chuyển động

- Chỉ animate `opacity` và `transform` (x, y, scale, rotate) và `pathLength` của `RoadPath`; không animate `width`, `height`, `top`, `left`. Ngoại lệ duy nhất: preset `accordion` animate `height` cho panel FAQ.
- Không spring nảy, không scroll hijacking, không chặn cuộn.
- Parallax: tối đa ±24px, chỉ từ `lg` trở lên (`useMediaQuery`) và khi không giảm chuyển động; dùng motion value, không `useState` theo pixel cuộn.
- `ScrollProgress` và đường tiến trình dùng `useScroll` + `scaleX`/`scaleY`, không setState.
- Hover, focus của nút, link, input dùng CSS `transition` 150–200ms.
- `AnimatePresence` cho modal, toast, dropdown khi mount/unmount.
- **Mobile:** giảm khoảng dịch chuyển, tắt parallax, tắt stagger dài; hiệu ứng chỉ phục vụ đọc.
- **Reduced motion:** gốc app bọc `MotionConfig reducedMotion="user"` (`src/main.jsx`) nên các dịch chuyển (x, y, scale) bị bỏ, chỉ còn opacity; `theme.css` đặt `transition-duration`/`animation-duration` về 0.01ms và tắt `scroll-behavior: smooth`. Hiệu ứng tự kích hoạt kiểm tra thêm `useReducedMotion`.
- **Ba ngoại lệ lặp đã chốt:** `Loader2 animate-spin` (spinner đang tải), bong bóng gõ của chatbot (chỉ hiện khi `sender.isPending`, tĩnh khi giảm chuyển động) và logo `SoftLogoCanvas` của `GlobalLoadingOverlay` (chỉ chạy khi lớp phủ đang hiện, đứng yên khi giảm chuyển động).
- Cấm: bounce, pulse, skeleton nhấp nháy (`animate-pulse`), `repeat: Infinity` ngoài ba ngoại lệ trên, gradient chuyển động, GSAP, anime.js, AOS, react-spring, CSS keyframes tự viết.

## 11. Responsive

- **Mobile-first:** class gốc cho màn hẹp, mở rộng bằng `sm:`, `md:`, `lg:`, `xl:`, `2xl:` (breakpoint chuẩn Tailwind ở frontmatter).
- Không tràn ngang ở 320, 375, 768, 1024, 1440 và 1920px. Bảng rộng cuộn ngang trong khung riêng.
- Container tối đa 1440px, căn giữa trên màn 1920px.
- `Sidebar` công khai chỉ hiện từ `xl` để màn 1024px không có ba cột.
- Trang học viên dùng thanh điều hướng dưới trên điện thoại. Khu quản lý ưu tiên desktop, menu thành ngăn kéo trên màn nhỏ.
- Không tự đổi layout so với ảnh thiết kế đính kèm trong task.

## 12. Accessibility

- Vùng chạm 44px cho nút, ô nhập, mục `BottomNav`.
- Focus luôn nhìn thấy: toàn cục `:focus-visible` viền 2px `primary-light`, offset 2px. Esc đóng hộp thoại. Dùng đúng vai trò `dialog`, `switch`, `tab`, `alert`, `status` và nhãn truy cập cho nút chỉ có icon.
- Tôn trọng `prefers-reduced-motion` (xem mục 10).
- Skeleton bọc `role="status"` kèm chữ `sr-only` "Đang tải".

### Kết quả đo tương phản (WCAG, tính ngày 26/11)

| Cặp màu                                                   | Tỉ lệ | Đạt chữ thường (4.5:1)                                  |
| --------------------------------------------------------- | ----- | ------------------------------------------------------- |
| `muted` (`#646b78`) trên `page`                           | 5.04  | Đạt                                                     |
| `muted` trên `surface`                                    | 4.82  | Đạt                                                     |
| `muted` trên trắng                                        | 5.36  | Đạt                                                     |
| `ink` trên trắng                                          | 14.68 | Đạt                                                     |
| `ink-strong` trên trắng                                   | 16.61 | Đạt                                                     |
| Chữ trắng trên `primary`                                  | 6.86  | Đạt                                                     |
| Chữ trắng trên `primary-dark`                             | 9.31  | Đạt                                                     |
| `primary` trên `primary-50`                               | 6.24  | Đạt                                                     |
| Chữ trắng trên `primary-950`                              | 13.98 | Đạt                                                     |
| Chữ trắng 70% trên `primary-950`                          | 7.57  | Đạt                                                     |
| `accent-strong` trên trắng                                | 6.56  | Đạt                                                     |
| `accent-strong` trên `accent-soft`                        | 5.75  | Đạt                                                     |
| Chữ trắng trên `secondary-strong`                         | 5.97  | Đạt                                                     |
| `success-strong`, `warning-strong` trên trắng             | 5.02  | Đạt                                                     |
| `success-strong`, `warning-strong` trên nền 10% cùng tông | 4.50  | Đạt (sát ngưỡng)                                        |
| `danger-strong` trên nền 10% `danger`                     | 5.54  | Đạt                                                     |
| `info-strong` trên nền 10% `info`                         | 5.82  | Đạt                                                     |
| `danger` trên trắng                                       | 4.83  | Đạt                                                     |
| `success` trên trắng                                      | 3.30  | **Không**: chỉ dùng cho chấm, icon, viền                |
| `accent` trên trắng                                       | 3.56  | **Không**: chỉ cho sao, chấm, nền                       |
| `secondary` trên trắng                                    | 2.53  | **Không**: chỉ cho chấm, viền, nền                      |
| Chữ trắng trên `sky`                                      | 2.64  | **Không**: `sky` chỉ trong gradient, không dùng cho chữ |

Chữ trạng thái và chữ điểm nhấn luôn dùng tông `*-strong`.

## 13. Do's and Don'ts

| Do                                                                      | Don't                                                                   |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Dùng token (`primary`, `ink`, `line`...) qua class Tailwind             | Viết mã hex, `rgb(...)`, dùng `slate`/`gray`/`amber`/`red` của Tailwind |
| Dùng component sẵn có trong `components/ui`, `components/common`        | Tạo component trùng chức năng với cái đã có                             |
| Bo góc theo bậc `lg` → `xl` → `2xl`                                     | Bo khối nội dung quá `rounded-2xl` hoặc đổi nút sang `rounded-full`     |
| `font-bold` cho tiêu đề, giá, số liệu                                   | Dùng `font-bold` cho nút, nhãn, văn bản thường                          |
| Icon `lucide-react` cỡ 16/20/24, có trong spec                          | Emoji, bộ icon khác, SVG tự vẽ ngoài `RoadPath`                         |
| Preset trong `motion.js`, `Reveal`/`RevealGroup` cho scroll reveal      | Thư viện animation khác, bounce, `animate-pulse`, lặp vô hạn            |
| Gradient qua `bg-brand-gradient`... ở hero, CTA, panel xác thực, footer | Gradient trên nút, thẻ thường hoặc viết trong JSX                       |
| Skeleton tĩnh đúng kích thước nội dung thật                             | Spinner toàn trang khi đã biết hình dạng nội dung                       |
| Chữ điểm nhấn và chữ trạng thái dùng tông `*-strong`                    | Chữ nhỏ `accent`, `success` trên nền trắng                              |
| Bộ lọc có nút **Tất cả** đứng đầu                                       | Bộ lọc khóa học thiếu lựa chọn Tất cả                                   |
| Đủ loading, rỗng, lỗi; nút gọi API `disabled` + loading                 | Để người dùng bấm đúp gửi trùng                                         |
| Ảnh bìa qua `CourseCover`, ảnh minh chứng qua `ProofImage`              | `<img src>` trực tiếp cho ảnh bìa hoặc ảnh minh chứng                   |
| Giảm chuyển động trên mobile và khi người dùng bật reduced motion       | Parallax trên mobile, animate `width/height/top/left`                   |
| Đối chiếu spec và ảnh thiết kế; thiếu thông tin thì hỏi                 | Tự thêm hiệu ứng không có trong spec                                    |
