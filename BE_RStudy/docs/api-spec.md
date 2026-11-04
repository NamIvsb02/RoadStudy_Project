# API Spec RoadStudy

Base URL: `http://localhost:5000/api` (FE đặt trong `VITE_API_URL`).
Chốt hai biến:
VITE_API_URL=http://localhost:5000/api và VITE_ASSET_URL=http://localhost:5000

Quy tắc nhóm: **API chưa có trong file này thì chưa tính là xong.** Người viết API điền mục của mình trước khi báo Done. FE thấy spec sai hoặc thiếu thì báo người viết BE sửa spec, không tự đoán.

## 1. Quy ước chung

### Định dạng response

Mọi API đều trả:

```json
{ "success": true, "message": "...", "data": ... }
```

Lỗi: `success: false`, `data: null`, `message` là nội dung hiển thị được.

### Mã HTTP

| Mã        | Nghĩa                                                                                                 |
| --------- | ----------------------------------------------------------------------------------------------------- |
| 200 / 201 | Thành công / tạo mới thành công                                                                       |
| 400       | Dữ liệu sai hoặc vi phạm nghiệp vụ. Lỗi validate có dạng `"tênTrường: nội dung lỗi; tênTrường2: ..."` |
| 401       | Chưa đăng nhập, token sai hoặc hết hạn                                                                |
| 403       | Không đủ quyền, hoặc tài khoản bị khóa / chưa xác minh                                                |
| 404       | Không tìm thấy (kể cả URL không tồn tại)                                                              |
| 409       | Trùng dữ liệu (ví dụ email đã dùng)                                                                   |
| 500       | Lỗi hệ thống: `"Lỗi hệ thống, vui lòng thử lại sau"`                                                  |

### Xác thực

- API cần đăng nhập gửi header: `Authorization: Bearer <accessToken>`.
- Access token sống **15 phút**, refresh token sống **7 ngày**.
- Khi gặp 401 "Token không hợp lệ hoặc hết hạn": gọi `POST /auth/refresh`. Refresh thành công thì gọi lại request cũ. Refresh cũng 401 thì xóa token và chuyển về trang đăng nhập.
- Refresh token **xoay vòng**: mỗi lần refresh nhận cặp token mới, token cũ mất hiệu lực. FE phải lưu cặp mới.
- Nhiều request cùng lúc gặp 401: chỉ gọi /auth/refresh MỘT lần, các request còn lại chờ rồi gọi lại. Refresh token xoay vòng nên gọi hai lần cùng một token sẽ bị 401 ở lần hai.
- Không tự refresh khi chính /auth/login hoặc /auth/refresh trả 401 (tránh lặp vô hạn). Nhận biết theo URL, không theo nội dung message.
- Lỗi thường gặp ở mọi API cần đăng nhập:
  - 401 `Thiếu token xác thực`
  - 401 `Token không hợp lệ hoặc hết hạn`
  - 403 `Không đủ quyền truy cập` (sai vai trò)

### Vai trò

`STUDENT`, `TEACHER`, `ADMINISTRATOR`. Giá trị enum xem `docs/enums.md`.

### Kiểu dữ liệu

- Tiền (Decimal) trả về dạng **chuỗi**, ví dụ `"499000.00"`. FE tự định dạng VND.
- Thời gian là chuỗi ISO 8601, lưu giờ UTC. FE hiển thị theo giờ Việt Nam.
- Không bao giờ có `passwordHash` trong response.

### Phân trang (mọi API danh sách)

Query: `?page=1&limit=10` (mặc định page 1, limit 10, tối đa 100).

Response danh sách dùng dạng:

```json
{
  "success": true,
  "message": "",
  "data": {
    "items": [ ... ],
    "pagination": { "total": 42, "page": 1, "limit": 10, "totalPages": 5 }
  }
}
```

### Kiểm tra server

`GET /health` trả `{ "status": "ok" }` (nằm ngoài `/api`).

---

## 2. Auth (`/api/auth`) — Nam

