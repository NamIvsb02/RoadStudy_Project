---
paths:
  - "BE_RStudy/src/**"
  - "FE_RStudy/src/**"
---

# Bảo mật và phân quyền

Backend là nơi chặn thật. Ẩn menu, nút ở FE chỉ để giao diện gọn, không phải bảo mật.

## Xác thực

- JWT Bearer: access token 15 phút, refresh token 7 ngày (xoay vòng), OTP 10 phút.
- `authenticate` gán `req.user = { id, role }`. Vai trò luôn lấy từ token, không tin dữ liệu client gửi.
- Không còn đăng nhập giả: header `x-dev-role` và `DEV_AUTH_BYPASS` không còn tác dụng.
- Rủi ro đã chấp nhận: FE lưu access và refresh token trong `localStorage` (qua `utils/tokenStorage`), nên nếu có lỗ hổng XSS thì token bị lấy. Hiện không dùng `dangerouslySetInnerHTML`. Hướng nâng cấp: chuyển refresh token sang cookie `httpOnly` (phải đổi cả luồng auth FE và BE).
- Tài khoản `CHO_XAC_MINH` chưa đăng nhập được. Giáo viên `CHO_DUYET` / `TU_CHOI` bị 403 ở cả `login` lẫn `refresh` (`assertTeacherApproved`).

## Phân quyền ở backend

| Middleware                    | Khi dùng                                                              |
| ----------------------------- | --------------------------------------------------------------------- |
| `authorize("TEACHER", ...)`   | Giới hạn vai trò `STUDENT`, `TEACHER`, `ADMINISTRATOR`                |
| `requireAdmin`                | Admin đang hoạt động; nạp `req.admin = { id, isLeader, permissions }` |
| `requirePermission(P.X, ...)` | Admin có ít nhất một quyền trong danh sách. Leader luôn qua           |
| `requireLeader`               | Chỉ quản trị viên trưởng                                              |

- Route admin bắt buộc đủ ba lớp: `[authenticate, authorize("ADMINISTRATOR"), requirePermission(PERMISSIONS.X)]`.
- Route dùng chung giáo viên và admin chỉ kiểm tra quyền khi là admin (mẫu ở `examRoutes.js`, `learningRoutes.js`):

  ```js
  (req, res, next) =>
    req.user.role === "ADMINISTRATOR"
      ? requirePermission(PERMISSIONS.QUAN_LY_BAI_THI)(req, res, next)
      : next();
  ```

- `requirePermission` đọc DB mỗi request, Leader thu hồi quyền có hiệu lực ngay.
- 8 quyền khai báo duy nhất ở `BE_RStudy/src/constants/permissions.js` và `FE_RStudy/src/constants/permissions.js`, trùng `functionName` trong DB: `QUAN_LY_KHOA_HOC`, `QUAN_LY_TAI_KHOAN`, `QUAN_LY_MA_GIAM_GIA`, `QUAN_LY_BAI_THI`, `XU_LY_BAO_CAO_VI_PHAM`, `QUAN_LY_THANH_TOAN`, `XU_LY_HOAN_TIEN`, `DUYET_GIAO_VIEN`. Không gõ chuỗi quyền trực tiếp.
- Quyền sở hữu kiểm tra ở Service: giáo viên chỉ sửa khóa/đề của mình; học viên chỉ xem hóa đơn/bài làm của mình. Không phải của mình thì trả 404, không lộ sự tồn tại.

## Dữ liệu nhạy cảm

| Dữ liệu                         | Quy tắc                                                                    |
| ------------------------------- | -------------------------------------------------------------------------- |
| `passwordHash`                  | Không bao giờ trả ra response                                              |
| `isCorrect` của đáp án          | Không trả khi đang thi. Sau khi nộp chỉ trả khi `Exam.showAnswers = true`  |
| Ảnh minh chứng `uploads/proofs` | Không phục vụ tĩnh. Chỉ qua `GET /invoice/:id/proof` có kiểm tra quyền     |
| `classUrl`, `driveUrl`          | Chỉ trả cho học viên có đơn `DA_THANH_TOAN` (và giáo viên/admin liên quan) |

## AI và prompt

- AI chỉ chọn trong danh sách khóa `DANG_MO` do hệ thống cung cấp. Kết quả phải đối chiếu lại (index hợp lệ, không trùng) trước khi dùng.
- Nội dung người dùng đưa vào prompt đặt trong khối rào `"""` và dặn mô hình không làm theo chỉ dẫn bên trong.
- Chatbot chỉ cho `STUDENT`: tối đa 500 ký tự mỗi tin, 6 tin mỗi phút (vượt trả 429).

## Không được làm

- Tắt `authenticate`, `authorize`, `requirePermission`, validate hoặc `helmet` để sửa nhanh.
- Thêm thư mục upload vào danh sách phục vụ tĩnh khi chưa được duyệt.
- Ở FE: đọc/ghi token trực tiếp từ `localStorage` (dùng `utils/tokenStorage`), đặt URL ảnh minh chứng vào `<img src>`.

Thay đổi liên quan thanh toán, hoàn tiền, đăng ký, phân quyền, OTP/JWT phải đối chiếu `business.md` và test các nhánh biên (401, 403, 404, 409).
