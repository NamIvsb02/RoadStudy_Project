# CLAUDE.md

## Đọc trước khi làm (bắt buộc, trước mọi thao tác sửa code)

Làm theo đúng thứ tự dưới đây. **Agent chính (leader) khi gọi subagent phải nạp đúng các file này cho subagent**, và tự kiểm tra lại kết quả, không coi báo cáo suông của subagent là bằng chứng đã xong.

1. **Hiểu yêu cầu.** Thiếu thông tin thì hỏi, không đoán.
2. **Hỏi codebase bằng graph trước.** Nếu `graphify-out/graph.json` tồn tại, chạy `graphify query "<câu hỏi>"` trước lần grep hoặc đọc source đầu tiên (chi tiết ở mục graphify cuối file).
3. **Đọc rule theo vùng sắp sửa:**

| Sắp làm gì                                              | Phải đọc trước                                                                 |
| ------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Bất kỳ việc nào                                         | `.claude/rules/workflow.md`                                                    |
| Sửa `BE_RStudy/`                                        | `.claude/rules/backend.md`, `.claude/rules/security.md`                        |
| Đụng Prisma, schema, repository, migration              | `.claude/rules/database.md`                                                    |
| Viết hoặc sửa service, validator, trang FE có nghiệp vụ | `.claude/rules/business.md`                                                    |
| Sửa `FE_RStudy/`                                        | `.claude/rules/frontend.md`, `.claude/rules/design.md`, rồi `DESIGN_SYSTEM.md` |
| Viết hoặc sửa test                                      | `.claude/rules/testing.md`                                                     |

4. **Đọc tài liệu chuẩn của phần đang làm:**
   - Gọi hoặc viết API: mục của module đó trong `BE_RStudy/docs/api-spec.md` (nguồn chuẩn). API chưa có trong file này thì **chưa tính là xong**.
   - Dùng trạng thái, enum, loại thông báo: `BE_RStudy/docs/enum.md`.
5. **Xem code xung quanh** để bám đúng cách làm hiện có, rồi **lập kế hoạch** các bước trước khi sửa.

## Guardrails

- **Luôn trả lời, lập kế hoạch, báo cáo và viết tài liệu bằng tiếng Việt** (giữ thuật ngữ kỹ thuật tiếng Anh khi cần). Chỉ đổi ngôn ngữ khi người dùng yêu cầu. Tên file, biến, hàm giữ tiếng Anh. **Ngoại lệ: commit message viết bằng tiếng Anh** (quy tắc ở `.claude/rules/workflow.md`).
- **Xin phép trước** khi: cài/cập nhật package, sửa `schema.prisma`, chạy migration hoặc seed, sửa Docker/CI, commit, push, tạo PR, đổi nhánh, gửi dữ liệu ra dịch vụ ngoài.
- **Cấm** `prisma migrate reset`, seed lại, xóa dữ liệu: cả nhóm dùng chung **một database Supabase**. Chỉ Nam sửa schema và chạy migration.
- **Cấm** `git push --force`, `git reset --hard`, xóa nhánh khi chưa được người dùng đồng ý.
- Không đọc, in hay commit `.env` và bí mật (`DATABASE_URL`, `DIRECT_URL`, API key).
- Chỉ làm đúng phạm vi; không sửa chéo FE/BE khi nhiệm vụ thuộc một vùng. Thấy lỗi ngoài vùng phụ trách thì **ghi nhận và báo người dùng**, không tự sửa lan.
- Không tắt xác thực, phân quyền, validate để sửa nhanh. Backend mới là nơi chặn quyền thật.
- Không tự tạo file mới ngoài phạm vi được giao (đặc biệt file `.md`) khi chưa hỏi.
- Không nói đã chạy test/build khi chưa chạy. Báo trung thực: đã làm gì, cái gì chưa xong, lỗi phát sinh.

## Cách giao tiếp

- Nói đơn giản, dễ hiểu. Thuật ngữ bắt buộc (ví dụ `JWT`, `transaction`, `middleware`) thì giải thích ngắn lần đầu.
- Giải thích phức tạp phải kèm ví dụ cụ thể.
- Người dùng chạy Windows với Git Bash: lệnh đưa ra phải chạy được trong Git Bash.
- Khi người dùng nói **"hướng dẫn tôi làm"**: chỉ giải thích từng bước và đưa lệnh, **không tự thực hiện**.
- Làm xong báo danh sách file đã tạo hoặc sửa và việc còn lại.

