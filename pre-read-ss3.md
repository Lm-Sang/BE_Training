# Pre-Read SS3 - API & HTTP cơ bản

## 1. Mục tiêu của bài học

Trong buổi học này, sinh viên sẽ hiểu rõ:

- API là gì và vì sao cần API
- HTTP và HTTPS khác nhau như thế nào
- Request và Response trong HTTP hoạt động như nào
- Các thành phần quan trọng của URL: params, query, body, header
- RESTful API là gì
- Cách xây dựng API theo chuẩn và cách tổ chức router trong Express

---

## 2. API là gì?

API (Application Programming Interface) là cách để các phần mềm giao tiếp và trao đổi dữ liệu với nhau.

Ví dụ đơn giản:

- Frontend gửi yêu cầu đến API
- Backend xử lý yêu cầu
- Backend truy vấn database
- Backend trả dữ liệu lại cho Frontend

### Ví dụ minh họa

Frontend muốn lấy danh sách người dùng:

1. Frontend gửi request đến Server/API
2. Backend nhận request
3. Backend query database
4. Database trả dữ liệu
5. Backend trả kết quả cho Frontend

### Tại sao cần API?

Khi một hệ thống có nhiều ứng dụng cùng sử dụng dữ liệu, API đóng vai trò là cầu nối:

- Website
- Mobile App
- Admin Dashboard
- Backend Service

Tất cả đều có thể giao tiếp thông qua cùng một API.

---

## 3. Các loại API phổ biến

Trong buổi này, chỉ giới thiệu sơ lược để sinh viên biết:

- REST API
- GraphQL
- gRPC
- Webhook

Tuy nhiên, trọng tâm của buổi học là: RESTful API.

---

## 4. HTTP / HTTPS

### 4.1 HTTP là gì?

HTTP (HyperText Transfer Protocol) là giao thức giúp Client và Server trao đổi dữ liệu với nhau.

Ví dụ:

- Client gửi yêu cầu tới Server
- Server xử lý
- Server trả về phản hồi

### 4.2 HTTPS là gì?

HTTPS = HTTP + TLS

HTTPS giúp mã hóa dữ liệu trên đường truyền giữa Client và Server.

### So sánh nhanh

| Loại  | Mã hóa dữ liệu | Port mặc định | Mức độ bảo mật |
| ----- | -------------- | ------------: | -------------- |
| HTTP  | Không          |            80 | Thấp hơn       |
| HTTPS | Có             |           443 | Cao hơn        |

Ví dụ:

- HTTP: http://example.com
- HTTPS: https://example.com

> Không cần đi sâu vào TLS ở buổi này, nhưng cần nhớ rằng HTTPS an toàn hơn HTTP.

---

## 5. HTTP Request và HTTP Response

### 5.1 HTTP Request

Client gửi request lên Server.

Ví dụ:

```http
POST /users/123?active=true HTTP/1.1
Host: example.com
Authorization: Bearer abc123
Content-Type: application/json

{
  "name": "Nguyen",
  "age": 20
}
```

Một request thường gồm các phần:

- Method
- URL
- Headers
- Body

### 5.2 HTTP Response

Server xử lý request và trả về response.

Ví dụ:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "name": "Nguyen",
  "age": 20
}
```

Một response thường gồm:

- Status Code
- Headers
- Body

---

## 6. HTTP Methods

HTTP Method cho Server biết Client muốn thực hiện hành động gì.

| Method | Ý nghĩa                   |
| ------ | ------------------------- |
| GET    | Lấy dữ liệu               |
| POST   | Tạo dữ liệu               |
| PUT    | Cập nhật/thay thế toàn bộ |
| PATCH  | Cập nhật một phần         |
| DELETE | Xóa dữ liệu               |

### Ví dụ với resource users

- GET /users → lấy danh sách người dùng
- POST /users → tạo người dùng mới
- GET /users/1 → lấy thông tin user có id = 1
- PUT /users/1 → cập nhật toàn bộ thông tin user 1
- PATCH /users/1 → cập nhật một phần thông tin user 1
- DELETE /users/1 → xóa user 1

### PUT vs PATCH

- PUT: cập nhật toàn bộ resource
- PATCH: cập nhật một phần resource

Ví dụ:

```json
{
  "name": "Nguyen",
  "age": 20,
  "email": "a@gmail.com"
}
```

Nếu chỉ muốn sửa tuổi:

```http
PATCH /users/1

