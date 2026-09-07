# Buổi 6 — Tổng quan về Database & Thao tác với SQL (MySQL)

> **SGroup Backend Basic 2026** ·

---

## 🎯 Mục tiêu buổi này

Sau khi đọc tài liệu này và tham gia buổi training, bạn sẽ:
- Hiểu **bản chất và tầm quan trọng** của Database trong kiến trúc phần mềm.
- Phân biệt được hai họ cơ sở dữ liệu chính: **SQL (Relational)** và **NoSQL (Non-relational)**.
- Nắm vững các thành phần cốt lõi của SQL Database: Bảng (Table), Hàng (Row), Cột (Column), Khóa chính (Primary Key), Khóa ngoại (Foreign Key) và Chỉ mục (Index).
- Thành thạo thiết kế 3 loại quan hệ dữ liệu: **1-1**, **1-n**, **n-n**.
- Tự tay viết được các câu lệnh SQL để tạo bảng (DDL) và thao tác dữ liệu CRUD, JOIN, Phân trang, Subquery (DML & DQL).
- Cài đặt và sử dụng thành thạo công cụ quản lý cơ sở dữ liệu (GUI Client).

---

## 🛠️ Chuẩn bị Công cụ Trước Buổi Học (Bắt buộc)

Để thực hành trong buổi học, bạn cần chuẩn bị sẵn 2 công cụ sau trên máy tính:

### 1. Cài đặt Cơ sở dữ liệu MySQL (MySQL Server)
- **Windows / macOS:** Tải installer tại trang chủ [MySQL Community Server](https://dev.mysql.com/downloads/mysql/) (Phiên bản v8.0 trở lên).
- **Lưu ý trong lúc cài đặt:** 
  - Đặt mật khẩu cho tài khoản `root` (Ví dụ: `root` hoặc `123456`) và **nhớ kỹ mật khẩu này**.
  - Đảm bảo MySQL Service đang chạy trên cổng mặc định `3306`.

### 2. Cài đặt Công cụ Quản lý MySQL (GUI Client)
Thay vì gõ lệnh trong giao diện đen trắng của Terminal, chúng ta sẽ dùng công cụ đồ họa (GUI) để xem bảng, tạo dữ liệu và viết SQL trực quan hơn. Tùy thuộc vào cấu hình máy và sở thích, bạn chọn 1 trong các ứng dụng sau:

- **DataGrip** (JetBrains) — *Công cụ mạnh mẽ nhất, khuyên dùng nếu bạn có tài khoản HS/SV JetBrains*.
- **TablePlus** — *Giao diện cực kỳ đẹp, nhẹ, mượt mà trên cả macOS và Windows*.
- **DBeaver** — *Mã nguồn mở, miễn phí 100%, hỗ trợ đa nền tảng*.
- **MySQL Workbench** — *Công cụ chính chủ do MySQL cung cấp*.

---

## 1. Database là gì? Tại sao phải sử dụng Database?

### 1.1. Bản chất của Database
Trong các buổi học trước, chúng ta lưu dữ liệu dưới dạng biến, mảng (Array `MOCK_USERS`) trong RAM hoặc file text/JSON. 

- **Điểm yếu của RAM:** RAM có tốc độ cực nhanh nhưng là **bộ nhớ tạm thời (volatile)**. Chỉ cần bạn lưu file `index.js`, restart server hoặc cúp điện, toàn bộ dữ liệu người dùng vừa tạo sẽ **bốc hơi hoàn toàn**.
- **Điểm yếu của File (JSON/TXT):** Dữ liệu được lưu xuống ổ cứng (non-volatile) không bị mất khi tắt máy. Tuy nhiên khi dữ liệu phình to lên 1 triệu dòng:
  - Muốn tìm 1 người dùng, bạn phải đọc toàn bộ file từ đầu đến cuối ➔ Rất chậm.
  - Nhiều request cùng ghi vào 1 file cùng lúc ➔ Gây xung đột (Conflict) và hỏng file (Corruption).
  - Không có cơ chế ràng buộc dữ liệu (ví dụ: không thể ngăn chặn việc lưu 2 người dùng có cùng Email).

> 💡 **Database (Cơ sở dữ liệu)** ra đời để giải quyết triệt để 3 vấn đề trên: Lưu trữ dữ liệu lâu dài trên ổ cứng, tối ưu hóa tốc độ tìm kiếm hàng triệu bản ghi trong vài mili-giây, và bảo đảm tính toàn vẹn dữ liệu khi có hàng ngàn người truy cập đồng thời.

---

## 2. Phân loại Database: SQL vs NoSQL

Trên thế giới hiện nay có 2 trường phái Cơ sở dữ liệu chính:

```
                      ┌─────────────────────────────────────────┐
                      │            DATABASE SYSTEMS             │
                      └────────────────────┬────────────────────┘
                                           │
                  ┌────────────────────────┴────────────────────────┐
                  ▼                                                 ▼
     ┌──────────────────────────┐                      ┌──────────────────────────┐
     │  SQL (Relational DB)     │                      │  NoSQL (Non-Relational)  │
     ├──────────────────────────┤                      ├──────────────────────────┤
     │ - Dữ liệu dạng Bảng      │                      │ - Dữ liệu dạng Document, │
     │ - Schema cố định, chặt   │                      │   Key-Value, Graph...    │
     │ - Sử dụng ngôn ngữ SQL   │                      │ - Schema linh hoạt       │
     │ - MySQL, PostgreSQL,     │                      │ - MongoDB, Redis,        │
     │   SQLite, SQL Server...  │                      │   Cassandra, DynamoDB... │
     └──────────────────────────┘                      └──────────────────────────┘
```

### So sánh trực quan & Tình huống Thực tế (Use Cases):

| Tiêu chí | SQL (Cơ sở dữ liệu Quan hệ) | NoSQL (Cơ sở dữ liệu Phi quan hệ) |
|---|---|---|
| **Cấu trúc dữ liệu** | Lưu dưới dạng các **Bảng (Table)** gồm hàng và cột nghiêm ngặt như Excel. | Lưu dưới dạng **Document (JSON)**, Key-Value, hoặc Đồ thị. |
| **Tính linh hoạt (Schema)** | Cố định. Muốn thêm cột mới phải định nghĩa trước cấu trúc. | Linh hoạt. Mỗi bản ghi có thể chứa các trường thông tin khác nhau. |
| **Tính toàn vẹn (ACID)** | Cực kỳ cao. Đảm bảo dữ liệu chính xác tuyệt đối (ví dụ: chuyển tiền ngân hàng). | Ưu tiên tốc độ và mở rộng quy mô hơn là ràng buộc chặt chẽ. |

#### 📌 Khi nào BẮT BUỘC / NÊN dùng SQL? (MySQL, PostgreSQL)
1. **Hệ thống Ngân hàng / Ví điện tử / Thanh toán:**
   - *Ví dụ:* Chuyển 100k từ Tài khoản A sang B. Bắt buộc trừ A 100k VÀ cộng B 100k cùng lúc. Nếu lỡ cúp điện giữa chừng phải tự động khôi phục (Rollback). SQL bảo đảm tính toàn vẹn **ACID** tuyệt đối này.
2. **Hệ thống Thương mại điện tử (E-commerce Order Management):**
   - *Ví dụ:* Đặt hàng, trừ tồn kho, áp mã giảm giá, tính phí ship. Cần liên kết chặt chẽ (`JOIN`) giữa `users`, `orders`, `products`, `vouchers`.
3. **Hệ thống Quản lý Nhân sự (HRM), Bệnh viện, ERP:**
   - Dữ liệu có cấu trúc cố định, đòi hỏi ràng buộc không được trùng lặp (Khóa chính / Khóa ngoại / Unique Email/CCCD).

#### 📌 Khi nào BẮT BUỘC / NÊN dùng NoSQL? (MongoDB, Redis)
1. **Hệ thống Caching bộ nhớ đệm tốc độ cao (Redis):**
   - *Ví dụ:* Lưu Session đăng nhập của user hoặc thông tin sản phẩm "Hot" để trả về cho Client trong **0.0001s** mà không làm sập Database chính.
2. **Hệ thống Mạng xã hội / Comment / Bảng tin Feeds (MongoDB):**
   - *Ví dụ:* Bài post trên Facebook có bài chỉ chứa chữ, bài chứa 10 ảnh, bài chứa video, bài chứa Poll bình chọn... Dữ liệu dạng Document JSON linh hoạt không có khung cố định.
3. **Hệ thống Nhắn tin Real-time / App Chat (MongoDB / Cassandra):**
   - Đọc/ghi hàng triệu tin nhắn mỗi giây, không cần quan hệ bảng phức tạp, ưu tiên tốc độ và mở rộng sang hàng trăm máy chủ.

---

## 3. Các thành phần cốt lõi trong SQL Database

Để làm việc với MySQL, bạn cần hiểu các thuật ngữ cơ bản sau:

### 3.1. Bảng (Table), Hàng (Row), Cột (Column)
- **Table (Bảng):** Một tập hợp các dữ liệu cùng loại (Ví dụ: bảng `users`, bảng `products`).
- **Column (Cột / Field):** Định nghĩa thuộc tính của dữ liệu (Ví dụ: cột `email`, `created_at`). Mỗi cột có một **Kiểu dữ liệu (Data Type)** cố định.
- **Row (Hàng / Record):** Một dòng dữ liệu cụ thể đại diện cho 1 đối tượng thực tế (Ví dụ: 1 người dùng cụ thể trong bảng `users`).

### 3.2. Kiểu dữ liệu phổ biến trong MySQL

| Kiểu dữ liệu | Ý nghĩa & Ví dụ | Khi nào dùng? |
|---|---|---|
| `INT` / `BIGINT` | Số nguyên (`1`, `2`, `1000000`) | Làm ID, số lượng tồn kho, lượt xem. |
| `CHAR(N)` | Chuỗi **cố định** đúng N ký tự (`CHAR(2)`, `CHAR(32)`) | Lưu mã cố định: Mã quốc gia (`'VN'`), Hash MD5, Số CCCD. |
| `VARCHAR(N)` | Chuỗi **linh hoạt** tối đa N ký tự (`VARCHAR(255)`) | Lưu dữ liệu biến đổi: Tên, email, số điện thoại, tiêu đề. |
| `TEXT` | Chuỗi văn bản rất dài | Lưu bài viết, mô tả sản phẩm, nội dung comment. |
| `DECIMAL(precision, scale)` | Số thực chính xác tuyệt đối (`DECIMAL(10, 2)`) | **Lưu giá tiền, số dư tài khoản** (Tránh lỗi làm tròn của Float/Double). |
| `BOOLEAN` / `TINYINT(1)` | Đúng / Sai (`true`/`false` hoặc `1`/`0`) | Trạng thái kích hoạt `is_active`, `is_deleted`. |
| `DATETIME` / `TIMESTAMP` | Ngày giờ (`2026-08-27 14:30:00`) | Lưu mốc thời gian `created_at`, `updated_at`. |

> 📌 **Phân biệt `CHAR(N)` vs `VARCHAR(N)`:**  
> - `CHAR(10)` chứa chữ `'An'` (2 ký tự) ➔ MySQL vẫn dành **đúng 10 bytes** trên đĩa (tự điền khoảng trắng vào sau). Ưu điểm: Đọc/ghi siêu nhanh vì kích thước cố định.  
> - `VARCHAR(10)` chứa chữ `'An'` (2 ký tự) ➔ MySQL chỉ chiếm **2 bytes + 1 byte header** lưu độ dài. Ưu điểm: Tiết kiệm dung lượng bộ nhớ

### 3.3. Khóa chính (Primary Key - PK)
- Là một hoặc nhiều cột dùng để **định danh duy nhất** cho mỗi dòng trong bảng.
- Không được phép trùng lặp và không được phép để rỗng (`NOT NULL`).
- Thường là cột `id` tự động tăng (`AUTO_INCREMENT`).

### 3.4. Khóa ngoại (Foreign Key - FK)
- Là cột trong bảng này dùng để **chỉ tới Khóa chính (PK) của một bảng khác**.
- Mục đích: Tạo mối liên kết giữa các bảng và đảm bảo tính toàn vẹn dữ liệu (không thể tạo đơn hàng cho một người dùng không tồn tại).

### 3.5. Chỉ mục (Index) — Bí quyết tìm kiếm thần tốc

#### A. Nỗi đau khi KHÔNG CÓ Index (Full Table Scan)
Giả sử bảng `users` của bạn có **1,000,000 (1 triệu) dòng dữ liệu**. Dữ liệu được lưu ngẫu nhiên xuống ổ cứng. Khi bạn chạy câu lệnh:
```sql
SELECT * FROM users WHERE email = 'tung@gmail.com';
```
Khi **chưa tạo Index** cho cột `email`, MySQL buộc phải thực hiện cơ chế **Full Table Scan (Quét toàn bộ bảng)**:
- Đọc từng dòng từ 1 đến 1,000,000 để so sánh email.
- **Hậu quả:** Máy tính phải đọc toàn bộ đĩa cứng (Disk I/O) cực kỳ nặng nề. Độ phức tạp thuật toán là $O(N)$ — 1 triệu dòng tương ứng 1 triệu phép so sánh!

#### B. Vì sao Index lại Nhanh thần tốc? (Toán học chứng minh)
Khi tạo Index cho cột `email`, MySQL dựng sẵn một file cấu trúc cây **B-Tree** (sắp xếp email theo thứ tự chữ cái). Nhờ đó, độ phức tạp thuật toán tìm kiếm từ $O(N)$ tụt xuống chỉ còn **$O(\log_2 N)$**:

| Số lượng dòng trong Bảng ($N$) | Không có Index (Full Table Scan) | **Có B-Tree Index** |
|---|---|---|
| 100 dòng | 100 phép so sánh | **~7 phép so sánh** |
| 10,000 dòng | 10,000 phép so sánh | **~14 phép so sánh** |
| **1,000,000 (1 triệu) dòng** | **1,000,000 phép so sánh** | **chỉ mất đúng 20 phép so sánh!** |
| **1,000,000,000 (1 tỷ) dòng** | 1 tỷ phép so sánh | **chỉ mất đúng 30 phép so sánh!** |

> 💡 **Sức mạnh toán học:** Tìm người dùng trong 1 triệu dòng, thay vì lật 1 triệu lần, MySQL dùng Index chỉ mất **tối đa 20 lần chạm**! Tốc độ phản hồi từ vài giây tụt xuống còn **0.001 giây**.

#### C. Cái giá phải trả của Index (Trade-offs / Tác dụng phụ)
1. **Tốn dung lượng lưu trữ (RAM & Disk):** Mỗi Index là một cây B-Tree riêng. Bảng càng nhiều Index thì bộ nhớ càng phình to.
2. **Làm CHẬM thao tác Thêm / Sửa / Xóa (`INSERT`, `UPDATE`, `DELETE`):** Mỗi khi thêm người dùng mới, MySQL vừa phải chèn vào bảng chính vừa phải tính toán chèn lại node vào cây B-Tree để giữ cây luôn cân bằng.

> 📌 **Bài học dành cho Backend:** Chỉ tạo Index cho các cột thường xuyên nằm trong điều kiện `WHERE`, `JOIN` hoặc sắp xếp `ORDER BY`. Không tạo Index vô tội vạ!

---

## 4. Thiết kế Mô hình Quan hệ trong Database

Trong thực tế, dữ liệu không đứng độc lập mà có mối quan hệ chặt chẽ với nhau. Có 3 loại quan hệ kinh điển:

```
1. QUAN HỆ 1 - 1 (One-to-One)
   [users] 1 ────────── 1 [user_profiles]

2. QUAN HỆ 1 - N (One-to-Many)
   [categories] 1 ────────── N [products]

3. QUAN HỆ N - N (Many-to-Many)
   [orders] N ──── N [products]
                      │
                      ▼
   [orders] 1 ──── N [order_items] N ──── 1 [products]
                   (Bảng trung gian)
```

### 4.1. Quan hệ 1 - 1 (One-to-One)
- **Ý nghĩa:** Một bản ghi bảng A chỉ liên kết với 1 bản ghi bảng B và ngược lại.
- **Ví dụ:** 1 Người dùng (`users`) chỉ có 1 Hồ sơ chi tiết (`user_profiles`).
- **Cách thiết kế:** Đặt Khóa ngoại `user_id` ở bảng `user_profiles` và đánh dấu `UNIQUE`.

### 4.2. Quan hệ 1 - N (One-to-Many) — Phổ biến nhất!
- **Ý nghĩa:** Một bản ghi bảng A có thể liên kết với nhiều bản ghi bảng B, nhưng 1 bản ghi bảng B chỉ thuộc về 1 bản ghi bảng A.
- **Ví dụ:** 1 Danh mục (`categories`) chứa **nhiều** Sản phẩm (`products`). Nhưng 1 Sản phẩm chỉ thuộc về **1** Danh mục.
- **Quy tắc thiết kế:** **Khóa ngoại luôn nằm ở bên nhánh "Nhiều" (Side N)**. Tức là thêm cột `category_id` vào bảng `products`.

### 4.3. Quan hệ N - N (Many-to-Many)
- **Ý nghĩa:** Một bản ghi bảng A liên kết với nhiều bản ghi bảng B, và ngược lại.
- **Ví dụ:** 1 Đơn hàng (`orders`) có thể chứa **nhiều** Sản phẩm (`products`). Ngược lại, 1 Sản phẩm có thể xuất hiện trong **nhiều** Đơn hàng khác nhau.
- **Quy tắc thiết kế:** Máy tính không thể xử lý trực tiếp quan hệ N-N. Chúng ta **bắt buộc phải tách thành 1 Bảng trung gian (Junction Table)** tên là `order_items`. Bảng này chứa 2 khóa ngoại: `order_id` và `product_id` (kèm theo số lượng `quantity`, giá bán tại thời điểm mua `price`).

---

## 5. Ngôn ngữ SQL — Tạo & Thay đổi cấu trúc (DDL)

DDL (Data Definition Language) gồm các câu lệnh dùng để định nghĩa cấu trúc bảng:

### 5.1. Tạo bảng (`CREATE TABLE`)

```sql
-- 1. Tạo bảng danh mục sản phẩm
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tạo bảng sản phẩm (có khóa ngoại chỉ tới categories)
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Khai báo khóa ngoại
    CONSTRAINT fk_products_categories 
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE SET NULL
);
```

### 5.2. Sửa & Xóa bảng (`ALTER TABLE`, `DROP TABLE`)

```sql
-- Thêm cột mới vào bảng
ALTER TABLE products ADD COLUMN description TEXT;

-- Xóa một cột khỏi bảng
ALTER TABLE products DROP COLUMN stock;

-- Xóa hoàn toàn một bảng
DROP TABLE products;
```

---

## 6. Ngôn ngữ SQL — Thao tác & Truy vấn Dữ liệu (DML & DQL)

### 6.1. Thêm dữ liệu (`INSERT INTO`)

```sql
-- Thêm 1 danh mục
INSERT INTO categories (name) VALUES ('Điện thoại');

-- Thêm nhiều sản phẩm cùng lúc
INSERT INTO products (name, price, stock, category_id) VALUES
('iPhone 15 Pro', 1200.00, 10, 1),
('MacBook Pro M3', 2000.00, 5, 1),
('Tai nghe Sony XM5', 350.00, 0, 1);
```

### 6.2. Truy vấn dữ liệu cơ bản (`SELECT`, `WHERE`, `LIKE`, `ORDER BY`)

```sql
-- Lấy tất cả cột từ bảng products
SELECT * FROM products;

-- Chỉ lấy các cột cần thiết kèm điều kiện giá > 500 và còn hàng
SELECT id, name, price 
FROM products 
WHERE price > 500 AND stock > 0;

-- Tìm kiếm sản phẩm có tên chứa chữ 'iPhone' (Case-insensitive)
SELECT * FROM products WHERE name LIKE '%iPhone%';

-- Sắp xếp theo giá giảm dần (DESC)
SELECT * FROM products ORDER BY price DESC;
```

### 6.3. Phân trang dữ liệu (`LIMIT` & `OFFSET`) — Cực kỳ quan trọng trong Backend!

Khi trang web hiển thị danh sách sản phẩm theo từng trang (Trang 1 có 10 sản phẩm):

```sql
-- Trang 1 (Lấy 10 sản phẩm đầu tiên)
SELECT * FROM products LIMIT 10 OFFSET 0;

-- Trang 2 (Bỏ qua 10 sản phẩm đầu, lấy 10 sản phẩm tiếp theo)
SELECT * FROM products LIMIT 10 OFFSET 10;

-- Công thức tính OFFSET trong Backend: OFFSET = (page - 1) * limit
```

### 6.4. Cập nhật & Xóa dữ liệu (`UPDATE`, `DELETE`)

```sql
-- Cập nhật giá sản phẩm có id = 1
UPDATE products 
SET price = 1100.00, stock = 8 
WHERE id = 1;

-- Xóa sản phẩm hết hàng
DELETE FROM products WHERE stock = 0 AND id = 3;
```

> ⚠️ **CẢNH BÁO NGUY HIỂM:** Khi viết `UPDATE` hoặc `DELETE`, **LUÔN LUÔN phải có mệnh đề `WHERE`**. Nếu quên `WHERE`, bạn sẽ ghi đè hoặc xóa sạch toàn bộ dữ liệu của cả bảng!

---

## 7. Liên kết dữ liệu giữa các bảng (`JOIN`)

Khi dữ liệu được phân tách ra nhiều bảng để đảm bảo chuẩn hóa (Normalization), chúng ta dùng `JOIN` để gộp các bảng lại và truy vấn thông tin cùng lúc.

### Sơ đồ tổng quan các loại JOIN:

```
    1. INNER JOIN             2. LEFT JOIN            3. RIGHT JOIN
   ┌─────────┬─────────┐     ┌─────────┬─────────┐   ┌─────────┬─────────┐
   │ Table A │ Table B │     │ Table A │ Table B │   │ Table A │ Table B │
   │      ┌──┼──┐      │     │  ███████┼──┐      │   │      ┌──┼████████ │
   │      │  ███│      │     │  ██████████│      │   │      │█████████ │
   │      └──┼──┘      │     │  ███████┼──┐      │   │      └──┼████████ │
   └─────────┴─────────┘     └─────────┴─────────┘   └─────────┴─────────┘
    Chỉ lấy phần giao         Lấy TẤT CẢ bên A +      Lấy TẤT CẢ bên B +
    của cả A và B             phần B khớp (NULL nếu  phần A khớp (NULL nếu
                              không khớp)             không khớp)

    4. FULL JOIN (UNION)      5. CROSS JOIN           6. SELF JOIN
   ┌─────────┬─────────┐     ┌─────────┬─────────┐   ┌───────────────────┐
   │ Table A │ Table B │     │ Table A │ Table B │   │     Table A       │
   │  ████████████████ │     │  ████████████████ │   │ ┌───────────────┐ │
   │  ████████████████ │     │  ████████████████ │   │ │ e1  JOIN  e2  │ │
   │  ████████████████ │     │  ████████████████ │   │ └───────────────┘ │
   └─────────┴─────────┘     └─────────┴─────────┘   └───────────────────┘
    Lấy TẤT CẢ từ A & B       Tích Đề-các (A x B)     Bảng tự JOIN chính nó
    (MySQL dùng UNION)        Mỗi dòng A x mọi dòng B  (Ví dụ: Quản lý - NV)
```

---

### 7.1. `INNER JOIN` (Giao nhau — Chỉ lấy dữ liệu cả 2 bên cùng có)
Trả về các dòng mà **cặp khóa khớp nhau ở cả 2 bảng**.

```sql
-- Lấy danh sách sản phẩm kèm tên danh mục tương ứng
SELECT p.id, p.name AS product_name, p.price, c.name AS category_name
FROM products p
INNER JOIN categories c ON p.category_id = c.id;
```

---

### 7.2. `LEFT JOIN` / `LEFT OUTER JOIN` (Ưu tiên bảng bên trái)
Trả về **tất cả bản ghi của Bảng A (bên trái)**, dù Bảng B (bên phải) có dữ liệu tương ứng hay không. Nếu B không khớp, các cột của B sẽ mang giá trị `NULL`.

```sql
-- Lấy tất cả danh mục, kể cả danh mục mới chưa có sản phẩm nào
SELECT c.id AS category_id, c.name AS category_name, p.name AS product_name
FROM categories c
LEFT JOIN products p ON c.category_id = p.id;
```

---

### 7.3. `RIGHT JOIN` / `RIGHT OUTER JOIN` (Ưu tiên bảng bên phải)
Ngược lại với `LEFT JOIN`, trả về **tất cả bản ghi của Bảng B (bên phải)**. Nếu Bảng A (bên trái) không khớp, các cột của A sẽ mang giá trị `NULL`.

```sql
-- Lấy tất cả sản phẩm, kể cả sản phẩm chưa được gán danh mục nào (category_id = NULL)
SELECT p.name AS product_name, c.name AS category_name
FROM categories c
RIGHT JOIN products p ON c.category_id = p.id;
```

---

### 7.4. `FULL JOIN` / `FULL OUTER JOIN` (Lấy tất cả của cả 2 bảng)
Trả về tất cả bản ghi khi có kết quả khớp ở bảng bên trái HOẶC bảng bên phải.

> ⚠️ **Mẹo MySQL quan trọng:** MySQL **không hỗ trợ** cú pháp `FULL OUTER JOIN` trực tiếp! Trong MySQL, để làm FULL JOIN ta kết hợp `LEFT JOIN` và `RIGHT JOIN` thông qua từ khóa **`UNION`**:

```sql
-- Giả lập FULL JOIN trong MySQL bằng UNION
SELECT c.name AS category_name, p.name AS product_name
FROM categories c
LEFT JOIN products p ON c.category_id = p.id

UNION

SELECT c.name AS category_name, p.name AS product_name
FROM categories c
RIGHT JOIN products p ON c.category_id = p.id;
```

---

### 7.5. `CROSS JOIN` (Tích Đề-các / Cartesian Product)
Kết hợp **mỗi dòng của Bảng A với TẤT CẢ các dòng của Bảng B**.
- Nếu Bảng A có 5 dòng, Bảng B có 4 dòng ➔ Kết quả sẽ ra `5 x 4 = 20` dòng.
- Thường dùng khi muốn tạo ra tất cả các tổ hợp có thể (Ví dụ: Kết hợp tất cả Kích thước [S, M, L] với tất cả Màu sắc [Đỏ, Xanh, Vàng] của sản phẩm).

```sql
-- Tạo tất cả tổ hợp giữa Danh mục và Sản phẩm
SELECT c.name AS category_name, p.name AS product_name
FROM categories c
CROSS JOIN products p;
```

---

### 7.6. `SELF JOIN` (Bảng tự JOIN chính mình)
Là trường hợp một bảng tự `JOIN` với chính nó. Thường dùng khi dữ liệu có **cấu trúc cấp bậc (Hierarchical Data)** như: Quản lý - Nhân viên, Danh mục Cha - Danh mục Con.

```sql
-- Ví dụ: Bảng users có cột manager_id trỏ tới id của chính người dùng đó
SELECT e.full_name AS employee_name, m.full_name AS manager_name
FROM users e
LEFT JOIN users m ON e.manager_id = m.id;
```

---

## 8. Gom nhóm & Hàm tổng hợp (`GROUP BY`, `HAVING`, `COUNT`, `AVG`)

```sql
-- Đếm số lượng sản phẩm trong từng danh mục
SELECT category_id, COUNT(*) AS total_products, AVG(price) AS average_price
FROM products
GROUP BY category_id;

-- Chỉ lấy danh mục nào có nhiều hơn 5 sản phẩm (Dùng HAVING thay cho WHERE khi lọc kết quả gom nhóm)
SELECT category_id, COUNT(*) AS total_products
FROM products
GROUP BY category_id
HAVING total_products > 5;
```

---

## 9. Truy vấn con (Subquery / Nested Query) — Optional

Subquery là một câu lệnh `SELECT` nằm bên trong một câu lệnh SQL khác.

```sql
-- Tìm tất cả sản phẩm có giá CAO HƠN giá trung bình của tất cả sản phẩm
SELECT name, price 
FROM products 
WHERE price > (SELECT AVG(price) FROM products);
```

---

## 📝 Tự kiểm tra kiến thức (Self-Check)

Trước khi tham gia buổi training, hãy đảm bảo bạn trả lời được 5 câu hỏi sau:
1. Vì sao không nên lưu trữ dữ liệu người dùng trong biến RAM hoặc file JSON khi làm ứng dụng thực tế?
2. Sự khác nhau cốt lõi giữa `PRIMARY KEY` và `FOREIGN KEY` là gì?
3. Trong quan hệ 1-N (Ví dụ: 1 Tác giả có Nhiều Bài viết), Khóa ngoại sẽ được đặt ở bảng nào?
4. Điều gì sẽ xảy ra nếu bạn chạy câu lệnh `UPDATE products SET price = 0;` mà quên mệnh đề `WHERE`?
5. `INNER JOIN` và `LEFT JOIN` khác nhau ở điểm nào?

---

*Chúc bạn có buổi học hiệu quả!*
