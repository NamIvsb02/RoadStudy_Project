# AGENTS.md — RoadStudy

Tài liệu điều phối bắt buộc cho AI Agent (Claude Code, Antigravity, Codex, Cursor, Copilot...) làm việc trong repository `RoadStudy/`. Mọi đường dẫn trong tài liệu được tính từ **thư mục gốc RoadStudy**.

## 0. Cổng kiểm soát bắt buộc

- Trước khi đọc/sửa/tạo mã trong `FE_RStudy/`, đọc `.agents/rules/frontend.md` và `FE_RStudy/docs/AI_RULES.md`; với tác vụ giao diện, **bắt buộc đọc** `DESIGN_SYSTEM.md` và `design_system.json` (ở thư mục gốc). Không tự giả định nội dung file thiếu.
- Trước khi đọc/sửa/tạo mã trong `BE_RStudy/`, đọc `BE_RStudy/docs/02-quy-uoc-ky-thuat.md` (quy tắc thực thi backend); đọc thêm `03-quy-tac-nghiep-vu.md`, `api-spec.md`, `enum.md` theo phạm vi liên quan. Quy trình Git và database dùng chung: `BE_RStudy/docs/01-phan-cong-va-quy-trinh.md`.
- Tác vụ full-stack phải đọc cả hai bộ quy tắc. Leader truyền các quy tắc cho sub-agent và kiểm tra kết quả.
- Nếu không đọc được tài liệu bắt buộc, dừng sửa code vùng liên quan và báo rõ trở ngại; không đoán quy tắc.
- Bối cảnh sản phẩm ở `PRODUCT.md`, hướng dẫn cài đặt ở `SETUP.md` (thư mục gốc).

## 1. Giao tiếp

- Mặc định giao tiếp, giải thích, báo cáo và viết tài liệu Markdown bằng **tiếng Việt**; tên biến, API, lệnh và thuật ngữ kỹ thuật giữ đúng chuẩn code.
- Giải thích ngắn gọn; có ví dụ khi vấn đề phức tạp.
- Phân biệt **đã kiểm chứng**, **suy luận**, **chưa xác nhận**. Không tuyên bố đã chạy test/build nếu chưa chạy.
- Khi người dùng nói “hướng dẫn tôi làm”, chỉ hướng dẫn; không tự thay đổi file hoặc môi trường.

## 2. Dự án và công nghệ

**RoadStudy** là website đăng ký và học trực tuyến, có AI hỗ trợ tư vấn khóa học và hướng dẫn sử dụng. Vai trò đã biết: `STUDENT`, `TEACHER`, `ADMINISTRATOR`; quyền chức năng và `isLeader` phải kiểm tra theo code thực tế.

| Khu vực                              | Công nghệ đã biết                                                                              | Trách nhiệm                                     |
| ------------------------------------ | ---------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `FE_RStudy/`                         | React, Vite, JavaScript/JSX, Tailwind CSS v4, React Router, Axios, Framer Motion, lucide-react | Giao diện, định tuyến, state, API client        |
| `BE_RStudy/`                         | Node.js, Express, Prisma, PostgreSQL, JWT, Zod                                                 | REST API, xác thực, nghiệp vụ, truy cập dữ liệu |
| `BE_RStudy/prisma/`                  | Prisma schema, migrations, seeds                                                               | Mô hình và thay đổi CSDL                        |
| `BE_RStudy/tests/`                   | Các bài kiểm thử JavaScript hiện hữu                                                           | Kiểm thử backend                                |
| Thư mục gốc                          | `DESIGN_SYSTEM.md`, `design_system.json`                                                       | Chuẩn thiết kế chung của dự án                  |
| `FE_RStudy/docs/`, `BE_RStudy/docs/` | Quy chuẩn FE, đặc tả, nghiệp vụ/API                                                            | Tài liệu theo khu vực                           |

Supabase đã được dùng cho PostgreSQL (cả nhóm dùng chung một project); chatbot gọi Gemini hoặc dịch vụ tương thích OpenAI (cấu hình `AI_PROVIDER`). Docker, GitHub Actions, Swagger/OpenAPI và cloud deployment đang được cấu hình/tìm hiểu; **không giả định đã deploy production**. Kiểm tra `package.json` và cấu hình thực tế trước khi xác nhận phiên bản, scripts, thư viện hay công cụ test.

## 3. Cấu trúc repository (rút gọn)