{
  "age": 21
}
```

---

## 7. URL / Endpoint

### Ví dụ

```http
GET /users/123
```

Trong đó:

- GET: Method
- /users/123: Endpoint

Endpoint là địa chỉ mà Client gọi tới để sử dụng chức năng hoặc resource của API.

Ví dụ:

- /users
- /products
- /orders
- /users/123
- /products/10

---

## 8. Params, Query, Body, Header

Đây là phần rất quan trọng và cần thực hành nhiều.

### 8.1 Params

Params dùng để xác định một resource cụ thể.

Ví dụ:

```http
GET /users/123
```

Ở đây, 123 là params.

Trong Express:

```javascript
app.get("/users/:id", (req, res) => {
  console.log(req.params.id);
});
```

Kết quả:

```javascript
123;
```

Cách nhớ:

- Params = Tôi muốn thằng nào?

Ví dụ:

- /users/123
- /products/10
- /orders/999

### 8.2 Query

Query dùng để truyền điều kiện, thường là:

- Search
- Filter
- Sort
- Pagination

Ví dụ:

```http
GET /users?page=2&limit=10
```

Trong Express:

```javascript
req.query.page;
req.query.limit;
```

Ví dụ khác:

```http
GET /products?category=laptop
```

Cách nhớ:

- Query = Tôi muốn lấy theo điều kiện nào?

### 8.3 Body

Body dùng để gửi dữ liệu chính lên Server.

Ví dụ:

```http
POST /users
Content-Type: application/json

{
  "name": "Nguyen",
  "age": 20,
  "email": "nguyen@gmail.com"
}
```

Trong Express:

```javascript
req.body;
```

Cách nhớ:

- Body = Tôi muốn gửi dữ liệu gì?

### 8.4 Header

Header chứa thông tin bổ sung hoặc metadata của Request/Response.

Ví dụ:

```http
Content-Type: application/json
Authorization: Bearer abc123
```

Trong Express:

```javascript
req.headers;
```

Ví dụ:

```javascript
req.headers.authorization;
```

Cách nhớ:

- Header = thông tin đi kèm

### 8.5 Phân biệt nhanh

Ví dụ request sau:

```http
POST /users/123?active=true
Authorization: Bearer abc123
Content-Type: application/json

