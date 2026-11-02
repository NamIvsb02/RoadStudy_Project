# Enum dùng chung BE và FE

Quy ước:

- Cột **Giá trị** là chuỗi đúng như DB và API trả về. FE không đổi chữ hoa hay thường.
- Cột **Nhãn** là chữ hiển thị trên giao diện.
- Cột **Màu** là màu của StatusBadge: xám, vàng, xanh lá, đỏ, xanh dương.
- Thêm hoặc sửa enum trong `schema.prisma` (chỉ Nam) thì phải cập nhật file này cùng lúc và báo nhóm.

## Người dùng

### Role (vai trò tài khoản)

| Giá trị       | Nhãn          | Ghi chú                                 |
| ------------- | ------------- | --------------------------------------- |
| STUDENT       | Học viên      |                                         |
| TEACHER       | Giáo viên     |                                         |
| ADMINISTRATOR | Quản trị viên | Có `isLeader` để phân biệt admin trưởng |

### AccountStatus

| Giá trị      | Nhãn         | Màu     | Ghi chú                                               |
| ------------ | ------------ | ------- | ----------------------------------------------------- |
| CHO_XAC_MINH | Chờ xác minh | vàng    | Mới đăng ký, chưa nhập OTP. Chưa đăng nhập được (403) |
| HOAT_DONG    | Hoạt động    | xanh lá |                                                       |
| BI_KHOA      | Bị khóa      | đỏ      | Không đăng nhập, không refresh được (403)             |

### Gender

| Giá trị       | Nhãn          |
| ------------- | ------------- |
| NAM           | Nam           |
| NU            | Nữ            |
| KHAC          | Khác          |
| KHONG_TIET_LO | Không tiết lộ |

### ApprovalStatus (duyệt giáo viên)

| Giá trị   | Nhãn      | Màu     | Ghi chú                            |
| --------- | --------- | ------- | ---------------------------------- |
| CHO_DUYET | Chờ duyệt | vàng    | Mặc định khi đăng ký làm giáo viên |
| DA_DUYET  | Đã duyệt  | xanh lá | Được tạo khóa học                  |
| TU_CHOI   | Từ chối   | đỏ      | Admin duyệt lại được               |

### OtpPurpose

| Giá trị        | Nhãn           | Ghi chú                                                |
| -------------- | -------------- | ------------------------------------------------------ |
| XAC_MINH_EMAIL | Xác minh email | Dùng ở `/auth/verify-email`, `/auth/resend-otp`        |
| QUEN_MAT_KHAU  | Quên mật khẩu  | Dùng ở `/auth/forgot-password`, `/auth/reset-password` |

## Phân quyền admin

### FunctionStatus

| Giá trị         | Nhãn            | Màu     |
| --------------- | --------------- | ------- |
| HOAT_DONG       | Hoạt động       | xanh lá |
| NGUNG_HOAT_DONG | Ngừng hoạt động | xám     |

## Khóa học

### CategoryStatus

| Giá trị   | Nhãn      | Màu     | Ghi chú                |
| --------- | --------- | ------- | ---------------------- |
| HOAT_DONG | Hoạt động | xanh lá | Hiện ở trang công khai |
| AN        | Ẩn        | xám     | Không hiện công khai   |

### CourseStatus

| Giá trị      | Nhãn         | Màu        | Ghi chú                                       |
| ------------ | ------------ | ---------- | --------------------------------------------- |
| BAN_NHAP     | Bản nháp     | xám        | Chỉ giáo viên chủ khóa thấy                   |
| CHO_DUYET    | Chờ duyệt    | vàng       | Giáo viên đã gửi duyệt                        |
| DA_PHE_DUYET | Đã phê duyệt | xanh dương | Admin đã duyệt, chưa mở                       |
| DANG_MO      | Đang mở      | xanh lá    | Công khai, cho đăng ký. AI chỉ gợi ý khóa này |
| TAM_NGUNG    | Tạm ngưng    | đỏ         |                                               |
| DA_KET_THUC  | Đã kết thúc  | xám        |                                               |

## Đăng ký và thanh toán

### RegistrationStatus

| Giá trị        | Nhãn           | Màu     | Ghi chú                                                       |
| -------------- | -------------- | ------- | ------------------------------------------------------------- |
| CHO_THANH_TOAN | Chờ thanh toán | vàng    | Cả khi đã gửi minh chứng mà admin chưa duyệt, hoặc bị từ chối |
| DA_THANH_TOAN  | Đã thanh toán  | xanh lá | Được học, bình luận, đánh giá, thi                            |
| HOAN_TIEN      | Đã hoàn tiền   | xám     | Trong 24 giờ kể từ `paidAt`                                   |
| HOAN_THANH     | (không dùng)   |         | Có trong enum nhưng hệ thống không dùng, FE bỏ qua            |

