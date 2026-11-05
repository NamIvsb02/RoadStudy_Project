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
  "account": {
    "id": "",
    "fullName": "",
    "email": "",
    "phoneNumber": null,
    "avatarUrl": null,
    "role": "STUDENT",
    "status": "HOAT_DONG",
    "createdAt": ""
  }
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
  "account": {
    "id": "",
    "fullName": "",
    "email": "",
    "phoneNumber": null,
    "avatarUrl": null,
    "status": "HOAT_DONG",
    "createdAt": ""
  }
}
```

- Lỗi: 400 `approvalStatus không hợp lệ`

### PATCH /teacher/:id/approval

- Quyền: ADMINISTRATOR
- Body: `{ "approvalStatus": "DA_DUYET" | "TU_CHOI" }`
- 200: message `Đã duyệt giáo viên` hoặc `Đã từ chối giáo viên`

```json
{
  "id": "",
  "approvalStatus": "DA_DUYET",
  "account": { "id": "", "fullName": "", "email": "" }
}
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

## Coupon (`/api/coupon`) — Khang

Mã giảm giá. Mỗi mã chỉ giảm theo **một** trong hai kiểu: số tiền (`discountAmount`) hoặc phần trăm (`discountPercentage`).
Quản lý mã (xem, tạo, sửa, đổi trạng thái, xóa) chỉ dành cho admin có quyền `QUAN_LY_MA_GIAM_GIA` (Leader mặc định có; admin thường chưa được cấp quyền sẽ nhận 403 `Không đủ quyền truy cập`). Giáo viên không quản lý được mã giảm giá. Học viên dùng `POST /coupon/validate` để xem trước giá khi nhập mã.

Quy tắc áp mã:

- Mỗi hóa đơn chỉ áp 1 mã, không cộng dồn.
- Mỗi học viên dùng mỗi mã tối đa 1 lần. Hóa đơn `THAT_BAI` và `DA_HUY` không tính là đã dùng; hóa đơn `HOAN_TIEN` vẫn tính là đã dùng.
- Không giới hạn theo khóa học.
- `usedCount` tăng khi Đăng ký + Hóa đơn được tạo (cùng một transaction), **không** tăng ở `validate`.

Đối tượng mã giảm giá (`DiscountCode`):

| Trường             | Kiểu           | Ghi chú                                                            |
| ------------------ | -------------- | ------------------------------------------------------------------ |
| id                 | string         |                                                                    |
| code               | string         | Luôn viết hoa                                                      |
| discountAmount     | string \| null | Số tiền giảm (Decimal dạng chuỗi). `null` nếu giảm theo phần trăm  |
| discountPercentage | string \| null | Phần trăm giảm, lớn hơn 0 và tối đa 100. `null` nếu giảm theo tiền |
| startDate          | string         | ISO 8601                                                           |
| endDate            | string         | ISO 8601                                                           |
| usageLimit         | number         | Số lượt dùng tối đa                                                |
| usedCount          | number         | Số lượt đã dùng                                                    |
| status             | string         | `HOAT_DONG`, `TAM_NGUNG`, `HET_HAN`                                |

Ghi chú chung: Decimal có thể không có phần thập phân thừa (ví dụ `"50000"`, `"10"`), FE nên đổi bằng `Number(...)` khi tính toán.

### GET /coupon

- Quyền: admin có quyền `QUAN_LY_MA_GIAM_GIA`
- Query: `page`, `limit`, `status` (`HOAT_DONG` | `TAM_NGUNG` | `HET_HAN`, không bắt buộc), `q` (tìm theo mã, không phân biệt hoa thường, không bắt buộc)
- 200: message `Lấy danh sách mã giảm giá thành công`, `data: { items: [DiscountCode], pagination }`. Sắp xếp theo `startDate` mới nhất trước.

### GET /coupon/:id

- Quyền: admin có quyền `QUAN_LY_MA_GIAM_GIA`
- 200: message `Lấy mã giảm giá thành công`, `data` là `DiscountCode`
- Lỗi: 404 `Mã giảm giá không tồn tại`

