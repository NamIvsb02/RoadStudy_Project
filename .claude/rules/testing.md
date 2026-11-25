# Kiểm thử

Chạy theo script có thật trong `package.json`. Không đoán test runner, không tự thêm framework test, không chuyển sang pnpm/yarn.

## Trước khi báo xong

| Vùng     | Bắt buộc                                                           | Khi có điều kiện                              |
| -------- | ------------------------------------------------------------------ | --------------------------------------------- |
| FE       | `npm run lint` trong `FE_RStudy/` sạch                             | `npm run build`; xem giao diện ở các viewport |
| BE       | Server `npm run dev` lên không lỗi                                 | Chạy test của module vừa sửa                  |
| Prisma   | `npx prisma validate` khi sửa schema                               | —                                             |
| Markdown | `npx prettier --write` trên file `.md` vừa sửa (xem `workflow.md`) | —                                             |

Thiếu dependency, `.env` hoặc quyền truy cập thì báo rõ "chưa kiểm chứng được", không tuyên bố đã chạy.

## Test backend

- `npm test` chỉ là stub. Test là script Node gọi HTTP vào **server đang chạy** và **DB Supabase thật**: bật `npm run dev`, rồi chạy từng file `node tests/<module>.test.js` (in PASS/FAIL).
- `node tests/ai-check.js` kiểm tra kết nối nhà cung cấp AI.
- Test về bảo mật và đồng thời: `security.p0.test.js` (OTP, rate limit, refresh token, hoàn tiền, chatbot), `invoice.test.js` (luồng tiền), `hardening.p2.test.js` (upload, request ID, rate limit nội dung, nộp bài), `fix-regression.test.js`. Bộ đếm rate limit nằm trong RAM của server nên **khởi động lại server trước mỗi lần chạy** các file này, nếu không các ca 429 có thể sai vì còn dư lượt đếm từ lần trước. Gửi quá 20 request đồng thời có thể làm cạn pool kết nối Supabase (lỗi `P2028`), đừng tăng số request song song trong test.
- Windows: `kill`/`Ctrl+C` trong script nền không chạy được handler tắt server, kiểm tra tắt server an toàn bằng terminal thật hoặc Docker.
- `tests/helpers/auth.js` tạo access token hợp lệ, không cần OTP. Dùng helper này cho test mới.
- Test cũ `category`, `comment`, `course`, `course.public` còn gửi header `x-dev-role` (không còn tác dụng), nên route cần xác thực trong các file đó có thể FAIL. Đây là lỗi đã biết của test, không phải của code.
- Tài khoản seed, mật khẩu chung `Password123!`: `leader@`, `admin@`, `teacher@`, `student@roadstudy.vn`. Trong Git Bash chạy `set +H` trước khi gõ `!`.
- Test mới viết trong `BE_RStudy/tests/<module>.test.js`, phủ luồng chính và các nhánh 401, 403, 404, 409. DB dùng chung nên hạn chế tạo dữ liệu rác và không sửa dữ liệu seed.

### Test có upload file (không làm bẩn lưu trữ dùng chung)

Nếu `.env` đặt `STORAGE_DRIVER=cloudinary`, mọi test có upload (`invoice`, `hardening.p2`, `account`, `security.p0`, `storage`...) sẽ đẩy file lên thư mục Cloudinary `roadstudy/dev` mà cả nhóm đang dùng. Biến môi trường đặt trên dòng lệnh được ưu tiên hơn `.env`, nên chọn một trong hai cách, **đặt giống nhau cho cả server và lệnh test**:

| Cách                      | Khi nào                           | Lệnh (Git Bash)                                                                                                                     |
| ------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Lưu local                 | Test thường, không cần Cloudinary | `export STORAGE_DRIVER=local PORT=5055`, rồi `npm run dev` ở terminal 1 và `node tests/<file>.test.js` ở terminal 2 (cùng `export`) |
| Cloudinary, thư mục riêng | Test driver Cloudinary            | `export STORAGE_DRIVER=cloudinary CLOUDINARY_FOLDER="roadstudy/test-$(date +%s)" PORT=5055`, rồi chạy server và test như trên       |

- `tests/cloudinary.integration.test.js` tự dừng nếu `CLOUDINARY_FOLDER` không bắt đầu bằng `roadstudy/test-`, và xóa mọi file trong thư mục đó khi kết thúc.
- Chạy server ở cổng riêng (ví dụ 5055) để không gọi nhầm vào server khác hoặc container Docker đang giữ cổng 5000.
- `node tests/scripts.test.js` kiểm tra hai script `migrate-uploads-to-cloudinary` và `cleanup-orphan-files` bằng DB và Cloudinary giả, không cần server, không đụng dữ liệu thật.
- Không chạy `migrate-uploads-to-cloudinary.js --apply` hay `cleanup-orphan-files.js --apply` trên môi trường dùng chung khi chưa được Nam đồng ý.

### Kiểm tra hiệu năng và chịu tải

- `node tests/resilience.test.js` kiểm tra lỗi DB quá tải trả 503, cấu hình pool và việc đăng ký không chờ email. Test tự bật một server riêng ở cổng 5058, tạo rồi xóa 1 tài khoản tạm trên DB.
- `node tests/redis.test.js` kiểm tra Redis tắt, Redis cấu hình nhưng chết, Redis mất giữa chừng rồi tự nối lại. Test tự bật server cổng 5059 và một container Redis tạm cổng 6391 (cần Docker, tự xóa khi xong), không đụng DB dùng chung ngoài `SELECT 1`.
- Đo tải bằng `benchmark/run.sh <nhãn> 10 50 100 200`: môi trường **cô lập** (Postgres local trong Docker, giả lập độ trễ DB 160ms như Supabase, backend giới hạn 1 CPU và 512MB), không dùng DB dùng chung, Cloudinary hay Gemini, không đọc `BE_RStudy/.env`. Kết quả ở `benchmark/results/<nhãn>.md`. So sánh hai lần đo: `node benchmark/summarize.js so-sanh <nhãn1> <nhãn2>`. Dọn môi trường: `benchmark/run.sh --down`.
- **Không** chạy load test lên DB dùng chung hoặc production, và không gọi hàng loạt Gemini hay Cloudinary thật.

## Kiểm tra frontend thủ công

- FE chưa có test tự động.
- Kiểm tra: loading, empty, error; responsive (320, 375, 768, 1024, 1440px); bàn phím và chạm; text tiếng Việt; `prefers-reduced-motion`.
- Luồng nhạy cảm (đăng ký → thanh toán → thi, hoàn tiền, phân quyền admin) kiểm tra với từng tài khoản seed tương ứng.
