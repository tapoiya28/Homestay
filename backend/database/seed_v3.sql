-- ============================================================
-- HomeStay Dorm - Seed Data v3 (Mapped from old schema)
-- Chạy file này SAU KHI đã chạy schema_v3.sql
--
-- Ánh xạ từ schema cũ → schema v3:
--   branch          : giữ nguyên + thêm name, phone_number, email
--   room_type       : giữ nguyên
--   room            : giữ nguyên (bỏ trailing comma bug)
--   bed             : giữ nguyên
--   employee        : giữ nguyên (bỏ salary, sale_employee, accountant, manager)
--   tenant          : giữ nguyên
--   viewing_appointment: thêm tenant_id (FK mới)
--   account         : giữ nguyên
-- ============================================================

BEGIN;

-- ============================================================
-- 1. Branch
-- Schema cũ chỉ có: branch_id, address
-- Schema mới thêm: name, phone_number, email
-- ============================================================
INSERT INTO branch (branch_id, name, address, phone_number, email) VALUES
(1, 'HomeStay Quận 1',     '123 Nguyễn Huệ, Quận 1, TP.HCM',        '0901234567', 'q1@homestaydorm.vn'),
(2, 'HomeStay Quận 7',     '456 Nguyễn Thị Thập, Quận 7, TP.HCM',    '0902345678', 'q7@homestaydorm.vn'),
(3, 'HomeStay Thủ Đức',    '789 Võ Văn Ngân, TP. Thủ Đức, TP.HCM',   '0903456789', 'thuduc@homestaydorm.vn'),
(4, 'HomeStay Bình Thạnh', '321 Xô Viết Nghệ Tĩnh, Bình Thạnh',      '0904567890', 'binhthanh@homestaydorm.vn');

-- Reset sequence
SELECT setval('branch_branch_id_seq', (SELECT MAX(branch_id) FROM branch));

-- ============================================================
-- 2. Room Type (không đổi)
-- ============================================================
INSERT INTO room_type (room_type_id, name) VALUES
(1, 'Phòng đơn'),
(2, 'Phòng đôi'),
(3, 'Phòng 4 người'),
(4, 'Phòng 6 người'),
(5, 'Studio');

SELECT setval('room_type_room_type_id_seq', (SELECT MAX(room_type_id) FROM room_type));

-- ============================================================
-- 3. Room (không đổi cấu trúc, fix trailing comma bug đã xử lý ở schema_v3)
-- Ảnh: dùng Unsplash URLs làm mock (thay thế ảnh Cloudinary cũ)
-- ============================================================
INSERT INTO room (room_id, gender_policy, total_beds, available_beds, room_description, status, area, room_number, room_type_id, branch_id, room_images) VALUES
(1,  'Male',   2, 1, 'Phòng nam view công viên, đầy đủ nội thất, máy lạnh, WiFi miễn phí.',          'Available', '25m²', 101, 2, 1,
    ARRAY['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800','https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800']),