Không có trạng thái hủy: học viên không được hủy đăng ký.

### InvoiceStatus

| Giá trị        | Nhãn           | Màu     | Ghi chú                                                         |
| -------------- | -------------- | ------- | --------------------------------------------------------------- |
| CHO_THANH_TOAN | Chờ thanh toán | vàng    | Có `paymentProofUrl` nghĩa là đã gửi minh chứng, chờ admin      |
| DA_THANH_TOAN  | Đã thanh toán  | xanh lá | Có `paidAt`                                                     |
| THAT_BAI       | Bị từ chối     | đỏ      | Admin từ chối, có lý do. Học viên gửi lại thì về CHO_THANH_TOAN |
| HOAN_TIEN      | Đã hoàn tiền   | xám     |                                                                 |
| DA_HUY         | Đã hủy         | xám     | Có trong enum, luồng hiện tại chưa dùng                         |

### PaymentMethod

| Giá trị              | Nhãn                 |
| -------------------- | -------------------- |
| TIEN_MAT             | Tiền mặt             |
| CHUYEN_KHOAN         | Chuyển khoản         |
| THE                  | Thẻ                  |
| VI_DIEN_TU           | Ví điện tử           |
| CONG_THANH_TOAN_KHAC | Cổng thanh toán khác |

### DiscountStatus

| Giá trị   | Nhãn      | Màu     |
| --------- | --------- | ------- |
| HOAT_DONG | Hoạt động | xanh lá |
| TAM_NGUNG | Tạm ngưng | vàng    |
| HET_HAN   | Hết hạn   | xám     |

### SupportRequestType

| Giá trị            | Nhãn               |
| ------------------ | ------------------ |
| HOAN_TIEN_KHOA_HOC | Hoàn tiền khóa học |

### SupportRequestStatus

| Giá trị   | Nhãn      | Màu     |
| --------- | --------- | ------- |
| CHO_XU_LY | Chờ xử lý | vàng    |
| DA_XU_LY  | Đã xử lý  | xanh lá |
| TU_CHOI   | Từ chối   | đỏ      |

## Đánh giá, bình luận, báo cáo

### ReviewStatus

| Giá trị   | Nhãn      | Màu     |
| --------- | --------- | ------- |
| CHO_DUYET | Chờ duyệt | vàng    |
| HIEN_THI  | Hiển thị  | xanh lá |
| AN        | Đã ẩn     | xám     |
| VI_PHAM   | Vi phạm   | đỏ      |

### ContentStatus (dùng cho Comment, Reply, ReviewResponse)

| Giá trị  | Nhãn     | Màu     |
| -------- | -------- | ------- |
| HIEN_THI | Hiển thị | xanh lá |
| AN       | Đã ẩn    | xám     |
| VI_PHAM  | Vi phạm  | đỏ      |

### ReportStatus (báo cáo vi phạm)

| Giá trị    | Nhãn       | Màu        |
| ---------- | ---------- | ---------- |
| CHO_XU_LY  | Chờ xử lý  | vàng       |
| DANG_XU_LY | Đang xử lý | xanh dương |
| DA_XU_LY   | Đã xử lý   | xanh lá    |
| TU_CHOI    | Từ chối    | đỏ         |

## Thi

### ExamStatus

| Giá trị      | Nhãn         | Màu        | Ghi chú                       |
| ------------ | ------------ | ---------- | ----------------------------- |
| BAN_NHAP     | Bản nháp     | xám        |                               |
| DA_PHE_DUYET | Đã phê duyệt | xanh dương |                               |
| DANG_MO      | Đang mở      | xanh lá    | Học viên mới thấy và làm được |
| TAM_NGUNG    | Tạm ngưng    | đỏ         |                               |

### AttemptStatus

| Giá trị  | Nhãn     | Màu        | Ghi chú                                           |
| -------- | -------- | ---------- | ------------------------------------------------- |
| DANG_LAM | Đang làm | xanh dương | Mỗi lần chỉ mở 1 bài. Tối đa 3 lượt cho mỗi đề    |
| DA_NOP   | Đã nộp   | vàng       |                                                   |
| DA_CHAM  | Đã chấm  | xanh lá    | Chấm ở server, không trả `isCorrect` cho học viên |
| HUY      | Đã hủy   | xám        |                                                   |

## AI

### SenderType

| Giá trị | Nhãn      |
| ------- | --------- |
| STUDENT | Học viên  |
| AI      | Trợ lý AI |
