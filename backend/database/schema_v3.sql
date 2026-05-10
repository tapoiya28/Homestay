-- ============================================================
-- HomeStay Dorm - Database Schema v3 (Simplified)
-- 8 bảng — chỉ phục vụ 5 chức năng:
--   1. Đăng ký / Đăng nhập
--   2. Trang chủ
--   3. Xem danh sách phòng + lọc
--   4. Xem chi tiết phòng + đặt lịch
--   5. Quản lý lịch hẹn (nhân viên xác nhận)
-- ============================================================

BEGIN;

-- ============================================================
-- 1. Branch (Chi nhánh)
-- ============================================================
CREATE TABLE branch (
    branch_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(200)
);

-- ============================================================
-- 2. Room Type (Loại phòng)
-- ============================================================
CREATE TABLE room_type (
    room_type_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- ============================================================
-- 3. Room (Phòng)
-- ============================================================
CREATE TABLE room (
    room_id SERIAL PRIMARY KEY,
    gender_policy VARCHAR(10) CHECK (gender_policy IN ('Male', 'Female', 'Mixed')),
    total_beds INT NOT NULL DEFAULT 0,
    available_beds INT NOT NULL DEFAULT 0,
    room_description TEXT DEFAULT '',
    status VARCHAR(50) DEFAULT 'Empty',
    area VARCHAR(100),
    room_number INT,
    room_type_id INT REFERENCES room_type(room_type_id),
    branch_id INT REFERENCES branch(branch_id),
    room_images TEXT[] DEFAULT '{}'
);

-- ============================================================
-- 4. Bed (Giường)
-- ============================================================
CREATE TABLE bed (
    bed_id SERIAL PRIMARY KEY,
    status VARCHAR(50) DEFAULT 'Empty',
    price DECIMAL(12,2) NOT NULL DEFAULT 0,
    room_id INT REFERENCES room(room_id)
);

-- ============================================================
-- 5. Employee (Nhân viên)
-- ============================================================
CREATE TABLE employee (
    employee_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('sale', 'accountant', 'manager')),
    branch_id INT REFERENCES branch(branch_id)
);

-- ============================================================
-- 6. Tenant (Khách thuê)
-- ============================================================
CREATE TABLE tenant (
    tenant_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(20),
    gender VARCHAR(10),
    cccd_number TEXT,
    nationality VARCHAR(100) DEFAULT 'Vietnam'
);

-- ============================================================
-- 7. Viewing Appointment (Lịch hẹn xem phòng)
-- ============================================================
CREATE TABLE viewing_appointment (
    appointment_id SERIAL PRIMARY KEY,
    appointment_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending Confirmation',
    confirmation_status VARCHAR(50) DEFAULT 'Unconfirmed',
    room_id INT REFERENCES room(room_id),
    tenant_id INT REFERENCES tenant(tenant_id),
    employee_id INT REFERENCES employee(employee_id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. Account (Tài khoản đăng nhập)
-- ============================================================
CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'employee', 'customer')),
    tenant_id INT REFERENCES tenant(tenant_id),
    employee_id INT REFERENCES employee(employee_id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMIT;
