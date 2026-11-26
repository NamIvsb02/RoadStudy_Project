# Quy trình làm việc

Áp dụng cho toàn bộ repository.

## Ngôn ngữ (bắt buộc, lâu dài)

- Mọi trao đổi với người dùng, kế hoạch, báo cáo, tài liệu và giải thích đều viết bằng **tiếng Việt có dấu**.
- Chỉ dùng ngôn ngữ khác khi người dùng yêu cầu ngoại lệ. Ngoại lệ đã chốt: **commit message viết bằng tiếng Anh** (xem mục Quy tắc commit).
- Giữ nguyên thuật ngữ kỹ thuật tiếng Anh khi cần chính xác. Tên biến, hàm, file, API, lệnh viết đúng như trong code.
- Text giao diện và thông báo lỗi trả cho người dùng cuối bằng tiếng Việt.

## Việc phải xin phép trước

| Hành động                                                   | Ghi chú                                                     |
| ----------------------------------------------------------- | ----------------------------------------------------------- |
| Cài, gỡ, cập nhật package hoặc đổi framework                | Kể cả devDependency, kể cả thư viện test                    |
| Sửa `schema.prisma`, chạy migration, seed                   | Xem `database.md`. `migrate reset` bị cấm                   |
| Sửa `Dockerfile`, `docker-compose.yml`, `nginx.conf`, CI/CD | Chạy `docker compose` để kiểm tra thì không cần xin         |
| `git commit`, `git push`, tạo PR, đổi nhánh, rebase, merge  | Không force push, không `reset --hard`, không xóa nhánh     |
| Sửa file nền tảng FE: `axiosClient`, `AuthContext`, guard   | `ProtectedRoute`, `PermissionRoute`, `LeaderRoute`          |
| Thay đổi API contract dùng chung FE/BE                      | Đánh giá tương thích ngược, cập nhật `api-spec.md` cùng lúc |

## Phạm vi

- Chỉ làm đúng phần được giao. Không tự thêm trang, tính năng, nút, refactor lan man.
- Nhiệm vụ chỉ thuộc FE hoặc BE thì không sửa chéo vùng kia. Thấy lỗi ngoài phạm vi thì báo, không tự sửa.
- Người dùng nói "hướng dẫn tôi làm" thì chỉ hướng dẫn, không sửa file hay môi trường.
- Thiếu thông tin quan trọng không xác minh được từ repo (icon, hiệu ứng, endpoint, nghiệp vụ) thì hỏi, không đoán.
- Mâu thuẫn ảnh hưởng nghiệp vụ, contract hoặc bảo mật: báo rõ và hỏi trước khi sửa. Code thực tế là bằng chứng về hành vi hiện hành, tài liệu đã duyệt là yêu cầu.

## Các bước một tác vụ

1. Xác định vùng (FE / BE / full-stack), tiêu chí hoàn thành, rủi ro.
2. Đọc rule của vùng và code hiện có. Tái sử dụng component, hook, util, validator sẵn có.
3. Tác vụ nhiều bước thì lập kế hoạch ngắn. Diff nhỏ, đúng phạm vi.
4. Kiểm tra theo `testing.md`.
5. Review diff, loại thay đổi ngoài ý muốn. Sau khi sửa code chạy `graphify update .`.
6. Báo cáo: file đã sửa, hành vi thay đổi, lệnh đã chạy và kết quả, phần chưa kiểm chứng, rủi ro. Phân biệt **đã kiểm chứng**, **suy luận**, **chưa xác nhận**. Không nói đã chạy test/build khi chưa chạy.

## Nhóm và Git

