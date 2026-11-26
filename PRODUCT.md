# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Học viên (Student):** Học sinh, sinh viên và người đi học muốn tìm khóa học phù hợp, đăng ký và thanh toán dễ dàng, theo dõi các khóa đã đăng ký, vào lớp học, làm bài thi và hỏi trợ lý AI khi chưa biết nên học gì. Nhu cầu chính là chọn đúng khóa trong khoảng ngân sách của mình và biết rõ mọi bước (đã thanh toán chưa, buổi học tiếp theo khi nào, đã làm bài thi bao nhiêu lượt).
- **Giáo viên (Teacher):** Người đứng lớp. Đăng ký tài khoản rồi chờ quản trị viên duyệt, sau đó tạo và gửi duyệt khóa học, soạn đề thi, quản lý lớp học (link vào học, thư mục tài liệu, lịch học, bật hoặc tắt mục bài thi), xem bài làm của học viên, đăng tài liệu và phản hồi bình luận, đánh giá.
- **Quản trị viên (Administrator):** Gồm quản trị viên trưởng (Leader, có toàn quyền và là người duy nhất quản lý các admin khác) và admin thường làm việc theo từng chức năng được cấp: quản lý tài khoản, duyệt giáo viên, quản lý khóa học và danh mục, mã giảm giá, bài thi, xác nhận thanh toán, xử lý hoàn tiền, xử lý báo cáo vi phạm.
- **Khách (chưa đăng nhập):** Xem danh sách và chi tiết khóa học, trang giáo viên, thư viện tài liệu. Cần đăng nhập để đăng ký, bình luận và dùng chatbot.

## Product Purpose

RoadStudy là website đăng ký khóa học trực tuyến đa cấp học, tích hợp AI gợi ý khóa học (đề tài niên luận: "Xây dựng website đăng ký khóa học trực tuyến đa cấp học tích hợp AI gợi ý khóa học"). Nền tảng không giới hạn môn học hay cấp học, bán những gì giáo viên và quản trị viên đưa lên. Mục tiêu là gom toàn bộ vòng đời của một khóa học vào một nơi: giáo viên tạo và được duyệt khóa, học viên tìm, đăng ký, thanh toán, vào học và thi, quản trị viên kiểm duyệt và xử lý tiền một cách gọn gàng. Thành công được nhìn nhận qua việc học viên chọn được khóa phù hợp mà không phải tự mò trong danh sách dài, thanh toán xong không phải hỏi lại "đã được xác nhận chưa", và giáo viên cùng admin xử lý việc của mình ít bước nhất có thể.

## Positioning

AI trong RoadStudy là **cố vấn tìm khóa học**, không phải người ra quyết định. Trợ lý hiểu nhu cầu học viên nêu (môn học, cấp học, ngân sách) rồi chỉ chọn trong **danh sách khóa học đang mở có thật** trong hệ thống và nêu lý do cho từng gợi ý; hệ thống không tin mù quáng vào AI, mọi gợi ý đều được đối chiếu lại với danh sách ứng viên nên AI không thể bịa ra khóa học. AI không tự đăng ký, thanh toán hay sửa dữ liệu thay học viên. Khi dịch vụ AI không phản hồi được, chatbot vẫn trả lời bằng câu dự phòng hướng học viên dùng tìm kiếm và bộ lọc.

Khác biệt còn lại nằm ở quy trình khép kín cho thị trường Việt Nam: thanh toán chuyển khoản kèm mã QR VietQR và ảnh minh chứng do admin xác nhận, lớp học diễn ra trên công cụ giáo viên chọn (link Meet, Zoom...), tất cả hiển thị bằng tiếng Việt.

## Operating Context

- Ứng dụng web chạy trên trình duyệt máy tính và điện thoại. Trang của học viên có thanh điều hướng dưới trên điện thoại; khu quản lý (giáo viên, admin) ưu tiên máy tính và thu menu thành ngăn kéo trên màn hình nhỏ.
- Tiếng Việt là ngôn ngữ hiển thị duy nhất; tiền tệ là VND; thời gian lưu theo UTC, hiển thị theo múi giờ Việt Nam.
- Frontend React + Vite, Backend Express, PostgreSQL qua Prisma, xác thực JWT (access token 15 phút, refresh token 7 ngày xoay vòng), xác minh email và quên mật khẩu bằng mã OTP gửi qua email.
- Dịch vụ AI gọi qua một lớp cấu hình hỗ trợ Gemini hoặc các dịch vụ tương thích OpenAI, có thời gian chờ và có phương án dự phòng khi lỗi.
- Thanh toán chuyển khoản thủ công: hệ thống tạo thông tin chuyển khoản và mã QR, học viên gửi ảnh minh chứng, admin xác nhận. Không có cổng thanh toán tự động.
- Tệp người dùng tải lên (ảnh đại diện, ảnh bìa, tài liệu PDF hoặc DOCX, ảnh minh chứng) hiện lưu trên máy chủ trong thư mục `uploads/`; việc chuyển sang lưu trữ đám mây (Cloudinary) đang được cân nhắc cho giai đoạn sau.
- RoadStudy không lưu video bài giảng. "Vào học" mở link lớp học trực tuyến và thư mục tài liệu (Google Drive) do giáo viên dán vào.

