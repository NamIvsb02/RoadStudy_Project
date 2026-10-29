# Phân công và quy trình làm việc

## Thông tin chung
- Đề tài: RoadStudy, website đăng ký khóa học trực tuyến tích hợp AI gợi ý khóa học
- Nhóm: Nam, Huynh, Khang. Hạn chót: 16/11/2026
- Tiến độ và deadline từng việc: xem file Excel công việc của nhóm (không chép lại ở đây để khỏi bị lệch)

## Phân công

| Người | Backend | Frontend |
|---|---|---|
| Nam | Auth (kể cả OTP, quên/đổi mật khẩu, refresh token), Account/Student/Teacher, Admin + phân quyền, Resource, Violation report, schema và seed | Setup FE, đăng nhập/đăng ký/hồ sơ, trang admin |
| Huynh | Category, Course (giáo viên + công khai), Comment + Reply, Review + Review response | Danh sách + chi tiết khóa học, trang giáo viên (tạo khóa, review, comment, discount) |
| Khang | Discount (mã giảm giá), Exam + Question + AnswerOption, Registration, Invoice, Exam attempt, AI (chatbot + gợi ý khóa học) | Đăng ký khóa học, thanh toán, làm bài thi, chatbot |

Các bài test cuối (phân quyền, đăng ký → thanh toán → thi, course → review/comment) làm chung cả nhóm.

## Quy trình Git
- Chỉ Nam sửa `prisma/schema.prisma`. Cần thêm/sửa bảng hoặc field thì báo Nam.
- Mỗi người làm trên nhánh riêng, đặt tên `feature/<ten-viec>` (ví dụ `feature/category`, `feature/discount`).
- Code xong thì tự tạo Pull Request trên GitHub rồi tự merge vào `main`, sau đó báo trong nhóm.
- Không commit `.env` và `node_modules`.
- Sau khi pull code mới: `npm install`, kiểm tra `.env` đủ biến, chạy `npx prisma migrate dev`.
- Mỗi người dùng database PostgreSQL riêng trên máy mình, không dùng chung.