```text
RoadStudy/
├── CLAUDE.md                    # Nếu dùng Claude Code
├── AGENTS.md
├── PRODUCT.md                   # Bối cảnh sản phẩm
├── SETUP.md                     # Cài đặt và chạy dự án
├── DESIGN_SYSTEM.md
├── design_system.json
├── .agents/rules/
│   └── frontend.md              # Quy tắc backend nằm ở BE_RStudy/docs/02-quy-uoc-ky-thuat.md
├── FE_RStudy/
│   ├── docs/
│   │   ├── AI_RULES.md
│   │   ├── design/              # ảnh thiết kế
│   │   └── specs/
│   ├── src/
│   │   ├── api/                 # axiosClient và API theo module
│   │   ├── assets/styles/       # theme.css
│   │   ├── components/          # common/, ui/, chatbot/, manage/
│   │   ├── constants/           # roles, permissions, routes, statuses, motion
│   │   ├── context/             # AuthContext, ToastContext
│   │   ├── hooks/
│   │   ├── lib/                 # queryClient.js
│   │   ├── pages/               # admin, auth, teacher, student, exam, learn...
│   │   ├── routes/              # AppRoutes.jsx
│   │   └── utils/
│   └── package.json
└── BE_RStudy/
    ├── docs/                   # api-spec.md, enum.md, quy ước/nghiệp vụ
    ├── prisma/                 # schema.prisma, migrations, seed
    ├── database/               # schema.sql, seed.sql
    ├── src/
    │   ├── config/
    │   ├── constants/
    │   ├── routes/
    │   ├── controllers/
    │   ├── services/
    │   ├── repositories/
    │   ├── validators/
    │   ├── middlewares/
    │   ├── utils/
    │   └── app.js
    ├── tests/
    └── package.json
```

Đây là cấu trúc rút gọn từ danh sách file được cung cấp và **vị trí tài liệu đã chốt**, không phải xác nhận mọi file trên đã tồn tại. Không tự tái cấu trúc hoặc di chuyển file hàng loạt.

## 4. Quy tắc làm việc bắt buộc

1. Xác định mục tiêu, phạm vi FE/BE/full-stack, tiêu chí hoàn thành và rủi ro. Chỉ hỏi khi thiếu thông tin quan trọng không thể xác minh từ repo.
2. Đọc quy tắc vùng và implementation hiện tại; tái sử dụng component, hook, validator, utility, response convention và pattern đang dùng.
3. Với tác vụ nhiều bước, lập kế hoạch ngắn; sửa đúng phạm vi, diff nhỏ, tránh refactor lan man.
4. **Phải xin phép trước** khi cài/cập nhật package, đổi framework, chạy migration, deploy, sửa Docker/CI/CD, commit, push hoặc tạo PR.
5. Không tự sửa chéo FE/BE nếu nhiệm vụ chỉ thuộc một vùng; lỗi ngoài phạm vi thì báo rõ.
6. Với feature/bug fix, viết hoặc cập nhật test liên quan khi hợp lý; chạy test, lint/build theo scripts thực có. Không tự thêm framework test.
7. Review diff, kiểm tra thay đổi ngoài ý muốn; báo file đã sửa, hành vi thay đổi, lệnh đã chạy, kết quả, phần chưa kiểm chứng và rủi ro.
8. Không kết luận kiến trúc/nghiệp vụ chỉ dựa trên tên file.
9. **Frontend bắt buộc mobile-friendly**: ưu tiên mobile-first, responsive, không tràn ngang; kiểm tra các viewport đại diện (320, 375, 768, 1024, 1440px) khi có điều kiện.
10. **Các section chính của trang nội dung cần scroll-reveal phù hợp** theo `DESIGN_SYSTEM.md` và mục 4 của `FE_RStudy/docs/AI_RULES.md` (đã ghi cách làm cụ thể). Không áp dụng cho bảng, form, khu quản lý hay luồng tác vụ; tôn trọng `prefers-reduced-motion`. Ngoài scroll-reveal và lắc chuông thông báo, mọi hiệu ứng khác vẫn phải có trong spec.

## 5. Git và cộng tác