Luồng đăng ký: `register` → nhận OTP qua email → `verify-email` → `login`.
Tài khoản mới có `status = CHO_XAC_MINH`, chưa đăng nhập được cho tới khi xác minh.
Mã OTP gồm 6 chữ số, hết hạn sau 10 phút. Khi server chưa cấu hình SMTP, OTP được in ra console server (dòng `[DEV MAIL]`).

### POST /auth/register

- Quyền: công khai
- Body học viên:

| Trường      | Kiểu        | Bắt buộc | Ghi chú                              |
| ----------- | ----------- | -------- | ------------------------------------ |
| role        | `"STUDENT"` | có       |                                      |
| fullName    | string      | có       | 1 đến 100 ký tự                      |
| email       | string      | có       | email hợp lệ, tối đa 254             |
| password    | string      | có       | tối thiểu 8 ký tự                    |
| phoneNumber | string      | không    | tối đa 15                            |
| dateOfBirth | string      | không    | ngày, ví dụ `"2003-05-10"`           |
| gender      | string      | không    | `NAM`, `NU`, `KHAC`, `KHONG_TIET_LO` |
| address     | string      | không    | tối đa 255                           |

- Body giáo viên:

| Trường                                 | Kiểu        | Bắt buộc | Ghi chú         |
| -------------------------------------- | ----------- | -------- | --------------- |
| role                                   | `"TEACHER"` | có       |                 |
| fullName, email, password, phoneNumber |             |          | như trên        |
| specialization                         | string      | có       | 1 đến 150 ký tự |
| biography                              | string      | có       |                 |
| teachingExperience                     | string      | có       |                 |

- 201: `data` là tài khoản vừa tạo (`id, fullName, email, phoneNumber, avatarUrl, role, status: "CHO_XAC_MINH", createdAt, student | teacher | administrator`)
- Message: `Đăng ký thành công, vui lòng kiểm tra email để xác minh`
- Lỗi: 400 sai dữ liệu | 409 `Email đã được sử dụng`
- Ghi chú: giáo viên mới có `approvalStatus = CHO_DUYET`. Nếu email OTP không tới, dùng `resend-otp`.

### POST /auth/verify-email

- Quyền: công khai
- Body: `{ "email": string, "code": string }` (`code` đúng 6 ký tự, không có khoảng trắng)
- 200: `data: null`, message `Xác minh email thành công`. Tài khoản chuyển sang `HOAT_DONG`.
- Lỗi: 400 `Mã xác thực không tồn tại hoặc đã hết hạn` | 400 `Mã xác thực không đúng` | 400 `Tài khoản đã được xác minh trước đó` | 404 `Tài khoản không tồn tại`

### POST /auth/resend-otp

- Quyền: công khai
- Body: `{ "email": string, "purpose": "XAC_MINH_EMAIL" | "QUEN_MAT_KHAU" }`
- 200: `data: null`, message `Mã xác thực đã được gửi tới email` (hoặc `Nếu email tồn tại, mã xác thực đã được gửi` khi email không có trong hệ thống)
- Lỗi: 400 `Tài khoản đã được xác minh trước đó` (khi purpose là `XAC_MINH_EMAIL`)

### POST /auth/login

