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

| Giá trị   | Nhãn      | Màu     | Ghi chú                                                                          |
| --------- | --------- | ------- | -------------------------------------------------------------------------------- |
| CHO_DUYET | Chờ duyệt | vàng    | Mặc định khi đăng ký làm giáo viên. Chưa đăng nhập được (403 ở login và refresh) |
| DA_DUYET  | Đã duyệt  | xanh lá | Đăng nhập và tạo khóa học được                                                   |
| TU_CHOI   | Từ chối   | đỏ      | Không đăng nhập được (403 ở login và refresh). Admin duyệt lại được              |

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

Danh mục `AN` kéo theo khóa học và tài liệu thuộc danh mục đó bị ẩn khỏi các API công khai, giáo viên không tạo hay gửi duyệt khóa vào danh mục ẩn, admin không mở được khóa thuộc danh mục ẩn. Chỉ xóa hẳn được danh mục chưa có khóa học hay tài liệu nào.

### CourseStatus

| Giá trị      | Nhãn         | Màu        | Ghi chú                                                                                 |
| ------------ | ------------ | ---------- | --------------------------------------------------------------------------------------- |
| BAN_NHAP     | Bản nháp     | xám        | Trạng thái lúc tạo. Chỉ giáo viên chủ khóa và admin thấy. Admin từ chối thì khóa về đây |
| CHO_DUYET    | Chờ duyệt    | vàng       | Giáo viên đã gửi duyệt. Giáo viên không sửa được                                        |
| DA_PHE_DUYET | Đã phê duyệt | xanh dương | Admin đã duyệt, chưa mở đăng ký                                                         |
| DANG_MO      | Đang mở      | xanh lá    | Công khai, cho đăng ký, bình luận, đánh giá. AI chỉ gợi ý khóa này                      |
| TAM_NGUNG    | Tạm ngưng    | đỏ         | Ẩn khỏi trang công khai, admin mở lại được                                              |
| DA_KET_THUC  | Đã kết thúc  | xám        | Trạng thái cuối. Giáo viên không sửa được                                               |

Chuyển trạng thái: giáo viên `BAN_NHAP` → `CHO_DUYET`; admin `CHO_DUYET` → `DA_PHE_DUYET` hoặc `BAN_NHAP`, `DA_PHE_DUYET` → `DANG_MO`, `DANG_MO` ↔ `TAM_NGUNG`, `DANG_MO`/`TAM_NGUNG` → `DA_KET_THUC`. Chi tiết ở mục Course của `api-spec.md`.

## Đăng ký và thanh toán

### RegistrationStatus

| Giá trị        | Nhãn           | Màu     | Ghi chú                                                                          |
| -------------- | -------------- | ------- | -------------------------------------------------------------------------------- |
| CHO_THANH_TOAN | Chờ thanh toán | vàng    | Cả khi đã gửi minh chứng mà admin chưa duyệt, hoặc bị từ chối. Học viên hủy được |
| DA_THANH_TOAN  | Đã thanh toán  | xanh lá | Được học, bình luận, đánh giá, thi                                               |
| HOAN_TIEN      | Đã hoàn tiền   | xám     | Trong 24 giờ kể từ `paidAt`. Sau khi đã hoàn tiền được đăng ký lại được khóa này |
| DA_HUY         | Đã hủy         | xám     | Học viên tự hủy khi chưa được duyệt. Được đăng ký lại (tạo đơn mới)              |
| HOAN_THANH     | (không dùng)   |         | Có trong enum nhưng hệ thống không dùng, FE bỏ qua                               |

Học viên hủy được đơn khi đơn còn `CHO_THANH_TOAN` (admin chưa duyệt). Hủy xong đăng ký lại cùng khóa được, hệ thống tạo đơn mới và giữ đơn cũ. Đơn `HOAN_TIEN` cũng đăng ký lại được bằng đơn mới (miễn là không còn yêu cầu hoàn tiền chờ xử lý cho khóa đó).

### InvoiceStatus

| Giá trị        | Nhãn           | Màu     | Ghi chú                                                         |
| -------------- | -------------- | ------- | --------------------------------------------------------------- |
| CHO_THANH_TOAN | Chờ thanh toán | vàng    | Có `paymentProofUrl` nghĩa là đã gửi minh chứng, chờ admin      |
| DA_THANH_TOAN  | Đã thanh toán  | xanh lá | Có `paidAt`                                                     |
| THAT_BAI       | Bị từ chối     | đỏ      | Admin từ chối, có lý do. Học viên gửi lại thì về CHO_THANH_TOAN |
| HOAN_TIEN      | Đã hoàn tiền   | xám     |                                                                 |
| DA_HUY         | Đã hủy         | xám     | Hóa đơn của đơn đã hủy, giữ lại `paymentProofUrl`               |

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