### POST /coupon

- Quyền: admin có quyền `QUAN_LY_MA_GIAM_GIA`
- Body:

| Trường             | Kiểu   | Bắt buộc | Ghi chú                                                                |
| ------------------ | ------ | -------- | ---------------------------------------------------------------------- |
| code               | string | có       | 3 đến 50 ký tự, chỉ gồm chữ, số, `-`, `_`. Server tự đổi sang viết hoa |
| discountAmount     | number | có\*     | Lớn hơn 0                                                              |
| discountPercentage | number | có\*     | Lớn hơn 0 và tối đa 100                                                |
| startDate          | string | có       | ISO 8601, ví dụ `"2026-11-01T00:00:00Z"`                               |
| endDate            | string | có       | Phải sau `startDate`                                                   |
| usageLimit         | number | có       | Số nguyên từ 1 trở lên                                                 |
| status             | string | không    | `HOAT_DONG` (mặc định) hoặc `TAM_NGUNG`                                |

\* Phải gửi **đúng một** trong `discountAmount` hoặc `discountPercentage`.

- 201: message `Tạo mã giảm giá thành công`, `data` là `DiscountCode` (`usedCount` bằng 0)
- Lỗi: 400 validate | 400 `Chỉ được nhập một trong hai: số tiền giảm hoặc phần trăm giảm` | 400 `Ngày kết thúc phải sau ngày bắt đầu` | 409 `Mã giảm giá đã tồn tại`
- Ghi chú: không được gửi `usedCount` (hoặc trường nào ngoài bảng trên), server trả 400 `: Không được gửi các trường: usedCount`.

### PUT /coupon/:id

- Quyền: admin có quyền `QUAN_LY_MA_GIAM_GIA`
- Body: một hay nhiều trường như `POST /coupon` (tất cả không bắt buộc)
- 200: message `Cập nhật mã giảm giá thành công`, `data` là `DiscountCode` sau khi sửa
- Lỗi: 400 validate | 400 `Số lượt tối đa không được nhỏ hơn số lượt đã dùng (n)` | 400 `Chỉ được nhập một trong hai...` | 404 `Mã giảm giá không tồn tại` | 409 `Mã giảm giá đã tồn tại` | 409 `Mã đã được sử dụng, không thể đổi mã`
- Ghi chú: gửi `discountAmount` thì `discountPercentage` tự về `null` và ngược lại.

### PATCH /coupon/:id/status

- Quyền: admin có quyền `QUAN_LY_MA_GIAM_GIA`
- Body: `{ "status": "HOAT_DONG" | "TAM_NGUNG" }`
- 200: message `Cập nhật trạng thái mã giảm giá thành công`, `data` là `DiscountCode`
- Lỗi: 400 trạng thái không hợp lệ | 404 `Mã giảm giá không tồn tại`
- Ghi chú: không đặt được `HET_HAN` bằng API này. Mã quá hạn vẫn bị từ chối ở `validate` dựa vào `endDate`.

### DELETE /coupon/:id

- Quyền: admin có quyền `QUAN_LY_MA_GIAM_GIA`
- 200: `data: null`, message `Xóa mã giảm giá thành công`
- Lỗi: 404 `Mã giảm giá không tồn tại` | 409 `Mã đã được sử dụng, chỉ có thể tạm ngưng, không thể xóa`
- Ghi chú: mã đã có lượt dùng hoặc đã gắn hóa đơn thì chỉ tạm ngưng (`PATCH .../status`).

### POST /coupon/validate

- Quyền: `STUDENT`, `ADMINISTRATOR`
- Body:

| Trường   | Kiểu   | Bắt buộc | Ghi chú                                                         |
| -------- | ------ | -------- | --------------------------------------------------------------- |
| code     | string | có       | Không phân biệt hoa thường                                      |
| courseId | string | không    | Có thì trả thêm giá gốc, số tiền giảm và tổng phải trả của khóa |

- 200: message `Mã giảm giá hợp lệ`