- Quyền: công khai
- Body: `{ "email": string, "password": string }`
- 200: message `Đăng nhập thành công`

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "account": { "id": "", "fullName": "", "email": "", "phoneNumber": null, "avatarUrl": null, "role": "STUDENT", "status": "HOAT_DONG", "createdAt": "" }
}
```

- Lỗi: 401 `Email hoặc mật khẩu không đúng` | 403 `Tài khoản đã bị khóa` | 403 `Tài khoản chưa xác minh email, vui lòng kiểm tra email hoặc yêu cầu gửi lại mã`
- Ghi chú: `account` ở đây **không** có `student`/`teacher`/`administrator`. Cần hồ sơ đầy đủ thì gọi `GET /auth/me`. FE dùng `account.role` để chuyển trang: STUDENT về trang chủ, TEACHER vào `/teacher`, ADMINISTRATOR vào `/admin`. Giáo viên `CHO_DUYET` hoặc `TU_CHOI` vẫn đăng nhập được, FE kiểm tra `teacher.approvalStatus` từ `/auth/me`.

### POST /auth/refresh

- Quyền: công khai
- Body: `{ "refreshToken": string }`
- 200: message `Làm mới token thành công`, `data: { "accessToken": "...", "refreshToken": "..." }`
- Lỗi: 401 `Refresh token không hợp lệ hoặc hết hạn` | 401 `Refresh token không hợp lệ hoặc đã bị thu hồi` | 403 `Tài khoản không khả dụng`
- Ghi chú: token cũ bị thu hồi ngay, dùng lại sẽ 401.

### POST /auth/logout

- Quyền: đã đăng nhập (mọi vai trò)
- Header: `Authorization: Bearer <accessToken>`
- Body: `{ "refreshToken": string }`
- 200: `data: null`, message `Đăng xuất thành công`
- Ghi chú: refresh token bị thu hồi. Access token cũ vẫn dùng được cho tới khi hết hạn (tối đa 15 phút), FE chỉ cần xóa token ở máy.

### POST /auth/forgot-password

- Quyền: công khai
- Body: `{ "email": string }`
- 200: `data: null`, message `Nếu email tồn tại trong hệ thống, mã đặt lại mật khẩu đã được gửi`
- Ghi chú: luôn trả 200 dù email có tồn tại hay không. Gửi OTP với mục đích `QUEN_MAT_KHAU`.

### POST /auth/reset-password

- Quyền: công khai
- Body: `{ "email": string, "code": string, "newPassword": string }` (`code` đúng 6 ký tự, `newPassword` tối thiểu 8)
- 200: `data: null`, message `Đặt lại mật khẩu thành công`
- Lỗi: 400 `Mã xác thực không đúng hoặc đã hết hạn` | 400 `Mã xác thực không đúng`
- Ghi chú: mọi refresh token cũ của tài khoản bị thu hồi, phải đăng nhập lại.

### POST /auth/change-password

- Quyền: đã đăng nhập (mọi vai trò)
- Body: `{ "oldPassword": string, "newPassword": string }` (`newPassword` tối thiểu 8)
- 200: `data: null`, message `Đổi mật khẩu thành công`
- Lỗi: 400 `Mật khẩu hiện tại không đúng` | 404 `Không tìm thấy tài khoản`
- Ghi chú: mọi refresh token bị thu hồi. FE nên xóa token và đưa người dùng về trang đăng nhập.

### GET /auth/me

- Quyền: đã đăng nhập (mọi vai trò)
- 200: `data` là tài khoản đầy đủ: `id, fullName, email, phoneNumber, avatarUrl, role, status, createdAt` và một trong `student`, `teacher`, `administrator` (hai cái còn lại là `null`).
  - `student`: `id, dateOfBirth, gender, address, joinedAt, accountId`
  - `teacher`: `id, specialization, biography, teachingExperience, approvalStatus, accountId`
  - `administrator`: `id, accountId, isLeader`
- Lỗi: 404 `Không tìm thấy tài khoản`
- Ghi chú: **chưa trả danh sách quyền của admin thường.** Sẽ bổ sung cùng API Admin (04/11), spec sẽ cập nhật lúc đó.

## 3. Account (`/api/account`) — Nam

Hồ sơ của chính mình xem bằng `GET /auth/me`. Đổi mật khẩu xem mục Auth.

`avatarUrl` là đường dẫn tương đối, ví dụ `/uploads/avatars/abc.jpg`. FE tự ghép với địa chỉ BE (`http://localhost:5000` + `avatarUrl`).

### PATCH /account/profile

- Quyền: đã đăng nhập
- Body: tất cả đều không bắt buộc, nhưng phải gửi ít nhất 1 trường.

| Trường             | Kiểu           | Ai được gửi | Ghi chú                              |
| ------------------ | -------------- | ----------- | ------------------------------------ |
| fullName           | string         | mọi vai trò | 1 đến 100 ký tự                      |
| phoneNumber        | string \| null | mọi vai trò | tối đa 15, gửi `null` để xóa         |
| dateOfBirth        | string \| null | học viên    | ngày, ví dụ `"2003-05-10"`           |
| gender             | string \| null | học viên    | `NAM`, `NU`, `KHAC`, `KHONG_TIET_LO` |
| address            | string \| null | học viên    | tối đa 255                           |
| specialization     | string         | giáo viên   | 1 đến 150 ký tự                      |
| biography          | string         | giáo viên   | 1 đến 5000 ký tự                     |
| teachingExperience | string         | giáo viên   | 1 đến 5000 ký tự                     |

