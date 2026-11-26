---
paths:
  - "BE_RStudy/prisma/**"
  - "BE_RStudy/database/**"
  - "BE_RStudy/prisma.config.ts"
  - "BE_RStudy/src/repositories/**"
  - "BE_RStudy/src/config/database.js"
---

# Cơ sở dữ liệu

## Database dùng chung

- Cả nhóm dùng **một project Supabase (PostgreSQL)**. Mọi lệnh ghi đều tác động dữ liệu của cả nhóm.
- App kết nối bằng `DATABASE_URL` (pooler). Prisma CLI (`migrate`, `db seed`) đọc `prisma.config.ts` và dùng `DIRECT_URL` (kết nối trực tiếp); thiếu `DIRECT_URL` thì migrate/seed lỗi.
- `BE_RStudy/database/schema.sql`, `seed.sql` chỉ để tham khảo. Nguồn chuẩn là `prisma/schema.prisma` và `prisma/migrations/`.

## Lệnh được phép

| Lệnh                                                   | Ai chạy     | Điều kiện                                                                 |
| ------------------------------------------------------ | ----------- | ------------------------------------------------------------------------- |
| `npx prisma generate` / `npm run db:generate`          | Mọi người   | Sau khi pull hoặc schema đổi                                              |
| `npx prisma migrate status`, `npx prisma validate`     | Mọi người   | Chỉ đọc                                                                   |
| `npx prisma format`, `npx prisma migrate dev --name x` | **Chỉ Nam** | Phải xin phép; commit `prisma/migrations/` cùng `schema.prisma`, báo nhóm |
| `npx prisma db seed`                                   | **Chỉ Nam** | Phải xin phép; ghi đè dữ liệu chung                                       |
| `npx prisma migrate reset`, `db push`, xóa dữ liệu     | **Cấm**     | Trừ khi Nam duyệt rõ ràng                                                 |

- Người khác cần đổi schema thì báo Nam, không tự sửa `schema.prisma`.
- Sau khi pull: chỉ `npx prisma generate`, **không** tự chạy `migrate dev` (migration đã được áp lên DB chung).

## Quy ước schema

- Khóa chính `String @id @default(uuid()) @db.VarChar(36)`.
- Thời gian `DateTime` (Prisma mặc định `timestamp(3)`), luôn lưu UTC.
- Tiền `Decimal @db.Decimal(12, 2)`.
- Quan hệ giữ hành vi `Restrict` mặc định, không dùng `onDelete: Cascade`. Không xóa cứng dữ liệu đã có quan hệ, dùng trường `status` (ví dụ `HOAT_DONG` / ẩn).
- Giá trị enum khớp `BE_RStudy/docs/enum.md`. Thêm hoặc sửa enum phải cập nhật file này trong cùng commit.
- Ràng buộc "chỉ một bản ghi còn hiệu lực" (ví dụ đơn đăng ký) làm ở service, không dựa vào unique index.

## Repository

- Chỉ chứa lệnh Prisma, không có nghiệp vụ. Ưu tiên `select` chỉ các trường cần, không để `passwordHash` lọt ra response.
- Hàm dùng được trong transaction nhận `tx` tùy chọn theo mẫu `const db = (tx) => tx || prisma;` (xem `enrollmentRepository.js`).