```json
{
  "discountCodeId": "...",
  "code": "GIAM10",
  "discountType": "PERCENTAGE",
  "discountValue": "10",
  "subtotal": "1000000.00",
  "discountAmountApplied": "100000.00",
  "totalAmount": "900000.00"
}
```

- `discountType`: `PERCENTAGE` hoặc `AMOUNT`. Ba trường `subtotal`, `discountAmountApplied`, `totalAmount` chỉ có khi gửi `courseId` (luôn dạng chuỗi có 2 chữ số thập phân). Số tiền giảm không vượt giá gốc, tổng phải trả không âm.
- Lỗi: 400 `Mã giảm giá đang tạm ngưng hoặc đã hết hạn` | 400 `Mã giảm giá chưa có hiệu lực` | 400 `Mã giảm giá đã hết hạn` | 400 `Mã giảm giá đã hết lượt sử dụng` | 400 `Bạn đã sử dụng mã giảm giá này rồi` | 404 `Mã giảm giá không tồn tại` | 404 `Khóa học không tồn tại`
- Ghi chú: API chỉ **xem trước giá**, không tăng `usedCount`. Khi thanh toán thật, gửi mã kèm yêu cầu đăng ký, server kiểm tra lại. Kiểm tra "đã dùng rồi" chỉ áp dụng khi tài khoản là học viên.

---

## Exam (`/api/exam`) — Khang

Đề thi thuộc một khóa học, gồm câu hỏi và đáp án (trắc nghiệm, mỗi câu có đúng một đáp án đúng). Giáo viên tạo đề cho khóa mình phụ trách (giáo viên phải ở trạng thái `DA_DUYET`), admin quản lý mọi khóa.

Luồng trạng thái đề (`ExamStatus`):

| Từ             | Sang           | Ai làm được                | Điều kiện                                               |
| -------------- | -------------- | -------------------------- | ------------------------------------------------------- |
| `BAN_NHAP`     | `DA_PHE_DUYET` | Chỉ admin (cần quyền)      | Có ít nhất 1 câu hỏi; điểm đạt không vượt tổng điểm     |
| `DA_PHE_DUYET` | `DANG_MO`      | `TEACHER`, `ADMINISTRATOR` |                                                         |
| `DANG_MO`      | `TAM_NGUNG`    | `TEACHER`, `ADMINISTRATOR` |                                                         |
| `TAM_NGUNG`    | `DANG_MO`      | `TEACHER`, `ADMINISTRATOR` |                                                         |
| `TAM_NGUNG`    | `BAN_NHAP`     | `TEACHER`, `ADMINISTRATOR` | Đề chưa có bài làm nào (để sửa lại, rồi phải duyệt lại) |

Quy tắc chung:

- Admin cần quyền `QUAN_LY_BAI_THI` (Leader mặc định có) để xem và quản lý đề; thiếu quyền thì 403.
- Học viên chỉ thấy đề `DANG_MO` của khóa mình đã đăng ký và **đã thanh toán** (`DA_THANH_TOAN`).
- Câu hỏi, đáp án và điểm chỉ sửa được khi đề ở `BAN_NHAP` **và** chưa có bài làm.
- Đề đã có bài làm: không xóa, không đổi thời gian làm bài, không chuyển về nháp.
- Tổng điểm đề = tổng điểm các câu hỏi. `passingScore` không được lớn hơn tổng điểm.
- Mỗi học viên làm tối đa **3 lần** mỗi đề.

Đối tượng đề thi (giáo viên/admin xem, `Exam`):

```json
{
  "id": "",
  "examName": "",
  "durationMinutes": 30,
  "passingScore": "5",
  "status": "BAN_NHAP",
  "createdAt": "",
  "courseId": "",
  "totalScore": "10.00",
  "_count": { "attempts": 0 },
  "questions": [
    {
      "id": "",
      "content": "",
      "score": "4",
      "questionOrder": 1,
      "examId": "",
      "options": [
        { "id": "", "content": "", "isCorrect": true, "questionId": "" }
      ]
    }
  ]
}
```

