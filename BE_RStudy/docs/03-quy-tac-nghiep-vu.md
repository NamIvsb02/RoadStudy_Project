# Quy tắc nghiệp vụ

## Đã thống nhất

### Tài khoản và phân quyền

- Tài khoản chưa xác minh email (`CHO_XAC_MINH`) chưa đăng nhập được.
- Giáo viên tự đăng ký tài khoản, chờ admin duyệt (`CHO_DUYET`). Giáo viên `CHO_DUYET` hoặc `TU_CHOI` **không đăng nhập được**: BE trả 403 ở cả `login` lẫn `refresh` (chốt 6/11). Admin duyệt lại được giáo viên đã bị từ chối.
- Thời hạn: access token 15 phút, refresh token 7 ngày (xoay vòng), mã OTP 10 phút.
- Không quản lý tuổi người dùng, không cần phụ huynh đồng ý: đăng ký xong là dùng.
- Admin có Leader (toàn quyền) và admin thường (chỉ làm được chức năng được Leader cấp). Admin Leader đầu tiên được tạo sẵn bằng seed. Chỉ Leader quản lý admin khác: tạo tài khoản, khóa hoặc mở khóa, gán lại quyền. **Không có xóa tài khoản admin** (chỉ khóa). Không khóa được Leader và không gán quyền cho Leader.

### Khóa học và tài liệu

- Không có chương/bài học và không có tính năng theo dõi tiến độ học. RoadStudy không lưu video bài giảng.
- Tài liệu (Resource) là kho công khai theo danh mục, ai cũng xem được kể cả khách. Không gắn với một khóa học cụ thể.
- Không gian học của mỗi khóa (`/api/learning`): một nút "Vào học" mở link lớp trực tuyến (`classUrl`, ví dụ Meet/Zoom), một link thư mục tài liệu Drive riêng (`driveUrl`), lịch học chỉ gồm tiêu đề, giờ bắt đầu, giờ kết thúc và ghi chú. Giáo viên bật hoặc tắt mục bài thi (`showExams`). Tắt thì học viên không thấy và không làm được đề nào của khóa đó.
- Chỉ học viên đã thanh toán (`DA_THANH_TOAN`) mới xem được không gian học. Đã hoàn tiền thì mất quyền. Không để lộ `classUrl` cho người chưa thanh toán.

### Đăng ký, thanh toán, hoàn tiền

- Một học viên có thể có nhiều đơn đăng ký cho cùng một khóa (đơn cũ được giữ lại), nhưng tại một thời điểm chỉ có **một đơn còn hiệu lực** (`CHO_THANH_TOAN` hoặc `DA_THANH_TOAN`). Schema không còn unique `studentId + courseId`; việc chặn trùng làm ở service.
- Đăng ký trùng: nếu đơn cũ đang `CHO_THANH_TOAN` thì trả lại để thanh toán tiếp; nếu hóa đơn cũ đã bị từ chối thì hủy đơn cũ rồi tạo đơn mới; nếu đã `DA_THANH_TOAN` thì báo đã đăng ký (409).
- Đơn `DA_HUY` hoặc `HOAN_TIEN` thì đăng ký lại được bằng đơn mới. Còn yêu cầu hoàn tiền chưa xử lý cho khóa đó thì chưa đăng ký lại được.
- Học viên tự hủy đơn (`POST /enrollment/:id/cancel`) khi đơn còn `CHO_THANH_TOAN` và chưa gửi minh chứng (hoặc hóa đơn đã bị từ chối). Đã gửi minh chứng thì phải gửi yêu cầu hủy kèm hoàn tiền. Đã thanh toán thì chỉ rút lại qua luồng hoàn tiền.
- Đăng ký, hóa đơn và tăng `usedCount` của mã giảm giá phải nằm trong cùng 1 transaction (chỉ tăng khi `usedCount < usageLimit`). `studentId` của hóa đơn phải trùng học viên của đăng ký.
- Mã giảm giá chỉ dùng 1 trong 2 kiểu: giảm số tiền hoặc giảm phần trăm. Mỗi hóa đơn chỉ áp 1 mã (không cộng dồn), mỗi học viên dùng mỗi mã một lần, không giới hạn theo khóa học.
- Khóa miễn phí (hoặc giảm hết tiền): đơn và hóa đơn tự chuyển `DA_THANH_TOAN`, không cần minh chứng. **Khóa miễn phí không được hoàn tiền.**
- Hoàn tiền: chỉ yêu cầu được trong vòng 24 giờ kể từ `paidAt` (tính lúc gửi yêu cầu). Ngoài ra học viên đã gửi minh chứng mà admin chưa duyệt cũng gửi được yêu cầu hủy kèm hoàn tiền. Mỗi đơn chỉ có 1 yêu cầu chờ xử lý tại một thời điểm.
- Hoàn tiền gồm 2 bước: admin **chấp thuận** (`CHO_HOAN_TIEN`), hoàn tiền thực tế, rồi bấm **hoàn tất** (`DA_XU_LY`). Chỉ khi hoàn tất thì đơn và hóa đơn mới chuyển `HOAN_TIEN`. Hoàn tiền không trả lại lượt mã giảm giá. Giữ trạng thái `HOAN_TIEN`.
- Thời gian lưu theo UTC, FE hiển thị theo giờ Việt Nam.

