# Phân công và quy trình làm việc

## Thông tin chung

- Đề tài: RoadStudy, website đăng ký khóa học trực tuyến tích hợp AI gợi ý khóa học
- Nhóm: Nam, Huynh, Khang. Hạn chót: 16/11/2026
- Phân công, tiến độ và deadline từng việc: xem file Excel công việc của nhóm (không chép lại ở đây để khỏi bị lệch)
- Người phụ trách từng module API ghi ở tiêu đề mục tương ứng trong `api-spec.md`.

Các bài test cuối (phân quyền, đăng ký → thanh toán → thi, course → review/comment) làm chung cả nhóm.

## Database

- Cả nhóm dùng chung **một project Supabase (PostgreSQL)**. Nam cấp `DATABASE_URL` (chuỗi qua pooler, app dùng) và `DIRECT_URL` (chuỗi kết nối trực tiếp, Prisma CLI dùng cho migrate/seed). Không dán hai chuỗi này vào chat hay tài liệu.
- Vì DB dùng chung: không chạy `npx prisma migrate reset`, không seed lại khi chưa báo cả nhóm.

## Quy trình Git

- Chỉ Nam sửa `prisma/schema.prisma`. Cần thêm/sửa bảng hoặc field thì báo Nam. Nam chạy `npx prisma migrate dev --name <ten>`, commit `prisma/migrations/` cùng schema rồi báo nhóm.
- Mỗi người làm trên nhánh riêng, đặt tên `feature/<ten-viec>` (ví dụ `feature/category`, `feature/discount`).
- Code xong thì tạo Pull Request vào `main` trên GitHub. CodeRabbit tự review, người tạo PR sửa theo góp ý, sau đó Nam duyệt và merge. Không push thẳng lên `main`.
- Không commit `.env` và `node_modules`.
- Sau khi pull code mới: `npm install`, kiểm tra `.env` đủ biến (so với `.env.example`). Migration đã được áp lên DB chung khi Nam chạy, nên người khác chỉ cần `npx prisma generate` (kiểm tra bằng `npx prisma migrate status`), **không** tự chạy `migrate dev`.
