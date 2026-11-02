# Quy tắc nghiệp vụ

## Đã thống nhất

- Không có chương/bài học và không có tính năng theo dõi tiến độ học.
- Học viên không được hủy khóa học đã đăng ký (không có API hủy). Mỗi học viên chỉ đăng ký 1 lần cho mỗi khóa.
- Đăng ký trùng: nếu bản đăng ký cũ đang CHO_THANH_TOAN thì trả lại để thanh toán tiếp, nếu đã DA_THANH_TOAN thì báo đã đăng ký.
- Mỗi học viên đánh giá 1 lần cho mỗi khóa. Chỉ học viên đã đăng ký mới được bình luận hoặc đánh giá.
- Tài liệu (Resource) là kho công khai theo danh mục, ai cũng xem được kể cả khách. Không gắn với một khóa học cụ thể.
- Đăng ký, hóa đơn và tăng `usedCount` của mã giảm giá phải nằm trong cùng 1 transaction (chỉ tăng khi `usedCount < usageLimit`). `studentId` của hóa đơn phải trùng học viên của đăng ký.
- Mã giảm giá chỉ dùng 1 trong 2 kiểu: giảm số tiền hoặc giảm phần trăm.
- Thi: không trả `isCorrect` cho học viên, chấm điểm ở server, kiểm tra thời gian làm bài, chỉ cho thi khi đã thanh toán.
- Chatbot chỉ gợi ý khóa học đang ở trạng thái DANG_MO.
- Admin có Leader (toàn quyền) và admin thường (chỉ làm được chức năng được Leader cấp).
- Giáo viên tự đăng ký tài khoản, chờ admin duyệt (CHO_DUYET).
- Tài khoản chưa xác minh email (CHO_XAC_MINH) chưa đăng nhập được.
- Thời hạn: access token 15 phút, refresh token 7 ngày, mã OTP 10 phút.

## Chưa chốt (cần cả nhóm quyết)

- Dịch vụ AI cụ thể (LLM, API key, giới hạn lượt gọi, chi phí).
- Mã giảm giá: áp dụng cho khóa nào, mỗi học viên dùng tối đa mấy lần, có cộng dồn nhiều mã không. (không cộng dồn nhiều mã, mỗi học viên chỉ được dùng mỗi mã một lần)
- Thi: cho làm lại mấy lần, có loại câu hỏi nào ngoài trắc nghiệm không, cơ chế chống gian lận.(cho làm lại 3 lần, chỉ mở được 1 bài thi mỗi lần)
- Hoàn tiền trong trường hợp nào, truy cập khóa học có giới hạn thời gian không.
- Người dùng dưới 18 tuổi có cần phụ huynh đồng ý không. (cái này không có quản lý tuổi, đăng ký là xài)
- Admin đầu tiên được tạo thế nào (hiện đang tạo bằng seed), có bắt buộc đổi mật khẩu lần đầu không. (có một admin quản lý toàn bộ hệ thống được tạo sẵn tài khoản, sau đó tài khoản này mới tạo các admin khác và chia quyền cho nó, admin isleader này có quyền thêm sửa xóa tài khoản admin khác (không thể xóa tài khoản này) và can dự vào toàn hệ thống)
- Ngưỡng hiệu năng (thời gian phản hồi, số người dùng đồng thời). (cái này không vội)
- Có giữ trạng thái HOAN_TIEN không, và múi giờ lưu trữ.
