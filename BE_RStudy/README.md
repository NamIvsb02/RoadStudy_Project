# BE_RStudy

Backend của RoadStudy: Node.js 24, Express 5, Prisma 6, PostgreSQL (Supabase), CommonJS.

| Tài liệu                                                       | Nội dung                                  |
| -------------------------------------------------------------- | ----------------------------------------- |
| [`../SETUP.md`](../SETUP.md)                                   | Cài đặt, biến môi trường, migration, test |
| [`docs/api-spec.md`](docs/api-spec.md)                         | Đặc tả API (nguồn chuẩn cho FE và BE)     |
| [`docs/enum.md`](docs/enum.md)                                 | Enum, trạng thái, loại thông báo          |
| [`../.claude/rules/backend.md`](../.claude/rules/backend.md)   | Quy ước code backend                      |
| [`../.claude/rules/database.md`](../.claude/rules/database.md) | Quy tắc database dùng chung               |
| [`../.claude/rules/business.md`](../.claude/rules/business.md) | Quy tắc nghiệp vụ                         |

```bash
npm install
npx prisma generate
npm run dev     # http://localhost:5000, kiểm tra GET /health
```