- 200: `data` là tài khoản đầy đủ (cùng dạng với `GET /auth/me`), message `Cập nhật hồ sơ thành công`
- Lỗi: 400 sai dữ liệu | 400 `Chỉ học viên mới có ngày sinh, giới tính, địa chỉ` | 400 `Chỉ giáo viên mới có chuyên môn, giới thiệu, kinh nghiệm`
- Ghi chú: không cho đổi `email` và `role`, gửi các trường này sẽ bị 400. Giáo viên sửa hồ sơ không phải duyệt lại.

### POST /account/avatar

- Quyền: đã đăng nhập
- Body: `multipart/form-data`, trường file tên `avatar`. Chỉ nhận jpg, png, webp, tối đa 2MB.
- 200: `data` là tài khoản đầy đủ có `avatarUrl` mới, message `Cập nhật ảnh đại diện thành công`
- Lỗi: 400 `Chưa chọn ảnh (trường tên "avatar")` | 400 `Chỉ chấp nhận: .jpg, .png, .webp` | 400 `Tệp tối đa 2MB`
- Ghi chú: ảnh cũ bị xóa khỏi server.

### GET /account

- Quyền: ADMINISTRATOR
- Query: `role` (`STUDENT`, `TEACHER`, `ADMINISTRATOR`), `status` (`HOAT_DONG`, `BI_KHOA`, `CHO_XAC_MINH`), `search` (tìm theo tên hoặc email), `page`, `limit`
- 200: `data` theo dạng phân trang ở mục 1. Mỗi phần tử trong `items`:

```json
{
  "id": "",
  "fullName": "",
  "email": "",
  "phoneNumber": null,
  "avatarUrl": null,
  "role": "TEACHER",
  "status": "HOAT_DONG",
  "createdAt": "",
  "teacher": { "id": "", "approvalStatus": "CHO_DUYET" }
}
```

- Lỗi: 400 `role không hợp lệ` | 400 `status không hợp lệ`
- Ghi chú: `teacher` là `null` nếu không phải giáo viên. Sắp xếp mới nhất trước.

### PATCH /account/:id/status

- Quyền: ADMINISTRATOR
- Body: `{ "status": "HOAT_DONG" | "BI_KHOA" }`
- 200: `data` là tài khoản đầy đủ. Message `Đã khóa tài khoản` hoặc `Đã mở khóa tài khoản`
- Lỗi: 400 `Không thể tự khóa hoặc mở khóa tài khoản của mình` | 403 `Chỉ quản trị viên trưởng mới được khóa hoặc mở khóa quản trị viên` | 403 `Không thể khóa quản trị viên trưởng` | 404 `Không tìm thấy tài khoản`
- Ghi chú: khóa tài khoản thì thu hồi luôn refresh token (người đó bị đăng xuất khi access token hết hạn). Không lưu lý do khóa. Mở khóa đưa về `HOAT_DONG`.

---

## 4. Teacher (`/api/teacher`) — Nam

Giáo viên `CHO_DUYET` hoặc `TU_CHOI` vẫn đăng nhập được nhưng chưa xuất hiện ở API công khai và chưa tạo được khóa học.

### GET /teacher

- Quyền: công khai
- Query: `search` (tìm theo tên hoặc chuyên môn), `page`, `limit`
- 200: `data` theo dạng phân trang ở mục 1. Mỗi phần tử trong `items`:

```json
{
  "id": "",
  "specialization": "",
  "biography": "",
  "account": { "fullName": "", "avatarUrl": null },
  "_count": { "courses": 3 }
}
```

- Ghi chú: chỉ trả giáo viên `DA_DUYET` và tài khoản đang `HOAT_DONG`. `_count.courses` là số khóa học `DANG_MO`. Sắp xếp theo tên A đến Z.

