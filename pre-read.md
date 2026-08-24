# 📘 Buổi 3 — Kiến trúc Phân tầng (Layered Architecture) & Middleware trong Express

---

## 🎯 Mục tiêu buổi này

Sau khi đọc tài liệu và tham gia buổi học, bạn sẽ:
- Hiểu rõ **bản chất và lý do** phải chia code thành các tầng: `Route` ➔ `Controller` ➔ `Service`.
- Nắm vững cơ chế hoạt động của **Middleware** và hàm `next()`.
- Biết cách dùng **Morgan** để ghi log mọi request gửi lên server.
- Tự tay viết được **Error Handler Middleware** tập trung để chuẩn hóa format lỗi cho toàn bộ API, tránh app bị crash.

---

## 1. Bức tranh tổng thể: Vòng đời của một HTTP Request

Khi một ứng dụng Backend lớn dần, nếu bạn nhồi nhét tất cả code (từ định tuyến URL, đọc dữ liệu, kiểm tra quyền, tính toán nghiệp vụ, query DB) vào chung một file `index.js`, dự án sẽ biến thành một "đống rác" không thể bảo trì hay mở rộng.

Kiến trúc phân tầng sinh ra để mỗi file chỉ làm **đúng một việc duy nhất** (Single Responsibility Principle).

### Sơ đồ luồng đi của 1 Request (Request Lifecycle):

```
Client (Postman / Web / App)
         │
         │ HTTP Request (Ví dụ: POST /api/users)
         ▼
┌───────────────────────────────────────────────────────────┐
│ 1. GLOBAL MIDDLEWARES                                     │
│    - express.json() (Parse body sang JSON)                │
│    - morgan (Ghi log request ra terminal)                 │
│    - cors (Cho phép client gọi API)                       │
└────────────────────────────┬──────────────────────────────┘
                             ▼
┌───────────────────────────────────────────────────────────┐
│ 2. ROUTE (routes/user.route.js)                           │
│    - Định tuyến: "Method POST + Path /api/users đi đâu?"   │
│    - Gắn Route-level middleware (Auth, Validate, CheckRole)│
└────────────────────────────┬──────────────────────────────┘
                             ▼
┌───────────────────────────────────────────────────────────┐
│ 3. CONTROLLER (controllers/user.controller.js)            │
│    - Chỉ làm việc với giao thức HTTP                      │
│    - Nhận: req.body, req.params, req.query                │
│    - Gọi Service tương ứng để xử lý                       │
│    - Trả: res.status(200).json(...)                       │
└────────────────────────────┬──────────────────────────────┘
                             ▼
┌───────────────────────────────────────────────────────────┐
│ 4. SERVICE (services/user.service.js)                     │
│    - "Bộ não" nghiệp vụ (Business Logic)                  │
│    - Tính toán, kiểm tra email trùng, hash password...     │
│    - Gọi Repository / Database (Sau này ở các buổi DB)   │
│    - Ném lỗi (throw Error) nếu dữ liệu không hợp lệ       │
└────────────────────────────┬──────────────────────────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
      [Thành công]                        [Có lỗi xảy ra]
   Controller trả response             next(error) chuyển sang
   res.status(200).json(...)           5. ERROR MIDDLEWARE
                                       Xử lý & trả lỗi tập trung
```

---

## 2. Middleware — "Trạm thu phí" trên cao tốc Request

### 2.1. Middleware là gì?
Hãy tưởng tượng Request từ Client gửi lên Server giống như một chiếc xe chạy trên đường cao tốc đến trạm đích (Controller). 

**Middleware** chính là các **trạm thu phí hoặc trạm kiểm định** nằm chắn ngang đường. Mỗi chiếc xe đi qua đều phải dừng lại để trạm:
- Kiểm tra giấy tờ (Authentication: đã đăng nhập chưa?).
- Kiểm tra tải trọng / hàng cấm (Validation: gửi dữ liệu lên đúng format không?).
- Ghi lại biển số xe (Logging: log xem ai vừa ghé thăm lúc mấy giờ).

### 2.2. Cấu trúc của một Middleware
Trong Express, Middleware chỉ đơn giản là một function nhận vào **3 tham số**: `(req, res, next)`.

```javascript
const myMiddleware = (req, res, next) => {
  // 1. Làm việc gì đó với req hoặc res
  console.log(`[LOG] Có request gửi đến: ${req.method} ${req.url}`);

  // 2. Quyết định số phận của request:
  if (/* Không đủ điều kiện */ false) {
    // Chặn lại và đuổi về ngay tại trạm thu phí
    return res.status(403).json({ message: 'Không có quyền truy cập!' });
  }

  // 3. Cho phép xe chạy tiếp sang trạm/middleware tiếp theo
  next();
};
```