## Dự án

RoadStudy là website đăng ký và học trực tuyến có chatbot AI gợi ý khóa học, ba vai trò `STUDENT`, `TEACHER`, `ADMINISTRATOR` (admin có Leader và 8 quyền chức năng). Hai project npm độc lập, không có workspace gốc:

| Thư mục      | Công nghệ                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------- |
| `BE_RStudy/` | Node 24, Express 5, Prisma 6, PostgreSQL (Supabase), CommonJS, zod, JWT, multer           |
| `FE_RStudy/` | React 19, Vite, JSX, Tailwind v4, React Router 7, TanStack Query, axios                   |
| Thư mục gốc  | `CLAUDE.md`, `PRODUCT.md`, `DESIGN_SYSTEM.md`, `SETUP.md`, `docker-compose.yml`, Prettier |

```text
BE_RStudy/src/  routes → controllers → services → repositories (+ validators), 19 module, mount /api/<module>
BE_RStudy/prisma/  schema.prisma, migrations/, seed.js     BE_RStudy/tests/  script Node gọi HTTP
FE_RStudy/src/  api/ components/ constants/ context/ hooks/ pages/ routes/AppRoutes.jsx utils/
```

## Quy trình và kiểm tra

1. Đọc theo mục "Đọc trước khi làm" ở đầu file.
2. Làm thay đổi nhỏ gọn, bám đúng kiến trúc và phạm vi.
3. Kiểm tra trước khi báo xong (chi tiết trong `.claude/rules/testing.md`): FE chạy `npm run lint` và `npm run build`; BE bật server rồi chạy script test liên quan.
4. Báo cáo trung thực. Chỉ commit và push khi người dùng yêu cầu; quy ước nhánh và commit nằm trong `.claude/rules/workflow.md`.

## Lệnh thường dùng

| Việc            | Lệnh                                                              |
| --------------- | ----------------------------------------------------------------- |
| Chạy BE         | `cd BE_RStudy && npm run dev` (cổng 5000, kiểm tra `GET /health`) |
| Chạy FE         | `cd FE_RStudy && npm run dev` (cổng 5173)                         |
| Lint / build FE | `npm run lint`, `npm run build` (trong `FE_RStudy/`)              |
| Prisma Client   | `npm run db:generate` (sau khi pull hoặc schema đổi)              |
| Test BE         | Bật `npm run dev`, rồi `node tests/<module>.test.js`              |
| Docker          | `docker compose up -d --build` (thư mục gốc)                      |
| Format Markdown | `npx prettier --write <file.md>` (chỉ file vừa sửa)               |

## Rules và tài liệu

Rules trong `.claude/rules/` tự nạp theo đường dẫn file đang làm, nhưng **vẫn phải đọc đúng file theo bảng ở đầu trang** trước khi sửa code, vì subagent không chắc nhận được rule tự nạp.

| Rule          | Phạm vi                      | Nội dung                                                  |
| ------------- | ---------------------------- | --------------------------------------------------------- |
| `workflow.md` | Toàn repo                    | Ngôn ngữ, việc cần xin phép, Git, báo cáo, chuẩn Markdown |
| `testing.md`  | Toàn repo                    | Kiểm tra trước khi báo xong, cách chạy test BE            |
| `backend.md`  | `BE_RStudy/**`               | Phân tầng, response, lỗi, validate, upload, AI            |
| `database.md` | Prisma, repository           | DB dùng chung, migration, quy ước schema                  |
| `security.md` | `src/**` của FE và BE        | Xác thực, phân quyền, dữ liệu nhạy cảm, prompt AI         |
| `business.md` | Service, validator, trang FE | Quy tắc nghiệp vụ đã chốt và chưa chốt                    |
| `frontend.md` | `FE_RStudy/**`               | Quy tắc cứng FE, cấu trúc, gọi API, auth                  |
| `design.md`   | JSX, CSS, spec               | Cách áp dụng và kiểm tra `DESIGN_SYSTEM.md`               |

### Subagent

Subagent trong `.claude/agents/` (model Sonnet), chỉ gọi khi người dùng yêu cầu:

| Agent               | Dùng khi                                                      | Sửa file?              |
| ------------------- | ------------------------------------------------------------- | ---------------------- |
| `frontend-reviewer` | Review thay đổi `FE_RStudy/`                                  | Không                  |
| `backend-reviewer`  | Review thay đổi `BE_RStudy/`                                  | Không                  |
| `security-reviewer` | Audit tài khoản, quyền, thanh toán, upload, secrets, cấu hình | Không                  |
| `test-engineer`     | Kiểm chứng hành vi bằng test chạy thật                        | Chỉ `BE_RStudy/tests/` |

Khi gọi subagent: nạp cho nó các file rule đúng vùng (bảng ở đầu trang), quy tắc graphify, và mục [Agent Skills](#agent-skills) nếu subagent dùng skill. Agent chính tự xem diff và tự chạy lệnh kiểm tra.

### Tài liệu tham khảo

Chỉ đọc phần cần cho tác vụ:

| Cần biết                                 | Đọc                                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------------------- |
| Endpoint, body, response, lỗi            | `BE_RStudy/docs/api-spec.md` (nguồn chuẩn; Swagger UI ở `/api-docs` sinh từ file này) |
| Giá trị enum, trạng thái, loại thông báo | `BE_RStudy/docs/enum.md`                                                              |
| Token, component, motion, responsive     | `DESIGN_SYSTEM.md`                                                                    |
| Mẫu spec trang FE                        | Mục "Spec trang" trong `.claude/rules/frontend.md`                                    |
| Mục tiêu sản phẩm, người dùng            | `PRODUCT.md`                                                                          |
| Cài đặt, biến môi trường, Docker         | `SETUP.md`                                                                            |

## Agent Skills

Skill bên thứ ba cài ở `.claude/skills/` (phạm vi project, chỉ Claude Code, bản copy), nguồn và commit ghi trong `skills-lock.json`. Cài lại hoặc cập nhật: `npx skills update -p` (xin phép trước, coi như cài package).

| Skill                         | Dùng khi                                                               | Cách gọi                                                   |
| ----------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------- |
| `vercel-react-best-practices` | Viết, review, tối ưu hiệu năng React (re-render, bundle, rendering)    | `/vercel-react-best-practices`, hoặc tự nạp khi viết React |
| `web-design-guidelines`       | Review UI, accessibility, UX theo checklist (chỉ đọc, báo `file:line`) | `/web-design-guidelines <file-hoặc-glob>`                  |

Thứ tự ưu tiên khi mâu thuẫn: yêu cầu người dùng > `CLAUDE.md` và `.claude/rules/` > `DESIGN_SYSTEM.md` > skill. Skill chỉ là tham khảo:

- Không thêm thư viện, đổi công nghệ, nghiệp vụ, token, font hay phong cách theo skill. Stack giữ nguyên React 19 + Vite + JSX, `framer-motion`, `lucide-react`.
- `vercel-react-best-practices`: bỏ qua rule Next.js, React Server Components, Server Actions (`server-*`, `next/dynamic`, `after()`, hydration/SSR) và rule dùng SWR. Dự án là SPA Vite, server state dùng TanStack Query.
- `web-design-guidelines`: rule lấy từ file đính kèm `references/command.md`, không tải từ mạng. Điểm nào lệch `DESIGN_SYSTEM.md` hoặc `design.md` thì theo tài liệu dự án.
- Không sửa file trong `.claude/skills/`; muốn đổi thì cập nhật từ nguồn.

## graphify

Repo có knowledge graph ở `graphify-out/`.

- Khi `graphify-out/graph.json` tồn tại, chạy `graphify query "<câu hỏi>"` trước lần grep/đọc source đầu tiên cho câu hỏi về codebase, và đưa quy tắc này vào prompt của mọi subagent khám phá code. Chỉ đọc file gốc cho các dòng mà graph hoặc lần đọc trước đã chỉ ra.
- `graphify path "<A>" "<B>"` cho quan hệ, `graphify explain "<khái niệm>"` cho một khái niệm, `graphify section "<heading>"` để in một mục Markdown mà không mở cả file.
- Chỉ đọc `graphify-out/GRAPH_REPORT.md` khi review kiến trúc tổng thể hoặc khi query/path/explain không đủ.
- Sau khi sửa code chạy `graphify update .` (chỉ AST, không tốn API).
- `graphify-out/graph.json` được ghi lại toàn bộ mỗi lần build; diff lớn trong PR là bình thường, không coi là churn.