`_count.attempts` là số bài làm của đề. Học viên **không bao giờ** nhận `isCorrect`.

### GET /exam/course/:courseId

- Quyền: `STUDENT`, `TEACHER`, admin có quyền `QUAN_LY_BAI_THI`
- Query: `page`, `limit`, `status` (chỉ giáo viên/admin dùng để lọc theo `ExamStatus`)
- 200: message `Lấy danh sách đề thi thành công`, `data: { items, pagination }`
  - Học viên: chỉ đề `DANG_MO`. Mỗi phần tử: `id, examName, durationMinutes, passingScore, status, createdAt, courseId, questionCount, attemptsUsed, maxAttempts` (`maxAttempts` = 3).
  - Giáo viên/admin: mọi trạng thái. Mỗi phần tử có các trường trên của đề (không có câu hỏi) cùng `questionCount` và `attemptCount`.
- Lỗi: 403 `Tài khoản không phải học viên` | 403 `Bạn cần được xác nhận đăng ký khóa học để xem đề thi` | 403 `Bạn không phụ trách khóa học này` | 404 `Khóa học không tồn tại`

### GET /exam/:id

- Quyền: `STUDENT`, `TEACHER`, admin có quyền `QUAN_LY_BAI_THI`
- 200: message `Lấy đề thi thành công`
  - Học viên: `{ id, examName, durationMinutes, passingScore, status, courseId, questionCount, attemptsUsed, maxAttempts }`. **Không có câu hỏi**; câu hỏi chỉ được gửi khi bắt đầu làm bài (`POST /submission/start`).
  - Giáo viên (khóa mình phụ trách)/admin: `Exam` đầy đủ, có `isCorrect`.
- Lỗi: 403 như trên | 404 `Đề thi không tồn tại` | 404 `Đề thi không tồn tại hoặc chưa mở` (học viên xem đề không ở trạng thái `DANG_MO`)

### POST /exam

- Quyền: `TEACHER` (khóa mình phụ trách), admin có quyền `QUAN_LY_BAI_THI`
- Body:

| Trường          | Kiểu   | Bắt buộc | Ghi chú                               |
| --------------- | ------ | -------- | ------------------------------------- |
| courseId        | string | có       |                                       |
| examName        | string | có       | 1 đến 200 ký tự                       |
| durationMinutes | number | có       | Số nguyên từ 1 đến 1440               |
| passingScore    | number | có       | 0 đến 999.99                          |
| questions       | array  | có       | 1 đến 200 câu hỏi (cấu trúc bên dưới) |

Mỗi phần tử của `questions`:

| Trường        | Kiểu   | Bắt buộc | Ghi chú                                                                   |
| ------------- | ------ | -------- | ------------------------------------------------------------------------- |
| content       | string | có       | 1 đến 5000 ký tự                                                          |
| score         | number | có       | 0 đến 999.99                                                              |
| questionOrder | number | không    | Số nguyên từ 1. Bỏ trống thì lấy theo thứ tự trong mảng, không được trùng |
| options       | array  | có       | 2 đến 10 đáp án, **đúng một** đáp án có `isCorrect = true`                |

Mỗi phần tử của `options`: `{ "content": string (1 đến 2000 ký tự), "isCorrect": boolean }`.

- 201: message `Tạo đề thi thành công`, `data` là `Exam` đầy đủ (`status: "BAN_NHAP"`)
- Lỗi: 400 validate (ví dụ `questions.0.options: Mỗi câu hỏi phải có đúng một đáp án đúng`) | 400 `Điểm đạt không được lớn hơn tổng điểm các câu hỏi` | 400 `Thứ tự câu hỏi (questionOrder) bị trùng` | 403 `Bạn không phụ trách khóa học này` | 404 `Khóa học không tồn tại`

### PUT /exam/:id