> ⚠️ **Quy tắc sống còn:** Một Middleware **bắt buộc** phải làm 1 trong 2 việc:
> 1. Trả về response kết thúc request (`res.json(...)`, `res.send(...)`).
> 2. HOẶC gọi hàm `next()` để chuyển giao quyền cho thằng tiếp theo.
> 
> *Nếu bạn không trả response mà cũng quên gọi `next()`, request đó sẽ bị "treo vĩnh viễn" (hanging) cho đến khi timeout!*

---

## 3. Controller — "Lễ tân" giao tiếp với HTTP

### 3.1. Vai trò của Controller
Controller là tầng đứng mũi chịu sào, làm việc trực tiếp với HTTP Request và Response:
- **Đọc dữ liệu từ Client gửi lên:**
  - `req.body`: Dữ liệu gửi trong body (dùng cho POST, PUT, PATCH).
  - `req.params`: Tham số trên đường dẫn (ví dụ: `/users/:id` ➔ `req.params.id`).
  - `req.query`: Tham số sau dấu `?` trên URL (ví dụ: `/users?page=1&limit=10` ➔ `req.query.page`).
- **Gọi hàm tầng Service** để thực hiện logic tương ứng.
- **Quyết định HTTP Status Code** phù hợp (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Internal Error`) và gửi JSON về cho Client.

### 3.2. Code mẫu Controller chuẩn
```javascript
// src/controllers/user.controller.js
import * as userService from '../services/user.service.js';

export const createUser = async (req, res, next) => {
  try {
    const { email, password, fullName } = req.body;

    // Gọi Service xử lý nghiệp vụ
    const newUser = await userService.registerUser({ email, password, fullName });

    // Trả về response chuẩn
    return res.status(201).json({
      success: true,
      message: 'Tạo tài khoản thành công',
      data: newUser,
    });
  } catch (error) {
    // Đẩy lỗi sang Error Middleware xử lý tập trung
    next(error);
  }
};
```

---

## 4. Service — "Bộ não" chứa Business Logic

### 4.1. Service chứa những gì?
Service là nơi chứa toàn bộ **logic nghiệp vụ (Business Rules)** của phần mềm. Ví dụ:
- Kiểm tra xem email này đã tồn tại trong hệ thống chưa?
- Mã hóa mật khẩu (hash password) trước khi lưu.
- Tính toán tổng tiền đơn hàng dựa vào mã giảm giá, thuế VAT, phí ship.
- Gửi email thông báo kích hoạt tài khoản.

### 4.2. Vì sao PHẢI tách Service ra khỏi Controller?

| Tiêu chí | Controller | Service |
|---|---|---|
| **Hiểu biết về HTTP** | Có (biết `req`, `res`, HTTP status 200, 404...) | **HOÀN TOÀN KHÔNG** (không đụng tới `req`, `res`) |
| **Đầu vào / Đầu ra** | Nhận `req`, gửi `res` | Nhận Object/Tham số thuần JS, trả về Data thuần JS hoặc `throw Error` |
| **Khả năng tái sử dụng** | Kém (chỉ dùng cho Route HTTP) | **Rất cao** (có thể gọi từ cron job, CLI, queue worker, WebSocket) |
| **Unit Test** | Khó test (phải mock object req, res phức tạp) | **Cực kỳ dễ test** (chỉ cần truyền input và assert output) |

### 4.3. Code mẫu Service chuẩn
```javascript
// src/services/user.service.js
import { getUserByEmailFromDB, createUserInDB } from '../repositories/user.repository.js';

export const registerUser = async ({ email, password, fullName }) => {
  // 1. Validate logic nghiệp vụ
  const existingUser = await getUserByEmailFromDB(email);
  if (existingUser) {
    const error = new Error('Email này đã được sử dụng!');
    error.statusCode = 400; // Gắn status code vào error
    throw error;
  }

  // 2. Logic xử lý dữ liệu (ví dụ hash password, format tên...)
  const newUser = await createUserInDB({ email, password, fullName });

  // 3. Trả về kết quả sạch (loại bỏ password)
  const { password: _, ...safeUser } = newUser;
  return safeUser;
};
```

---

## 5. Middleware ghi log Request: Thư viện `morgan`

Khi làm Backend, bạn cần biết có request nào đang gọi vào server, method là gì, URL nào, trả về status code bao nhiêu và mất bao nhiêu mili-giây.

Thay vì tự viết `console.log` thủ công ở từng route, chúng ta dùng thư viện chuẩn công nghiệp: **`morgan`**.

```bash
npm install morgan
```

Cách tích hợp vào file `index.js`:
```javascript
import express from 'express';
import morgan from 'morgan';

const app = express();

// Sử dụng morgan ở chế độ 'dev' để in log có màu sắc trực quan
app.use(morgan('dev'));

// Terminal sẽ tự động in mỗi khi có request:
// GET /api/users 200 12.345 ms - 150
// POST /api/users 201 45.120 ms - 89
// GET /api/users/999 404 5.210 ms - 45
```

---

## 6. Error Handling Middleware — Xử lý lỗi toàn cục

### 6.1. Vấn đề khi không có Error Middleware tập trung
Nếu ở Controller nào bạn cũng viết `res.status(500).json({ message: error.message })`:
1. Format lỗi trả về giữa các API sẽ không đồng nhất (chỗ trả `{ error: ... }`, chỗ trả `{ msg: ... }`).
2. Rất dễ bị lộ thông tin nhạy cảm (Stack trace của Database) ra ngoài client nếu server lỗi nặng.
3. Code Controller bị rác và lặp lại liên tục.

### 6.2. Cấu trúc Error Handling Middleware
Express quy định: Bất kỳ middleware nào có **đúng 4 tham số `(err, req, res, next)`** sẽ được xem là Error Handler.

Tạo file `src/middlewares/error.middleware.js`:
```javascript
// src/middlewares/error.middleware.js

export const errorHandler = (err, req, res, next) => {
  // Lấy status code đã gắn từ Service/Controller, nếu không có thì mặc định là 500
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[ERROR 💥] ${req.method} ${req.url} - ${message}`);
  if (statusCode === 500) {
    console.error(err.stack); // In chi tiết dòng code bị lỗi trên server để debug
  }

  // Luôn trả về định dạng JSON thống nhất cho Frontend
  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    // Chỉ hiện stack trace ở môi trường development để bảo mật
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
```

### 6.3. Bắt lỗi 404 (Route Not Found)
Nếu người dùng gõ sai URL (đường dẫn không tồn tại), chúng ta tạo một middleware bắt 404 đặt ngay trước `errorHandler`:

```javascript
// Middleware bắt 404 Not Found
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Không tìm thấy endpoint: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error); // Chuyển lỗi sang errorHandler xử lý
};
```

---

## 7. Cấu trúc thư mục

Dự án Backend sẽ được tổ chức ngăn nắp như sau:

```
my-app/
├── src/
│   ├── configs/            # File cấu hình (env, database...)
│   ├── controllers/        # Tiếp nhận req, điều phối, trả res
│   │   └── user.controller.js
│   ├── middlewares/        # Trạm kiểm soát & xử lý lỗi
│   │   └── error.middleware.js
│   ├── routes/             # Định nghĩa URL endpoints
│   │   ├── index.js        # Gom tất cả routes con
│   │   └── user.route.js   # Route riêng cho user
│   ├── services/           # Xử lý logic nghiệp vụ chính
│   │   └── user.service.js
│   ├── utils/              # Helper functions dùng chung
│   └── index.js            # Entry point khởi động ứng dụng
├── package.json
└── .env
```

### File `src/index.js` hoàn chỉnh kết nối tất cả:
```javascript
import express from 'express';
import morgan from 'morgan';
import rootRouter from './routes/index.js';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Global Middlewares
app.use(express.json());
app.use(morgan('dev'));

// 2. Main API Routes
app.use('/api', rootRouter);

// 3. 404 Not Found Middleware (Đặt SAU tất cả routes)
app.use(notFoundHandler);

// 4. Global Error Handler Middleware (Luôn đặt CUỐI CÙNG của app)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

---

## 📝 Tự kiểm tra trước buổi học (Self-Check)

Trước khi vào lớp, hãy chắc chắn bạn tự trả lời được 5 câu hỏi này:
1. Luồng chạy chuẩn của 1 request khi gọi vào API từ ngoài vào trong là gì?
2. Controller khác Service ở điểm nào? Vì sao không nên viết logic nghiệp vụ trong Controller?
3. Điều gì xảy ra nếu bên trong một Middleware bạn không gửi response mà cũng không gọi `next()`?
4. Làm thế nào Express nhận biết được một function là Error Handling Middleware thay vì Middleware thường? *(Gợi ý: Số lượng tham số)*
5. Tại sao `app.use(errorHandler)` luôn phải được đặt ở **dòng cuối cùng** sau tất cả các `app.use(route)`?

---
