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

## Kiểm tra frontend thủ công

- FE chưa có test tự động.
- Kiểm tra: loading, empty, error; responsive (320, 375, 768, 1024, 1440px); bàn phím và chạm; text tiếng Việt; `prefers-reduced-motion`.
- Luồng nhạy cảm (đăng ký → thanh toán → thi, hoàn tiền, phân quyền admin) kiểm tra với từng tài khoản seed tương ứng.