- Quyền: `TEACHER` (khóa mình phụ trách), admin có quyền `QUAN_LY_BAI_THI`
- Body: một hay nhiều trường `examName`, `durationMinutes`, `passingScore` (như trên, phải gửi ít nhất một trường)
- 200: message `Cập nhật đề thi thành công`, `data` là `Exam` đầy đủ
- Lỗi: 400 `Cần gửi ít nhất một trường để cập nhật` | 400 `Điểm đạt không được lớn hơn tổng điểm các câu hỏi` | 403 | 404 `Đề thi không tồn tại` | 409 `Đề thi đã có bài làm, không thể đổi thời gian làm bài`
- Ghi chú: đề đã có bài làm vẫn đổi được `examName` và `passingScore`.

### PATCH /exam/:id/status

- Quyền: `TEACHER` (khóa mình phụ trách), admin có quyền `QUAN_LY_BAI_THI` (xem bảng luồng trạng thái ở trên)
- Body: `{ "status": "BAN_NHAP" | "DA_PHE_DUYET" | "DANG_MO" | "TAM_NGUNG" }`
- 200: message `Cập nhật trạng thái đề thi thành công`, `data` là `Exam` đầy đủ
- Lỗi: 400 `Không thể chuyển đề thi từ X sang Y` | 400 `Đề thi phải có ít nhất một câu hỏi` | 400 `Điểm đạt không được lớn hơn tổng điểm các câu hỏi` | 403 `Chỉ quản trị viên mới được phê duyệt đề thi` | 404 | 409 `Đề thi đã có bài làm, không thể chuyển về nháp`

### DELETE /exam/:id

- Quyền: `TEACHER` (khóa mình phụ trách), admin có quyền `QUAN_LY_BAI_THI`
- 200: `data: null`, message `Xóa đề thi thành công`
- Lỗi: 403 | 404 `Đề thi không tồn tại` | 409 `Đề thi đã có bài làm, chỉ có thể tạm ngưng, không thể xóa`

### POST /exam/:id/questions

- Quyền: `TEACHER` (khóa mình phụ trách), admin có quyền `QUAN_LY_BAI_THI`
- Body: như một phần tử của `questions` ở `POST /exam` (`questionOrder` bỏ trống thì lấy sau câu cuối cùng)
- 201: message `Thêm câu hỏi thành công`, `data` là câu hỏi kèm `options`
- Lỗi: 400 validate | 403 | 404 `Đề thi không tồn tại` | 409 `Đã có câu hỏi ở vị trí n` | 409 `Chỉ sửa được câu hỏi khi đề ở trạng thái nháp (BAN_NHAP)` | 409 `Đề thi đã có bài làm, không thể sửa câu hỏi, đáp án hoặc điểm`

### PUT /exam/questions/:questionId

- Quyền: `TEACHER` (khóa mình phụ trách), admin có quyền `QUAN_LY_BAI_THI`
- Body: một hay nhiều trường `content`, `score`, `questionOrder`, `options` (phải gửi ít nhất một trường)
- 200: message `Cập nhật câu hỏi thành công`, `data` là câu hỏi kèm `options`
- Lỗi: 400 validate | 403 | 404 `Câu hỏi không tồn tại` | 409 (như trên)
- Ghi chú: gửi `options` thì **thay thế toàn bộ** đáp án cũ bằng danh sách mới (vẫn phải có đúng một đáp án đúng). Không có API sửa riêng từng đáp án.

### DELETE /exam/questions/:questionId

- Quyền: `TEACHER` (khóa mình phụ trách), admin có quyền `QUAN_LY_BAI_THI`
- 200: `data: null`, message `Xóa câu hỏi thành công`
- Lỗi: 403 | 404 `Câu hỏi không tồn tại` | 409 (như trên)

---

## Submission, làm bài thi (`/api/submission`) — Khang

Bài làm của học viên (`ExamAttempt`). Server chấm điểm, kiểm tra thời gian, không trả đáp án đúng cho học viên.

Luồng cho FE:

1. `GET /exam/course/:courseId` lấy danh sách đề, kiểm tra `attemptsUsed < maxAttempts`.
2. `POST /submission/start` nhận câu hỏi và `deadline` / `remainingSeconds`. Bật đồng hồ đếm ngược theo `remainingSeconds` của server.
3. Mỗi khi học viên chọn đáp án: `PUT /submission/:id/answers` (lưu liên tục để không mất bài khi mất mạng).
4. `POST /submission/:id/submit` để nộp, nhận điểm ngay (`status: "DA_CHAM"`).
5. Hết giờ mà chưa nộp: server tự nộp với đáp án đã lưu. FE vẫn nên gọi `submit` khi đồng hồ về 0.
6. Học viên đóng trình duyệt rồi quay lại: gọi `POST /submission/start` lần nữa để **làm tiếp** bài đang làm (không tính thêm lượt).

Quy tắc:

- Mỗi học viên tối đa 3 lần mỗi đề (không tính bài `HUY`); mỗi lần chỉ có 1 bài `DANG_LAM`.
- Chỉ làm được đề `DANG_MO` của khóa đã `DA_THANH_TOAN`.
- Thời gian làm bài = `exam.durationMinutes` tính từ `startTime`, cho phép trễ tối đa 10 giây do mạng.
- Học viên xem kết quả chỉ thấy đáp án **đã chọn**, không thấy đáp án đúng.

Đối tượng bài làm (`Attempt`):

| Trường           | Kiểu            | Ghi chú                                                           |
| ---------------- | --------------- | ----------------------------------------------------------------- |
| id               | string          |                                                                   |
| examId           | string          |                                                                   |
| examName         | string          |                                                                   |
| status           | string          | `DANG_LAM`, `DA_NOP`, `DA_CHAM`, `HUY`                            |
| startTime        | string          | ISO 8601                                                          |
| endTime          | string \| null  | `null` khi đang làm                                               |
| deadline         | string          | Hạn nộp bài                                                       |
| score            | string \| null  | Điểm, `null` khi chưa chấm. Dạng chuỗi 2 chữ số thập phân         |
| passingScore     | string          | Điểm đạt                                                          |
| passed           | boolean \| null | `null` khi chưa chấm                                              |
| totalScore       | string          | Tổng điểm đề. Chỉ có ở kết quả (`submit`, `GET /:id` khi đã chấm) |
| remainingSeconds | number          | Số giây còn lại. Chỉ có khi `DANG_LAM`                            |

### POST /submission/start

- Quyền: `STUDENT`
- Body: `{ "examId": string }`
- 200: message `Bắt đầu làm bài thành công`

```json
{
  "attempt": {
    "id": "",
    "status": "DANG_LAM",
    "startTime": "",
    "deadline": "",
    "remainingSeconds": 1800,
    "score": null,
    "passed": null
  },
  "exam": { "id": "", "examName": "", "durationMinutes": 30 },
  "questions": [
    {
      "id": "",
      "content": "",
      "score": "4",
      "questionOrder": 1,
      "options": [{ "id": "", "content": "" }]
    }
  ],
  "answers": [{ "questionId": "", "answerOptionId": "" }]
}
```

- `answers` là các đáp án đã lưu (rỗng nếu bài mới, có dữ liệu nếu đang làm tiếp). `questions` sắp theo `questionOrder`, không có `isCorrect`.
- Lỗi: 400 `Bạn đã làm đủ 3 lần cho đề thi này` | 403 `Chỉ học viên mới được làm bài thi` | 403 `Bạn cần được xác nhận đăng ký khóa học để làm bài thi` | 404 `Đề thi không tồn tại hoặc chưa mở`

### PUT /submission/:id/answers