{
  "name": "Nguyen",
  "age": 20
}
```

Phân tích:

- POST → Method
- /users/123 → Path
- 123 → Params
- active=true → Query
- Authorization → Header
- Content-Type → Header
- name, age → Body

### Bảng ghi nhớ nhanh

| Thành phần | Dùng để                      |
| ---------- | ---------------------------- |
| Params     | Xác định resource            |
| Query      | Filter, search, pagination   |
| Body       | Dữ liệu gửi lên              |
| Header     | Metadata / thông tin bổ sung |

---

## 9. HTTP Status Code

Status code cho biết kết quả của request.

### 2xx - Thành công

- 200 OK
- 201 Created
- 204 No Content

Ví dụ:

- GET thành công → 200
- POST tạo thành công → 201
- DELETE thành công → 204

### 4xx - Client gửi request có vấn đề

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict

Ví dụ:

- Dữ liệu không hợp lệ → 400
- Chưa đăng nhập → 401
- Không có quyền → 403
- Không tìm thấy user → 404
- Email đã tồn tại → 409

### 5xx - Server có vấn đề

- 500 Internal Server Error

Ví dụ:

- Database lỗi
- Server không xử lý được request

> Không cần học thuộc hết tất cả mã lỗi. Chỉ cần nắm các mã quan trọng thường gặp.

---

## 10. RESTful API

REST là một kiến trúc/phong cách thiết kế API.

Tư duy cơ bản của REST:

- Resource
- HTTP Method

### Ví dụ resource: users

| Method | Endpoint   | Ý nghĩa            |
| ------ | ---------- | ------------------ |
| GET    | /users     | Lấy danh sách user |
| GET    | /users/:id | Lấy một user       |
| POST   | /users     | Tạo user           |
| PUT    | /users/:id | Cập nhật user      |
| PATCH  | /users/:id | Cập nhật một phần  |
| DELETE | /users/:id | Xóa user           |

### RESTful vs thiết kế không theo REST

#### Thiết kế không tốt

- GET /getUsers
- GET /getUserById
- POST /createUser
- POST /updateUser
- POST /deleteUser

#### Thiết kế RESTful

- GET /users
- GET /users/:id
- POST /users
- PUT /users/:id
- DELETE /users/:id

### Mục tiêu của RESTful

Nhìn vào Method và Endpoint, ta có thể biết API đang làm gì.

---

## 11. Response Convention

Nếu mỗi API trả về kiểu dữ liệu khác nhau, Frontend sẽ rất khó xử lý.

Ví dụ không thống nhất:

```json
{
  "name": "Nguyen"
}
```

```json
{
  "result": {}
}
```

```json
{
  "message": "Success"
}
```

Điều này khiến hệ thống khó maintain.

### Quy chuẩn response nên thống nhất

#### Success

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Nguyen"
  },
  "message": "Get user successfully"
}
```

#### Error

```json
{
  "success": false,
  "data": null,
  "message": "User not found"
}
```

### Mục tiêu

Các API trong cùng một hệ thống nên có response format thống nhất để dễ xử lý và bảo trì.

---

## 12. Router trong Express

Nếu viết tất cả route trong một file index.js thì file sẽ dài và khó quản lý.

### Cách viết không dùng router

```javascript
app.get("/users", ...);
app.get("/users/:id", ...);
app.post("/users", ...);
app.get("/products", ...);
app.get("/products/:id", ...);
app.post("/products", ...);
```

Với project lớn, file index.js sẽ trở nên rất dài.

### Cách dùng Router

#### user.route.js

```javascript
const router = express.Router();

router.get("/", ...);
router.get("/:id", ...);
router.post("/", ...);

export default router;
```

#### index.js

```javascript
app.use("/users", userRouter);
```

Kết quả:

- GET /users
- GET /users/:id
- POST /users

### Ý nghĩa của Router

Router giúp chia API thành từng nhóm theo chức năng, giúp code dễ quản lý hơn.

---

## 13. Ghi nhớ quan trọng trước buổi học

1. API là cầu nối giữa Frontend và Backend.
2. HTTP là giao thức để Client và Server trao đổi dữ liệu.
3. HTTPS là HTTP có mã hóa TLS.
4. Request có Method, URL, Headers, Body.
5. Response có Status Code, Headers, Body.
6. Params, Query, Body, Header có chức năng khác nhau.
7. RESTful API dựa trên Resource + HTTP Method.
8. Response nên có format thống nhất.
9. Router giúp chia API theo nhóm, dễ quản lý hơn.

---

## 14. Câu hỏi gợi ý để ôn tập

- API là gì và vì sao cần API?
- HTTP khác HTTPS ở điểm nào?
- Method GET, POST, PUT, PATCH, DELETE khác nhau như thế nào?
- Params, Query, Body, Header khác nhau như thế nào?
- Endpoint là gì?
- RESTful API là gì?
- Tại sao cần có response format thống nhất?
- Router trong Express giúp gì?

---

## 15. Kết luận

Buổi học này là nền tảng cho các buổi sau về Express, CRUD API, routing, validation, authentication và database.

Nếu nắm chắc API, HTTP và RESTful, sinh viên sẽ dễ dàng tiếp cận các kiến thức Node.js backend sau này.