| Giá trị       | Nhãn          | Màu        | Ghi chú                                                  |
| ------------- | ------------- | ---------- | -------------------------------------------------------- |
| CHO_XU_LY     | Chờ xử lý     | vàng       | Học viên đã gửi yêu cầu hoàn tiền, admin chưa quyết định |
| CHO_HOAN_TIEN | Chờ hoàn tiền | xanh dương | Admin đã chấp thuận yêu cầu, đang chờ hoàn tiền thực tế  |
| DA_XU_LY      | Đã xử lý      | xanh lá    | Đã hoàn tiền thành công                                  |
| TU_CHOI       | Từ chối       | đỏ         | Admin từ chối yêu cầu, có lý do                          |

**Quy tắc:** Yêu cầu hoàn tiền chỉ chuyển sang `DA_XU_LY` sau khi việc hoàn tiền thực tế hoàn tất. Không được chuyển `RegistrationStatus` và `InvoiceStatus` sang `HOAN_TIEN` chỉ vì admin đã chấp thuận yêu cầu.

## Đánh giá, bình luận, báo cáo

### ReviewStatus

| Giá trị   | Nhãn      | Màu     | Ghi chú                                                   |
| --------- | --------- | ------- | --------------------------------------------------------- |
| CHO_DUYET | Chờ duyệt | vàng    | (không dùng) Đánh giá mới hiển thị ngay, không qua duyệt  |
| HIEN_THI  | Hiển thị  | xanh lá | Trạng thái lúc tạo                                        |
| AN        | Đã ẩn     | xám     | (chưa dùng) Chưa có API ẩn hay xóa đánh giá               |
| VI_PHAM   | Vi phạm   | đỏ      | Admin chốt báo cáo vi phạm `DA_XU_LY`. Không hiển thị nữa |

Học viên đã có một đánh giá (mọi trạng thái, kể cả `VI_PHAM`) cho khóa thì không gửi đánh giá mới được.

### ContentStatus (dùng cho Comment, Reply, ReviewResponse)

| Giá trị  | Nhãn     | Màu     | Ghi chú                                                                       |
| -------- | -------- | ------- | ----------------------------------------------------------------------------- |
| HIEN_THI | Hiển thị | xanh lá | Trạng thái lúc tạo                                                            |
| AN       | Đã ẩn    | xám     | Người viết tự xóa (xóa mềm). Bình luận ẩn thì phản hồi của nó cũng không hiện |
| VI_PHAM  | Vi phạm  | đỏ      | Admin chốt báo cáo vi phạm `DA_XU_LY`                                         |

Chỉ nội dung `HIEN_THI` mới xuất hiện trong danh sách và sửa được.

### ReportStatus (báo cáo vi phạm)

| Giá trị    | Nhãn       | Màu        | Ghi chú                                                                               |
| ---------- | ---------- | ---------- | ------------------------------------------------------------------------------------- |
| CHO_XU_LY  | Chờ xử lý  | vàng       | Trạng thái lúc gửi. Mỗi người chỉ có một báo cáo đang mở cho cùng một nội dung        |
| DANG_XU_LY | Đang xử lý | xanh dương | Admin đã nhận xử lý                                                                   |
| DA_XU_LY   | Đã xử lý   | xanh lá    | Xác nhận vi phạm, bắt buộc có `resolutionResult`. Nội dung bị báo cáo thành `VI_PHAM` |
| TU_CHOI    | Từ chối    | đỏ         | Không vi phạm, bắt buộc có lý do. Nội dung giữ nguyên                                 |

`DA_XU_LY` và `TU_CHOI` là trạng thái cuối, không đổi được nữa.

## Thi

### ExamStatus

| Giá trị      | Nhãn         | Màu        | Ghi chú                                                                                                      |
| ------------ | ------------ | ---------- | ------------------------------------------------------------------------------------------------------------ |
| BAN_NHAP     | Bản nháp     | xám        | Trạng thái lúc tạo. Không có bước "gửi duyệt" riêng: giáo viên tạo đề là admin nhận thông báo `EXAM_PENDING` |
| DA_PHE_DUYET | Đã phê duyệt | xanh dương | Chỉ admin chuyển từ `BAN_NHAP` sang. Giáo viên nhận thông báo `EXAM_APPROVED`                                |
| DANG_MO      | Đang mở      | xanh lá    | Học viên mới thấy và làm được. Chuyển sang đây thì học viên đã thanh toán nhận `EXAM_OPENED`                 |
| TAM_NGUNG    | Tạm ngưng    | đỏ         | Mở lại được, hoặc về `BAN_NHAP` nếu đề chưa có bài làm                                                       |