- Nhóm: Nam (trưởng nhóm), Huynh, Khang. Chỉ Nam sửa schema, chạy migration, duyệt và merge PR.
- Người phụ trách từng module ghi ở tiêu đề mục tương ứng trong `BE_RStudy/docs/api-spec.md`. Sửa module của người khác thì báo người đó.
- Nhánh chính: `main`. Không push thẳng `main`, không áp đặt nhánh `develop`.
- Mỗi việc một nhánh `feature/<ten-viec>` (ví dụ `feature/discount`). Không đổi tên nhánh cũ.
- Commit theo mục [Quy tắc commit](#quy-tắc-commit) bên dưới.
- PR vào `main`: CodeRabbit tự review, người tạo PR sửa theo góp ý, Nam duyệt và merge.
- Phân công và deadline nằm trong file Excel của nhóm, không chép vào repo.
- `graphify-out/graph.json` được build lại toàn bộ mỗi lần, diff lớn là bình thường.

## Quy tắc commit

Dạng: `<type>(<scope>): <subject>`, viết **bằng tiếng Anh**, chi tiết, chính xác và ngắn gọn.

| Phần      | Quy tắc                                                                                                                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`    | `feat` tính năng mới, `fix` sửa lỗi, `refactor` đổi cấu trúc không đổi hành vi, `docs` tài liệu, `test` test, `chore` cấu hình, công cụ, dependency                                               |
| `scope`   | `FE` khi chỉ đổi `FE_RStudy/`, `BE` khi chỉ đổi `BE_RStudy/`, `FE,BE` khi đổi cả hai. Thay đổi ở thư mục gốc (tài liệu, `.claude/`, Docker, `.gitignore`) thì bỏ scope: `docs: ...`, `chore: ...` |
| `subject` | Động từ nguyên mẫu viết thường (`add`, `fix`, `remove`, `require`), không dấu chấm cuối, nêu đúng thứ đã đổi. Cả dòng đầu (kể cả `type(scope):`) tối đa 72 ký tự                                  |

- Nêu **cái gì đã đổi**, gọi tên cụ thể (module, endpoint, màn hình, hàm), không dùng từ mơ hồ như `update`, `done`, `fix bug`, `changes`.
- Cần giải thích **vì sao** hoặc liệt kê nhiều ý thì thêm phần thân, cách subject một dòng trống, mỗi ý một gạch đầu dòng.
- Mỗi commit một thay đổi logic. Tách commit tài liệu/cấu hình khỏi commit sửa code; code BE và FE của cùng một tính năng gộp được nếu không thể tách độc lập.
- Giữ nguyên dòng `Co-Authored-By` mà công cụ thêm vào cuối message. Không đưa bí mật hay dữ liệu cá nhân vào message.

| Nên                                                                 | Không nên                                         |
| ------------------------------------------------------------------- | ------------------------------------------------- |
| `fix(BE): block course price and date edits once students enrolled` | `fix(BE): update course`                          |
| `feat(FE): require a rejection reason when admin rejects a course`  | `feat(FE): done`                                  |
| `feat(BE): notify reporter when a violation report is handled`      | `fix: bug`                                        |
| `docs: replace AGENTS.md and design_system.json with .claude/rules` | `docs: cập nhật tài liệu` (không dùng tiếng Việt) |

Các commit cũ viết bằng tiếng Việt giữ nguyên, quy tắc này áp dụng cho commit mới.

## Bí mật và dữ liệu

- Không đọc, in, sao chép nội dung `.env` trừ khi thực sự cần và được phép. Không dán `DATABASE_URL`, `DIRECT_URL`, API key, mật khẩu vào chat, tài liệu, commit.
- Chỉ commit `.env.example` với giá trị giữ chỗ. Không commit `.env`, `node_modules/`, `uploads/`, `.claude/settings.local.json`.
- Không gửi mã nguồn, dữ liệu người dùng hoặc bí mật ra dịch vụ ngoài khi chưa được phép.

## Documentation Standards

Áp dụng cho mọi file Markdown trong repository.

- Viết theo GitHub Flavored Markdown (GFM).
- Heading rõ ràng, phân cấp nhất quán (một `#` mỗi file, không nhảy cấp).
- Dùng bảng cho thông tin có cấu trúc và so sánh. Bảng phải hiển thị đúng trên GitHub: có hàng phân cách, không xuống dòng trong ô, ký tự `|` trong ô phải escape.
- Code block luôn có định danh ngôn ngữ (`bash`, `js`, `jsx`, `json`, `text`...).
- Dùng inline code cho lệnh, đường dẫn và định danh.
- Dùng sơ đồ Mermaid cho luồng phức tạp (nhiều bước, nhiều trạng thái).
- Tránh lặp nội dung và lồng danh sách quá sâu. Thông tin đã có ở nơi khác thì liên kết, không chép lại.
- Sau khi tạo hoặc sửa Markdown, chạy Prettier của dự án **chỉ trên các file vừa đụng tới**:

  ```bash
  npx prettier --write <file1.md> <file2.md>
  ```

- Kiểm tra lại bảng, code block, heading, liên kết tương đối và sơ đồ Mermaid trước khi báo xong.