## Capabilities and Constraints

- **Năng lực cốt lõi:**
  - Đăng ký, đăng nhập, quên mật khẩu, làm mới phiên; ba vai trò kèm phân quyền admin theo chức năng.
  - Duyệt giáo viên; giáo viên chưa được duyệt hoặc bị từ chối không đăng nhập được.
  - Khóa học: nháp, gửi duyệt, admin duyệt hoặc từ chối, mở đăng ký, tạm ngưng, kết thúc. Khóa thuộc danh mục bị ẩn không hiển thị công khai.
  - Khám phá: danh sách khóa học có tìm kiếm, lọc theo danh mục và học phí; trang chi tiết khóa học; trang giáo viên; thư viện tài liệu theo danh mục.
  - Đăng ký và thanh toán: hóa đơn kèm mã giảm giá (mỗi hóa đơn một mã, mỗi học viên dùng mỗi mã một lần), mã QR VietQR, ảnh minh chứng riêng tư, admin duyệt hoặc từ chối kèm lý do; hủy đơn chưa thanh toán; hoàn tiền trong 24 giờ kể từ lúc thanh toán, khóa miễn phí không hoàn tiền.
  - Thi trắc nghiệm một đáp án đúng: số lượt làm tối đa do giáo viên đặt (mặc định 3), thời gian làm bài do máy chủ kiểm tra, tự nộp khi hết giờ, chấm điểm tự động, nút Nộp bài chỉ mở khi đã chọn đủ đáp án, đáp án đúng chỉ hiện sau khi nộp và chỉ khi giáo viên bật.
  - Bình luận, phản hồi, đánh giá có phản hồi của giáo viên; báo cáo vi phạm và admin xử lý.
  - Chatbot AI gợi ý khóa học có lưu lịch sử hội thoại.
  - Không gian học của khóa đã thanh toán: link vào học, thư mục tài liệu, lịch học, mục bài thi bật hoặc tắt (giáo viên quản lý, học viên xem).
  - Thông báo trên chuông cho các sự kiện duyệt, thanh toán, hoàn tiền, đề thi, lịch học, trả lời bình luận (danh sách loại ở `enum.md`).
  - Quản lý danh mục (ẩn danh mục thì ẩn khóa học thuộc danh mục đó).
  - Khối "Dành cho bạn" trên trang chủ: gợi ý theo danh mục khóa đã đăng ký, thiếu thì bù khóa nhiều người đăng ký. Khối này không gọi AI.
- **Cần làm tiếp:** người phụ trách rà lại tài liệu API vừa được soạn từ code cho Course, Category, Resource, Comment, Review, Report, Chatbot (mục 13, 15 đến 20 của `api-spec.md`); test lại cả luồng trên ứng dụng đang chạy. Đang tìm hiểu hoặc cấu hình: Docker (đã có `docker-compose.yml`), GitHub Actions, Swagger/OpenAPI, triển khai cloud, Cloudinary; chưa có bản production.
- **Ràng buộc sản phẩm:**
  - AI chỉ gợi ý trong các khóa học đang mở, không thay học viên quyết định; giới hạn 500 ký tự mỗi tin và 6 tin mỗi phút.
  - Học viên chỉ xem lớp học, làm bài thi và bình luận khi đã có đơn đăng ký hợp lệ; đã thanh toán rồi thì chỉ rút lại qua luồng hoàn tiền.
  - Đã chủ ý loại bỏ chương bài giảng và theo dõi tiến độ học; không quản lý riêng người dưới 18 tuổi.
  - Dùng trạng thái ẩn thay vì xóa cứng các dữ liệu đã phát sinh quan hệ.
- **Ràng buộc kỹ thuật và quy trình:**
  - Mọi route quản trị phải kiểm tra cả vai trò lẫn quyền chức năng ở Backend (`requirePermission`); ẩn nút ở Frontend không được coi là bảo mật.
  - Không bao giờ gửi đáp án đúng cho học viên trong lúc làm bài, không công khai ảnh minh chứng thanh toán, không để lộ link lớp học cho người chưa thanh toán.
  - API chưa được ghi vào `BE_RStudy/docs/api-spec.md` thì chưa tính là xong; chỉ Nam sửa `schema.prisma` và chạy migration, sau đó báo cả nhóm.
  - Cả nhóm dùng chung một database Supabase: không reset hay seed lại khi chưa báo nhóm. Pull request vào `main` qua CodeRabbit review, Nam duyệt và merge.
  - Giao diện bám design system `DESIGN_SYSTEM.md` (token trong `FE_RStudy/src/assets/styles/theme.css`) và quy tắc trong `.claude/rules/frontend.md`; Frontend và Backend giữ ranh giới rõ, không tự sửa API khi chưa thống nhất.