(2,  'Female', 2, 2, 'Phòng nữ tầng cao, ban công rộng, gần trung tâm.',                              'Available', '25m²', 102, 2, 1,
    ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800','https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800']),
(3,  'Mixed',  4, 3, 'Phòng 4 người tiện nghi, gần siêu thị, trường học. Có bếp chung.',             'Available', '40m²', 103, 3, 1,
    ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800']),
(4,  'Male',   1, 0, 'Phòng đơn nam, yên tĩnh, phù hợp làm việc từ xa.',                             'Full',      '18m²', 201, 1, 2,
    ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800']),
(5,  'Female', 4, 4, 'Phòng 4 nữ, mới xây, nội thất hiện đại, có thang máy.',                        'Available', '35m²', 202, 3, 2,
    ARRAY['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800','https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800']),
(6,  'Mixed',  6, 2, 'Phòng 6 người rộng rãi, khu an ninh, gần bến xe buýt.',                        'Available', '50m²', 203, 4, 2,
    ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800']),
(7,  'Male',   2, 2, 'Phòng đôi nam gần ĐH Bách Khoa, giá sinh viên.',                               'Available', '22m²', 301, 2, 3,
    ARRAY['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800']),
(8,  'Female', 1, 1, 'Studio nữ cao cấp, full nội thất, có bếp riêng.',                              'Available', '30m²', 302, 5, 3,
    ARRAY['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800']),
(9,  'Mixed',  4, 0, 'Phòng 4 người đã đầy, khu vực yên tĩnh.',                                      'Full',      '38m²', 303, 3, 3,
    ARRAY['https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800']),
(10, 'Male',   6, 5, 'Phòng 6 nam giá rẻ, gần chợ và trạm xe buýt.',                                'Available', '55m²', 401, 4, 4,
    ARRAY['https://images.unsplash.com/photo-1523192193543-6e7296d960e4?w=800']),
(11, 'Female', 2, 1, 'Phòng đôi nữ view sông Sài Gòn, có hồ bơi chung.',                            'Available', '28m²', 402, 2, 4,
    ARRAY['https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=800']),
(12, 'Mixed',  1, 1, 'Studio tiện nghi dành cho 1 người, khu trung tâm.',                             'Available', '20m²', 403, 5, 4,
    ARRAY['https://images.unsplash.com/photo-1527030280862-64139fba04ca?w=800']);

SELECT setval('room_room_id_seq', (SELECT MAX(room_id) FROM room));

-- ============================================================
-- 4. Bed (không đổi — bed chỉ có bed_id, status, price, room_id)
-- ============================================================
-- Room 1 (2 beds, 1 available)
INSERT INTO bed (status, price, room_id) VALUES ('Occupied', 2500000, 1), ('Empty', 2500000, 1);
-- Room 2 (2 beds, 2 available)
INSERT INTO bed (status, price, room_id) VALUES ('Empty', 2800000, 2), ('Empty', 2800000, 2);
-- Room 3 (4 beds, 3 available)
INSERT INTO bed (status, price, room_id) VALUES ('Occupied', 1800000, 3), ('Empty', 1800000, 3), ('Empty', 1800000, 3), ('Empty', 1800000, 3);
-- Room 4 (1 bed, full)
INSERT INTO bed (status, price, room_id) VALUES ('Occupied', 3500000, 4);
-- Room 5 (4 beds, 4 available)
INSERT INTO bed (status, price, room_id) VALUES ('Empty', 2000000, 5), ('Empty', 2000000, 5), ('Empty', 2000000, 5), ('Empty', 2000000, 5);
-- Room 6 (6 beds, 2 available)
INSERT INTO bed (status, price, room_id) VALUES ('Occupied', 1500000, 6), ('Occupied', 1500000, 6), ('Occupied', 1500000, 6), ('Occupied', 1500000, 6), ('Empty', 1500000, 6), ('Empty', 1500000, 6);
-- Room 7 (2 beds)
INSERT INTO bed (status, price, room_id) VALUES ('Empty', 2200000, 7), ('Empty', 2200000, 7);
-- Room 8 (1 bed)
INSERT INTO bed (status, price, room_id) VALUES ('Empty', 4000000, 8);
-- Room 9 (4 beds, full)
INSERT INTO bed (status, price, room_id) VALUES ('Occupied', 1900000, 9), ('Occupied', 1900000, 9), ('Occupied', 1900000, 9), ('Occupied', 1900000, 9);
-- Room 10 (6 beds, 5 available)
INSERT INTO bed (status, price, room_id) VALUES ('Occupied', 1200000, 10), ('Empty', 1200000, 10), ('Empty', 1200000, 10), ('Empty', 1200000, 10), ('Empty', 1200000, 10), ('Empty', 1200000, 10);
-- Room 11 (2 beds, 1 available)
INSERT INTO bed (status, price, room_id) VALUES ('Occupied', 3000000, 11), ('Empty', 3000000, 11);
-- Room 12 (1 bed)
INSERT INTO bed (status, price, room_id) VALUES ('Empty', 3800000, 12);

-- ============================================================
-- 5. Employee
-- Schema cũ có: employee_id, name, salary, role, branch_id
--               + sale_employee, accountant, manager (subtables)
-- Schema mới: employee_id, name, role, branch_id (bỏ salary, subtables)
-- ============================================================
INSERT INTO employee (employee_id, name, role, branch_id) VALUES
(1, 'Nguyễn Văn An',   'sale',       1),
(2, 'Trần Thị Bình',   'sale',       2),
(3, 'Lê Hoàng Cường',  'manager',    1),
(4, 'Phạm Minh Dũng',  'accountant', 3),
(5, 'Võ Thị Hoa',      'sale',       3),
(6, 'Đặng Quốc Khánh', 'manager',    4);

SELECT setval('employee_employee_id_seq', (SELECT MAX(employee_id) FROM employee));

-- ============================================================
-- 6. Tenant (không đổi)
-- ============================================================
INSERT INTO tenant (tenant_id, name, phone, gender, cccd_number, nationality) VALUES
(1, 'Nguyễn Minh Tuấn', '0911111111', 'Male',   '079201001234', 'Vietnam'),
(2, 'Trần Thị Mai',     '0922222222', 'Female', '079201005678', 'Vietnam'),
(3, 'Lê Văn Hùng',      '0933333333', 'Male',   '079202001111', 'Vietnam'),
(4, 'Phạm Thị Lan',     '0944444444', 'Female', '079202002222', 'Vietnam'),
(5, 'Hoàng Đức Anh',    '0955555555', 'Male',   '079203003333', 'Vietnam'),
(6, 'Vũ Thị Hồng',      '0966666666', 'Female', '079203004444', 'Vietnam'),
(7, 'Park Ji-hoon',     '0977777777', 'Male',   NULL,            'South Korea'),
(8, 'Tanaka Yuki',      '0988888888', 'Female', NULL,            'Japan');

SELECT setval('tenant_tenant_id_seq', (SELECT MAX(tenant_id) FROM tenant));

-- ============================================================
-- 7. Viewing Appointment
-- Schema cũ có: registration_request_id (không còn), không có tenant_id
-- Schema mới: thêm tenant_id (FK), bỏ registration_request_id
-- Ánh xạ: tenant_id lấy từ tenant đang đặt lịch (mock)
-- ============================================================
INSERT INTO viewing_appointment (appointment_time, status, confirmation_status, room_id, tenant_id, employee_id) VALUES
(NOW() + INTERVAL '1 day',   'Pending Confirmation', 'Unconfirmed', 2,  2, 1),
(NOW() + INTERVAL '2 days',  'Pending Confirmation', 'Unconfirmed', 5,  4, 2),
(NOW() + INTERVAL '3 days',  'Confirmed',            'Confirmed',   7,  5, 5),
(NOW() + INTERVAL '5 days',  'Pending Confirmation', 'Unconfirmed', 8,  6, 5),
(NOW() + INTERVAL '1 day',   'Pending Confirmation', 'Unconfirmed', 10, 7, 2),
(NOW() + INTERVAL '7 days',  'Confirmed',            'Confirmed',   12, 8, 1);

-- ============================================================
-- 8. Account
-- Không đổi. Password cho tất cả: "123456"
-- bcrypt hash (cost=10): $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- ============================================================
INSERT INTO account (username, email, password_hash, role, tenant_id, employee_id) VALUES
-- Customer accounts (liên kết tenant)
('minhtuan',      'minhtuan@gmail.com',      '$2b$10$Tm2EJ.oYZMS98f4GTM.xaekdLop295j2Bdd9ZIszvyt9ULPO5Yt7i', 'customer', 1, NULL),
('thimai',        'thimai@gmail.com',        '$2b$10$Tm2EJ.oYZMS98f4GTM.xaekdLop295j2Bdd9ZIszvyt9ULPO5Yt7i', 'customer', 2, NULL),
('vanhung',       'vanhung@gmail.com',       '$2b$10$Tm2EJ.oYZMS98f4GTM.xaekdLop295j2Bdd9ZIszvyt9ULPO5Yt7i', 'customer', 3, NULL),
('thilan',        'thilan@gmail.com',        '$2b$10$Tm2EJ.oYZMS98f4GTM.xaekdLop295j2Bdd9ZIszvyt9ULPO5Yt7i', 'customer', 4, NULL),
-- Employee accounts (liên kết employee)
('nguyenvanan',   'an@homestaydorm.vn',      '$2b$10$Tm2EJ.oYZMS98f4GTM.xaekdLop295j2Bdd9ZIszvyt9ULPO5Yt7i', 'employee', NULL, 1),
('tranthibinh',   'binh@homestaydorm.vn',    '$2b$10$Tm2EJ.oYZMS98f4GTM.xaekdLop295j2Bdd9ZIszvyt9ULPO5Yt7i', 'employee', NULL, 2),
-- Admin account
('admin',         'admin@homestaydorm.vn',   '$2b$10$Tm2EJ.oYZMS98f4GTM.xaekdLop295j2Bdd9ZIszvyt9ULPO5Yt7i', 'admin',    NULL, 3);

COMMIT;