Luồng chuyển đầy đủ xem mục Exam trong `api-spec.md`.

### AttemptStatus

| Giá trị  | Nhãn     | Màu        | Ghi chú                                                                               |
| -------- | -------- | ---------- | ------------------------------------------------------------------------------------- |
| DANG_LAM | Đang làm | xanh dương | Mỗi lần chỉ mở 1 bài. Số lượt tối đa theo `Exam.maxAttempts` của từng đề (mặc định 3) |
| DA_NOP   | Đã nộp   | vàng       |                                                                                       |
| DA_CHAM  | Đã chấm  | xanh lá    | Chấm ở server. Học viên chỉ thấy đáp án đúng khi đề bật `showAnswers`                 |
| HUY      | Đã hủy   | xám        | Không tính vào số lượt                                                                |

## AI

### SenderType

| Giá trị | Nhãn      |
| ------- | --------- |
| STUDENT | Học viên  |
| AI      | Trợ lý AI |

Chỉ tin `AI` mới có `recommendations` (khóa được gợi ý kèm `recommendationReason`). `AiConversation.endTime` có trong schema nhưng chưa dùng, luôn `null`.

## Thông báo

### Notification.type

Trong schema, `type` là chuỗi (`VarChar(50)`), **không phải enum Prisma**. Bảng dưới là các giá trị BE đang tạo; thêm loại mới thì cập nhật bảng này.

| Giá trị          | Người nhận                             | Khi nào                                 |
| ---------------- | -------------------------------------- | --------------------------------------- |
| TEACHER_PENDING  | Admin có quyền `DUYET_GIAO_VIEN`       | Giáo viên mới xác minh email, chờ duyệt |
| TEACHER_APPROVED | Giáo viên                              | Hồ sơ được duyệt                        |
| TEACHER_REJECTED | Giáo viên                              | Hồ sơ bị từ chối                        |
| COURSE_PENDING   | Admin có quyền `QUAN_LY_KHOA_HOC`      | Giáo viên gửi duyệt khóa học            |
| COURSE_APPROVED  | Giáo viên                              | Khóa học được duyệt                     |
| COURSE_REJECTED  | Giáo viên                              | Khóa học bị từ chối (kèm lý do)         |
| EXAM_PENDING     | Admin có quyền `QUAN_LY_BAI_THI`       | Giáo viên tạo đề thi mới                |
| EXAM_APPROVED    | Giáo viên                              | Đề thi được phê duyệt                   |
| EXAM_OPENED      | Học viên đã thanh toán của khóa        | Đề thi chuyển sang `DANG_MO`            |
| EXAM_SUBMITTED   | Giáo viên của khóa                     | Học viên nộp bài                        |
| PAYMENT_PENDING  | Admin có quyền `QUAN_LY_THANH_TOAN`    | Học viên gửi minh chứng thanh toán      |
| PAYMENT_APPROVED | Học viên                               | Thanh toán được xác nhận                |
| PAYMENT_REJECTED | Học viên                               | Thanh toán bị từ chối (kèm lý do)       |
| REFUND_APPROVED  | Học viên                               | Yêu cầu hoàn tiền được chấp thuận       |
| REFUND_COMPLETED | Học viên                               | Đã hoàn tiền xong                       |
| REFUND_REJECTED  | Học viên                               | Yêu cầu hoàn tiền bị từ chối            |
| REPORT_PENDING   | Admin có quyền `XU_LY_BAO_CAO_VI_PHAM` | Có báo cáo vi phạm mới                  |
| SESSION_CREATED  | Học viên đã thanh toán của khóa        | Giáo viên thêm buổi học                 |
| SESSION_UPDATED  | Học viên đã thanh toán của khóa        | Giáo viên đổi buổi học                  |
| COMMENT_REPLIED  | Người viết bình luận                   | Bình luận của mình được trả lời         |
| REPORT_RESOLVED  | Người gửi báo cáo vi phạm              | Báo cáo được chốt vi phạm (`DA_XU_LY`)  |
| REPORT_REJECTED  | Người gửi báo cáo vi phạm              | Báo cáo bị từ chối (kèm lý do)          |

Leader luôn nhận các thông báo gửi cho admin. Hiện học viên gửi yêu cầu hoàn tiền thì admin **chưa** nhận thông báo. `body` thông báo được cắt còn tối đa 500 ký tự. Không gian học (`CourseLearning`, `CourseSession`) không có enum riêng.