## Brand Commitments

- **Tên thương hiệu:** RoadStudy.
- **Định vị:** Nền tảng đăng ký khóa học trực tuyến đa cấp học, tích hợp AI gợi ý khóa học.
- **Giọng điệu (Voice):** Thân thiện, rõ ràng, ngắn gọn và đáng tin; tiếng Việt có dấu, nói thẳng điều học viên cần làm tiếp theo, thông báo lỗi lấy từ hệ thống chứ không đoán, tôn trọng quyền tự quyết của người dùng.
- **Nhận diện thị giác:** Xanh đại dương làm màu chủ đạo, cam làm điểm nhấn nhỏ, bề mặt sáng và gọn, font Be Vietnam Pro (chi tiết ở `DESIGN_SYSTEM.md`).

## Evidence on Hand

- Quy ước frontend và mẫu spec trang: [.claude/rules/frontend.md](.claude/rules/frontend.md).
- Nguồn sự thật của API và các trạng thái: [BE_RStudy/docs/api-spec.md](BE_RStudy/docs/api-spec.md), [BE_RStudy/docs/enum.md](BE_RStudy/docs/enum.md).
- Quy tắc nghiệp vụ và quy ước kỹ thuật: [.claude/rules/business.md](.claude/rules/business.md), [.claude/rules/backend.md](.claude/rules/backend.md), [.claude/rules/security.md](.claude/rules/security.md).
- Hệ thống thiết kế: [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) và các token ở [FE_RStudy/src/assets/styles/theme.css](FE_RStudy/src/assets/styles/theme.css).
- Cơ sở dữ liệu và dữ liệu mẫu: [BE_RStudy/prisma/schema.prisma](BE_RStudy/prisma/schema.prisma), [BE_RStudy/prisma/seed.js](BE_RStudy/prisma/seed.js).
- Kiểm thử tích hợp (script Node chạy bằng `node tests/<tên>.test.js`, cần máy chủ và cơ sở dữ liệu đang chạy): [BE_RStudy/tests](BE_RStudy/tests).
- Mã nguồn: [FE_RStudy/src](FE_RStudy/src) và [BE_RStudy/src](BE_RStudy/src).

## Product Principles

1. **Học viên nắm quyền quyết định:** AI gợi ý và giải thích, quyết định đăng ký và thanh toán luôn thuộc về học viên.
2. **Minh bạch và có căn cứ:** Gợi ý của AI chỉ lấy từ khóa học có thật và kèm lý do; trạng thái đơn, thanh toán, hoàn tiền luôn hiển thị rõ; bị từ chối thì nói rõ lý do; việc quan trọng được báo qua thông báo.
3. **Quyền tối thiểu và kiểm tra ở Backend:** Mỗi vai trò chỉ thấy và làm được điều thuộc về mình; dữ liệu nhạy cảm không bao giờ phụ thuộc vào việc ẩn nút trên giao diện.
4. **Gọn và hướng tác vụ:** Không hiệu ứng trang trí, chỉ có scroll-reveal nhẹ cho các section chính của trang nội dung (không áp dụng cho bảng, form, luồng tác vụ); mọi danh sách, biểu mẫu đều có đủ trạng thái đang tải, rỗng, lỗi; mọi bộ lọc liên quan khóa học có nút Tất cả.
5. **Một nguồn sự thật:** Đường dẫn qua `ROUTES`, vai trò qua `ROLES`, quyền qua hằng số chung, màu qua token, API qua `api-spec.md`.

## Accessibility & Inclusion

- Nút và ô nhập cao 44px; thao tác được bằng bàn phím (phím Esc đóng hộp thoại, vòng sáng khi focus, các thành phần dùng đúng vai trò `tab`, `switch`, `dialog` kèm nhãn truy cập).
- Tôn trọng chế độ giảm chuyển động của hệ điều hành; chuyển động chỉ dùng các preset nhẹ trong `constants/motion.js` (scroll-reveal một lần cho section chính, lắc chuông khi có thông báo mới) và không bao giờ che nội dung thiết yếu.
- Chữ tiếng Việt có dấu, cỡ chữ cơ bản 14px; giao diện thích ứng điện thoại với điều hướng riêng.
- Hiện chỉ có giao diện sáng (chưa khai báo chế độ tối).
- Việc cần cải thiện: chữ nhỏ màu cam, xanh lá và vàng cam đặt trên nền trắng hoặc nền nhạt cùng tông có thể chưa đạt độ tương phản 4.5:1; cần đo lại bằng công cụ và cân nhắc dùng tông đậm hơn cho chữ.
