---
paths:
  - "FE_RStudy/src/**/*.jsx"
  - "FE_RStudy/src/**/*.css"
  - "FE_RStudy/src/constants/motion.js"
  - "DESIGN_SYSTEM.md"
---

# Tuân thủ design system

`DESIGN_SYSTEM.md` (thư mục gốc) là tài liệu thiết kế chính thức: token ở YAML frontmatter, quy tắc ở phần Markdown. Rule này chỉ quy định cách áp dụng, không chép token.

## Trước khi làm giao diện

1. Đọc `DESIGN_SYSTEM.md`, phần liên quan tới thành phần đang làm (Colors, Components, Motion, Responsive...).
2. Đọc spec trang trong yêu cầu của task (mẫu ở mục "Spec trang" của `frontend.md`) và ảnh thiết kế nếu có.
3. Tìm component sẵn có trong `src/components/ui` và `src/components/common` trước khi viết mới.

## Khi viết

- Màu, bóng, font chỉ qua token trong `FE_RStudy/src/assets/styles/theme.css` (class Tailwind như `bg-primary`, `text-muted`, `shadow-card`). Token chưa có thì khai báo trong `theme.css` và `DESIGN_SYSTEM.md` cùng lúc, sau khi được duyệt.
- Animation chỉ dùng preset trong `src/constants/motion.js`. Preset mới phải thêm vào `motion.js` và bảng Motion của `DESIGN_SYSTEM.md`.
- Mobile-first: viết class cho màn hẹp trước, mở rộng bằng `sm:`, `md:`, `lg:`.
- Không tự đổi phong cách (màu, bo góc, bóng, font) so với design system và ảnh thiết kế.

## Kiểm tra trước khi báo xong

| Hạng mục   | Cách kiểm                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------- |
| Token      | `grep` file vừa sửa không có `#hex`, `rgb(`, `slate-`, `gray-`, `shadow-sm/md/lg`         |
| Bo góc     | Nút/ô nhập `rounded-lg`, thẻ/panel `rounded-xl`, hộp thoại `rounded-2xl`                  |
| Icon       | Chỉ `lucide-react`, cỡ 16 / 20 / 24, có ghi trong spec                                    |
| Motion     | Chỉ preset có sẵn; scroll-reveal đúng phạm vi; không lặp vô hạn; tôn trọng reduced motion |
| Responsive | Không tràn ngang ở 320, 375, 768, 1024, 1440px                                            |
| Trạng thái | Có loading, empty, error; nút gọi API có `disabled` + loading                             |
| A11y       | Vùng chạm 44px, focus nhìn thấy được, Esc đóng hộp thoại, nhãn cho nút chỉ có icon        |

Code đang lệch design system (ví dụ class không có token tương ứng) thì báo lại, không tự sửa ngoài phạm vi.