- `main` là nhánh chính đã biết. **Không áp đặt `develop`**; xác minh base branch và quy trình PR trước khi tạo nhánh.
- Giữ nguyên nhánh đang làm; không checkout/rebase/merge có thể ảnh hưởng thay đổi chưa commit khi chưa được chấp thuận.
- Tên nhánh theo convention hiện có (`feature/...`, `feat/...`, `fix/...` tùy nhóm); không tự đổi nhánh cũ.
- Commit message ưu tiên `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:` + mô tả ngắn.
- **Chỉ commit/push/tạo PR khi được yêu cầu rõ**. Không force push, reset hard, xóa nhánh hay ghi đè thay đổi người khác khi chưa xác nhận.

## 6. An toàn và dữ liệu

- Không đọc/hiển thị/sao chép nội dung `.env` có bí mật trừ khi thực sự cần và được phép; không commit `.env`, token, API key, mật khẩu hay connection string có credentials. Ưu tiên `.env.example` đã loại bí mật.
- Không chạy `prisma migrate reset`, xóa dữ liệu, seed ghi đè, thao tác production database, sửa schema/migration hay lệnh phá hủy khi chưa được duyệt.
- Không gửi mã nguồn riêng tư, dữ liệu người dùng hoặc bí mật ra dịch vụ ngoài khi chưa được phép.
- Không tắt authentication, authorization, validation hay security headers để sửa nhanh.
- Với payment, refund, enrollment, permission, OTP/JWT và dữ liệu học tập: đối chiếu nghiệp vụ và kiểm thử trường hợp biên.

## 7. Kiểm tra chất lượng

- Đọc scripts trong `FE_RStudy/package.json`, `BE_RStudy/package.json` trước khi chạy. Repo có `package-lock.json`, không tự chuyển sang pnpm/yarn.
- FE: lint/build theo scripts; kiểm tra loading, empty, error, responsive, keyboard, touch, tiếng Việt và reduced motion. Đảm bảo các section chính có scroll-reveal phù hợp mà không làm ẩn nội dung thiết yếu.
- BE: test theo module; kiểm tra validation, status code, phân quyền và error handling. Không đoán test runner.
- Prisma: chỉ `prisma validate` khi môi trường phù hợp; migration/thay đổi dữ liệu phải xin phép.
- Nếu thiếu dependency/env/quyền truy cập, báo rõ chưa thể kiểm chứng.

## 8. Agent và Sub-agent

- **Leader / Orchestrator:** đọc gateway, chia việc theo vùng, truyền quy tắc, giới hạn quyền, review diff và tự xác nhận kết quả kiểm tra.
- **FE Developer:** làm trong `FE_RStudy/`, tuân thủ `.agents/rules/frontend.md`, `FE_RStudy/docs/AI_RULES.md`, `DESIGN_SYSTEM.md` và `design_system.json`.
- **BE Developer:** làm trong `BE_RStudy/`, tuân thủ `BE_RStudy/docs/02-quy-uoc-ky-thuat.md`, tài liệu nghiệp vụ/API và các lớp Express–Prisma hiện hữu.
- **QA / Reviewer:** đọc quy tắc vùng, viết/chạy test thích hợp, tìm regression; không tự sửa rộng hoặc thực hiện thao tác nguy hiểm.
- **Documentation Agent:** cập nhật tài liệu tiếng Việt dựa trên code đã xác minh; không bịa endpoint, enum, cấu hình hoặc trạng thái.

Khi thay đổi API contract hoặc dữ liệu liên quan FE/BE, Leader phối hợp cả hai vùng, đánh giá tương thích ngược và xin phép trước thay đổi có rủi ro.

## 9. Xử lý mâu thuẫn

- Tuân thủ chỉ dẫn hệ thống/công cụ và ranh giới an toàn trước tiên; trong phạm vi dự án, áp dụng yêu cầu cụ thể đã được người dùng xác nhận, sau đó quy tắc vùng và tài liệu chuyên biệt.
- `AGENTS.md` quy định phạm vi/quy trình chung; `.agents/rules/`, `AI_RULES.md` và `BE_RStudy/docs/02-quy-uoc-ky-thuat.md` quy định thực thi; `DESIGN_SYSTEM.md` / `design_system.json` là nguồn chuẩn cho quyết định thiết kế. Quy định mobile-first và scroll-reveal cho section chính đã được chốt (23/11) và đã ghi vào `AI_RULES.md`.
- Code/test/config thực tế là bằng chứng về hành vi hiện hành; không tự ý coi chúng là yêu cầu phải giữ nguyên nếu mâu thuẫn với thay đổi đã được duyệt.
- Khi mâu thuẫn ảnh hưởng nghiệp vụ, contract hoặc bảo mật, báo rõ và hỏi trước khi sửa.