### GET /teacher/:id

- Quyền: công khai
- 200: `data`:

```json
{
  "id": "",
  "specialization": "",
  "biography": "",
  "teachingExperience": "",
  "account": { "fullName": "", "avatarUrl": null },
  "courses": [
    {
      "id": "",
      "courseName": "",
      "price": "499000.00",
      "coverImageUrl": null,
      "startDate": "",
      "endDate": "",
      "category": { "id": "", "categoryName": "" }
    }
  ]
}
```

- Lỗi: 404 `Không tìm thấy giáo viên`
- Ghi chú: `courses` chỉ gồm khóa `DANG_MO`, mới nhất trước, tối đa 50. Giáo viên chưa duyệt hoặc bị khóa trả 404.

### GET /teacher/admin/list

- Quyền: ADMINISTRATOR
- Query: `approvalStatus` (`CHO_DUYET`, `DA_DUYET`, `TU_CHOI`), `search` (tên, email, chuyên môn), `page`, `limit`
- 200: `data` theo dạng phân trang ở mục 1. Mỗi phần tử trong `items`:

```json
{
  "id": "",
  "specialization": "",
  "biography": "",
  "teachingExperience": "",
  "approvalStatus": "CHO_DUYET",
  "account": { "id": "", "fullName": "", "email": "", "phoneNumber": null, "avatarUrl": null, "status": "HOAT_DONG", "createdAt": "" }
}
```

- Lỗi: 400 `approvalStatus không hợp lệ`

### PATCH /teacher/:id/approval

- Quyền: ADMINISTRATOR
- Body: `{ "approvalStatus": "DA_DUYET" | "TU_CHOI" }`
- 200: message `Đã duyệt giáo viên` hoặc `Đã từ chối giáo viên`

```json
{ "id": "", "approvalStatus": "DA_DUYET", "account": { "id": "", "fullName": "", "email": "" } }
```

- Lỗi: 400 sai dữ liệu | 404 giáo viên không tồn tại
- Ghi chú: `:id` là `teacher.id`, không phải `account.id`.

> Quyền ADMINISTRATOR ở các API admin trên là tạm thời. Khi API Admin xong sẽ đổi sang quyền cụ thể (`QUAN_LY_TAI_KHOAN`, `DUYET_GIAO_VIEN`) và spec sẽ cập nhật lúc đó.

## Admin

Base URL: `/api/admin`. Mọi endpoint cần header `Authorization: Bearer <accessToken>` của tài khoản ADMINISTRATOR đang hoạt động.

Response thành công: `{ "success": true, "data": ... }`. Response lỗi: `{ "success": false, "message": "...", "data": null }`.

| Method | Endpoint                                    | Quyền     | Mô tả                                  |
| ------ | ------------------------------------------- | --------- | -------------------------------------- |
| GET    | `/api/admin/me`                             | Mọi admin | Quyền của admin đang đăng nhập         |
| GET    | `/api/admin/system-functions`               | Leader    | Danh sách chức năng hệ thống           |
| GET    | `/api/admin/administrators`                 | Leader    | Danh sách admin (phân trang, tìm kiếm) |
| POST   | `/api/admin/administrators`                 | Leader    | Tạo admin thường                       |
| GET    | `/api/admin/administrators/:id`             | Leader    | Chi tiết 1 admin                       |
| PATCH  | `/api/admin/administrators/:id/status`      | Leader    | Khóa hoặc mở khóa admin                |
| PUT    | `/api/admin/administrators/:id/permissions` | Leader    | Gán lại toàn bộ quyền cho admin        |

Leader mặc định có toàn quyền ở mọi chức năng. Admin thường chỉ vào được chức năng được gán (middleware `requirePermission`). `:id` là `Administrator.id`, không phải `Account.id`.

### GET /api/admin/me

```json
{
  "success": true,
  "data": {
    "isLeader": false,
    "permissions": ["QUAN_LY_TAI_KHOAN", "QUAN_LY_KHOA_HOC"]
  }
}
```

Leader nhận `isLeader: true` và danh sách tất cả chức năng đang hoạt động.