- Quyền: `STUDENT` (chủ bài làm)
- Body: `{ "answers": [ { "questionId": string, "answerOptionId": string | null } ] }` (1 đến 500 phần tử)
- 200: message `Lưu đáp án thành công`, `data: { "saved": 2, "remainingSeconds": 1750 }`
- Lỗi: 400 `Bài làm đã kết thúc, không thể thay đổi đáp án` | 400 `Đã hết thời gian làm bài, hệ thống đã tự động nộp bài` | 400 `Câu hỏi không thuộc đề thi này` | 400 `Đáp án không thuộc câu hỏi đã chọn` | 404 `Bài làm không tồn tại`
- Ghi chú: `answerOptionId = null` nghĩa là bỏ chọn câu đó. Gửi cùng một câu nhiều lần thì lấy lần cuối. Khi gặp lỗi hết giờ, bài đã được nộp: FE gọi `GET /submission/:id` để lấy kết quả.

### POST /submission/:id/submit

- Quyền: `STUDENT` (chủ bài làm)
- Body (không bắt buộc): `{ "answers": [ ... ] }` giống `PUT /answers`, dùng để gửi kèm các đáp án cuối cùng. Có thể không gửi body.
- 200: message `Nộp bài thành công`, `data` là `Attempt` đã chấm kèm `totalScore` và `autoSubmitted`

```json
{
  "id": "",
  "examId": "",
  "examName": "",
  "status": "DA_CHAM",
  "startTime": "",
  "endTime": "",
  "deadline": "",
  "score": "7.00",
  "totalScore": "10.00",
  "passingScore": "5.00",
  "passed": true,
  "autoSubmitted": false
}
```

- Lỗi: 400 (đáp án không hợp lệ, như trên) | 404 `Bài làm không tồn tại` | 409 `Bài làm đã được nộp trước đó`
- Ghi chú: nếu nộp sau hạn thì vẫn trả 200 với `autoSubmitted: true`, và chỉ chấm theo đáp án đã lưu trước đó (đáp án gửi kèm bị bỏ qua).

### GET /submission/me

- Quyền: `STUDENT`
- Query: `page`, `limit`, `examId` (không bắt buộc, lọc theo đề)
- 200: message `Lấy lịch sử làm bài thành công`, `data: { items: [Attempt], pagination }`. Mới nhất trước.

### GET /submission/:id

- Quyền: `STUDENT` (chỉ bài của mình), `TEACHER` (khóa mình phụ trách), admin có quyền `QUAN_LY_BAI_THI`
- 200: message `Lấy kết quả bài làm thành công`
  - Học viên, bài đang làm: `Attempt` + `answers: [{ questionId, answerOptionId }]`.
  - Học viên, bài đã chấm: `Attempt` (có `totalScore`) + `questions`:

```json
{
  "questionId": "",
  "content": "",
  "score": "4",
  "questionOrder": 1,
  "selectedAnswerOptionId": "",
  "options": [{ "id": "", "content": "" }]
}
```

- Giáo viên/admin: `Attempt` + `questions`, mỗi câu thêm `isCorrect` (học viên làm đúng hay không), `earnedScore`, và `options[].isCorrect`.
- Lỗi: 403 `Bạn không phụ trách khóa học này` | 404 `Bài làm không tồn tại` (cũng trả khi học viên xem bài của người khác)
- Ghi chú: bài `DANG_LAM` đã quá hạn sẽ được tự nộp và chấm ngay khi gọi API này.

### GET /submission/exam/:examId

- Quyền: `TEACHER` (khóa mình phụ trách), admin có quyền `QUAN_LY_BAI_THI`
- Query: `page`, `limit`, `status` (`DANG_LAM` | `DA_NOP` | `DA_CHAM` | `HUY`, không bắt buộc)
- 200: message `Lấy danh sách bài làm thành công`, `data: { items, pagination }`. Mỗi phần tử là `Attempt` kèm `student: { id, account: { fullName, email } }`.
- Lỗi: 403 `Bạn không phụ trách khóa học này` | 404 `Đề thi không tồn tại`

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
- [x] Coupon (mã giảm giá) — Khang
- [x] Exam, Question, AnswerOption — Khang
- [ ] Enrollment (đăng ký khóa học) — Khang
- [ ] Invoice, yêu cầu hoàn tiền — Khang
- [x] Submission (làm bài thi) — Khang
- [ ] Chatbot, Recommendation — Khang