### Bình luận, đánh giá, báo cáo

- Chỉ học viên có đơn `DA_THANH_TOAN` mới được bình luận hoặc đánh giá. Đã hoàn tiền (`HOAN_TIEN`) thì không bình luận, đánh giá được nữa.
- Mỗi học viên đánh giá 1 lần cho mỗi khóa.

### Thi

- Chỉ thi được khi đã thanh toán, đề ở trạng thái `DANG_MO` và mục bài thi của khóa đang bật.
- Số lượt làm tối đa do giáo viên đặt cho từng đề (`Exam.maxAttempts`, 1 đến 10, mặc định 3). Bài `HUY` không tính lượt. Mỗi lần chỉ mở được 1 bài (`DANG_LAM`).
- Chấm điểm ở server, kiểm tra thời gian làm bài ở server (cho phép trễ 10 giây do mạng). Hết giờ mà chưa nộp thì server tự nộp với đáp án đã lưu.
- Trong lúc làm bài không bao giờ trả `isCorrect`. Sau khi nộp và chấm, học viên chỉ xem được đáp án đúng khi giáo viên bật `Exam.showAnswers` (mặc định tắt).

### AI và chatbot

- Dịch vụ AI: Gemini hoặc dịch vụ tương thích OpenAI, cấu hình trong `config/ai.js` (xem `02-quy-uoc-ky-thuat.md`).
- Chatbot chỉ dành cho học viên. Mỗi tin tối đa 500 ký tự, mỗi học viên tối đa 6 tin mỗi phút (vượt thì 429). Lịch sử hội thoại được lưu.
- Chatbot chỉ gợi ý khóa học đang `DANG_MO` (trong ngân sách nếu học viên nêu), chỉ chọn trong danh sách ứng viên có thật và kèm lý do. Khối "Dành cho bạn" (`GET /recommendation/me`) không gọi AI: lấy khóa `DANG_MO` thuộc danh mục đang hiển thị, cùng danh mục với khóa học viên đã đăng ký, thiếu thì bù bằng khóa nhiều người đăng ký. AI không tự đăng ký hay thanh toán thay học viên.
- AI lỗi hoặc hết thời gian chờ: chatbot vẫn trả lời bằng câu dự phòng, hướng học viên dùng tìm kiếm và bộ lọc.

### Thông báo

- Hệ thống tạo thông báo trên chuông cho các sự kiện quan trọng: có giáo viên/khóa học/đề thi/thanh toán/báo cáo mới chờ admin xử lý (gửi cho Leader và admin có quyền tương ứng), kết quả duyệt giáo viên/khóa học/đề thi, kết quả duyệt thanh toán và hoàn tiền, đề thi mới mở, lịch học mới hoặc đổi lịch, bình luận được trả lời, học viên nộp bài. Danh sách loại thông báo xem `enum.md`.
- Thông báo là phần phụ: tạo thông báo lỗi không được làm hỏng nghiệp vụ chính.

## Chưa chốt (cần cả nhóm quyết)

- Truy cập khóa học có giới hạn thời gian không (hiện không giới hạn).
- Admin đầu tiên có bắt buộc đổi mật khẩu ở lần đăng nhập đầu không (hiện không bắt buộc).
- Cơ chế chống gian lận khi thi ngoài việc chỉ mở 1 bài mỗi lần; có thêm loại câu hỏi nào ngoài trắc nghiệm một đáp án không.
- Ngưỡng hiệu năng (thời gian phản hồi, số người dùng đồng thời). Chưa vội.