### GET /api/admin/system-functions

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "functionName": "QUAN_LY_MA_GIAM_GIA",
      "description": "Quản lý mã giảm giá",
      "status": "HOAT_DONG"
    }
  ]
}
```

Các `functionName` hiện có: `QUAN_LY_KHOA_HOC`, `QUAN_LY_TAI_KHOAN`, `QUAN_LY_MA_GIAM_GIA`, `QUAN_LY_BAI_THI`, `XU_LY_BAO_CAO_VI_PHAM`, `XU_LY_HOAN_TIEN`.

### GET /api/admin/administrators

Query: `page` (mặc định 1), `limit` (mặc định 10, tối đa 100), `search` (tìm theo họ tên hoặc email).

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "accountId": "uuid",
        "fullName": "Khang - Admin",
        "email": "admin@roadstudy.vn",
        "phoneNumber": null,
        "status": "HOAT_DONG",
        "createdAt": "2026-11-04T10:00:00.000Z",
        "isLeader": false,
        "permissions": [
          {
            "id": "uuid",
            "functionName": "QUAN_LY_KHOA_HOC",
            "description": "Quản lý khóa học",
            "status": "HOAT_DONG"
          }
        ]
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 2, "totalPages": 1 }
  }
}
```

### POST /api/admin/administrators

Body:

```json
{
  "fullName": "Nguyễn Văn A",
  "email": "a@roadstudy.vn",
  "password": "Password123!",
  "phoneNumber": "0901234567",
  "functionIds": ["uuid-chuc-nang"]
}
```

`phoneNumber` và `functionIds` không bắt buộc. Mật khẩu từ 8 đến 72 ký tự, có chữ hoa, chữ thường và chữ số. Thành công trả `201` với dữ liệu admin vừa tạo (cùng dạng một phần tử `items` ở trên). Tài khoản tạo xong có trạng thái `HOAT_DONG`, đăng nhập được ngay.

### GET /api/admin/administrators/:id

Trả về một admin, cùng dạng một phần tử `items` ở trên.

### PATCH /api/admin/administrators/:id/status

Body: `{ "status": "HOAT_DONG" }` hoặc `{ "status": "BI_KHOA" }`. Khóa admin sẽ thu hồi toàn bộ refresh token của admin đó. Trả về admin sau khi cập nhật.

### PUT /api/admin/administrators/:id/permissions

Body: `{ "functionIds": ["uuid1", "uuid2"] }`. Danh sách này **ghi đè** quyền cũ, gửi mảng rỗng để thu hồi hết quyền. Trả về admin sau khi cập nhật.

### Lỗi thường gặp

| Mã  | Khi nào                                                                                                                               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 400 | Dữ liệu sai (message dạng `tên_trường: lý do`), chức năng không tồn tại, đổi trạng thái hoặc gán quyền cho Leader, tự khóa chính mình |
| 401 | Thiếu token, token sai hoặc hết hạn                                                                                                   |
| 403 | Không phải ADMINISTRATOR, tài khoản bị khóa, hoặc không phải Leader ở endpoint chỉ dành cho Leader                                    |
| 404 | Không tìm thấy admin                                                                                                                  |
| 409 | Email đã tồn tại                                                                                                                      |

## 5. Các module khác

Người phụ trách điền khi API xong, theo đúng khuôn của mục Auth (quyền, body, response, lỗi, ghi chú).

- [x] Account / Student — Nam
- [x] Teacher — Nam
- [x] Admin, phân quyền — Nam
- [ ] Resource — Nam
- [ ] Report (báo cáo vi phạm) — Nam
- [x] Category — Huynh (cần điền)
- [x] Course — Huynh (cần điền)
- [x] Comment, Reply — Huynh (cần điền)
- [ ] Review, Review response — Huynh
- [x] Coupon (mã giảm giá) — Khang (cần điền)
- [ ] Exam, Question, AnswerOption — Khang
- [ ] Enrollment (đăng ký khóa học) — Khang
- [ ] Invoice, yêu cầu hoàn tiền — Khang
- [ ] Submission (làm bài thi) — Khang
- [ ] Chatbot, Recommendation — Khang
