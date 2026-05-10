-- ============================================================
-- HomeStay Dorm - Dữ liệu mẫu (Tiếng Việt)
-- Chạy SAU schema.sql
-- Có thể chạy nhiều lần (dùng ID cố định + ON CONFLICT DO NOTHING)
-- Lưu ý: các giá trị enum/bị ràng buộc (gender_policy, rental_type, method, status...)
-- vẫn giữ tiếng Anh để đúng CHECK constraint và logic backend.
-- ============================================================

BEGIN;

-- -----------------------------------------------------------------
-- Chi nhánh
-- -----------------------------------------------------------------
INSERT INTO branch (branch_id, address) VALUES
  (1, 'TP.HCM - Quận 1'),
  (2, 'TP.HCM - TP. Thủ Đức'),
  (3, 'TP.HCM - Quận 7')
ON CONFLICT (branch_id) DO NOTHING;

-- -----------------------------------------------------------------
-- Loại phòng
-- -----------------------------------------------------------------
INSERT INTO room_type (room_type_id, name) VALUES
  (1, 'Tiêu chuẩn'),
  (2, 'Cao cấp'),
  (3, 'Ký túc xá')
ON CONFLICT (room_type_id) DO NOTHING;

-- -----------------------------------------------------------------
-- Dịch vụ
-- -----------------------------------------------------------------
INSERT INTO service (service_id, name, price) VALUES
  (1, 'Giặt ủi', 10000),
  (2, 'Gửi xe', 50000),
  (3, 'Vệ sinh phòng', 80000),
  (4, 'Wifi', 30000)
ON CONFLICT (service_id) DO NOTHING;

-- -----------------------------------------------------------------
-- Nội quy (mỗi chi nhánh có thể khác nhau)
-- -----------------------------------------------------------------
INSERT INTO regulation (regulation_id, description, category, branch_id) VALUES
  (1, 'Không gây ồn sau 22:00', 'Giờ giấc', 1),
  (2, 'Không hút thuốc trong phòng', 'An toàn', 1),
  (3, 'Giữ vệ sinh khu vực chung', 'Vệ sinh', 2)
ON CONFLICT (regulation_id) DO NOTHING;

-- -----------------------------------------------------------------
-- Nhân viên
-- role IN ('sale', 'accountant', 'manager')
-- -----------------------------------------------------------------
INSERT INTO employee (employee_id, name, salary, role, branch_id) VALUES
  (1, 'Nguyễn Minh Sale', 12000000, 'sale', 1),
  (2, 'Trần Hải Kế toán', 15000000, 'accountant', 1),
  (3, 'Lê Anh Quản lý', 20000000, 'manager', 1),
  (4, 'Phạm Thu Sale', 12500000, 'sale', 2),
  (5, 'Đặng Long Kế toán', 15500000, 'accountant', 2),
  (6, 'Võ Trang Quản lý', 21000000, 'manager', 2)
ON CONFLICT (employee_id) DO NOTHING;

INSERT INTO sale_employee (employee_id, target_quota) VALUES
  (1, 50000000),
  (4, 60000000)
ON CONFLICT (employee_id) DO NOTHING;

INSERT INTO accountant (employee_id) VALUES
  (2),
  (5)
ON CONFLICT (employee_id) DO NOTHING;

INSERT INTO manager (employee_id, appointment_date) VALUES
  (3, '2025-01-01'),
  (6, '2025-06-01')
ON CONFLICT (employee_id) DO NOTHING;

-- -----------------------------------------------------------------
-- Khách thuê
-- -----------------------------------------------------------------
INSERT INTO tenant (tenant_id, name, phone, email, gender, nationality) VALUES
  (1, 'Nguyễn Văn A', '0900000001', 'a@example.com', 'Male', 'Vietnam'),
  (2, 'Trần Thị B', '0900000002', 'b@example.com', 'Female', 'Vietnam'),
  (3, 'John Doe', '0900000003', 'john@example.com', 'Male', 'USA'),
  (4, 'Lê Thị C', '0900000004', 'c@example.com', 'Female', 'Vietnam'),
  (5, 'Ngô Văn D', '0900000005', 'd@example.com', 'Male', 'Vietnam')
ON CONFLICT (tenant_id) DO NOTHING;

-- -----------------------------------------------------------------
-- Nhóm khách thuê
-- -----------------------------------------------------------------
INSERT INTO tenant_group (tenant_group_id, quantity, representative_tenant_id) VALUES
  (1, 2, 1),
  (2, 3, 2)
ON CONFLICT (tenant_group_id) DO NOTHING;

INSERT INTO tenant_group_member (tenant_group_id, tenant_id) VALUES
  (1, 1),
  (1, 2),
  (2, 2),
  (2, 4),
  (2, 5)
ON CONFLICT (tenant_group_id, tenant_id) DO NOTHING;

-- -----------------------------------------------------------------
-- Tiêu chí thuê
-- -----------------------------------------------------------------
INSERT INTO rental_criteria (criteria_id, name) VALUES
  (1, 'Không hút thuốc'),
  (2, 'Không nuôi thú cưng'),
  (3, 'Ưu tiên phòng yên tĩnh'),
  (4, 'Gần thang máy')
ON CONFLICT (criteria_id) DO NOTHING;

-- -----------------------------------------------------------------
-- Phòng và giường
-- gender_policy IN ('Male','Female','Mixed')
-- -----------------------------------------------------------------
INSERT INTO room (room_id, gender_policy, total_beds, available_beds, status, area, room_type_id, branch_id) VALUES
  (1, 'Mixed', 2, 0, 'Full', 'A', 1, 1),
  (2, 'Female', 2, 1, 'Available', 'B', 2, 1),
  (3, 'Male', 3, 1, 'Available', 'C', 3, 2),
  (4, 'Mixed', 4, 4, 'Available', 'D', 1, 2)
ON CONFLICT (room_id) DO NOTHING;

INSERT INTO bed (bed_id, status, price, room_id) VALUES
  (1, 'Occupied', 2500000, 1),
  (2, 'Occupied', 2500000, 1),
  (3, 'Reserved', 3000000, 2),
  (4, 'Empty',    3000000, 2),
  (5, 'Occupied', 2200000, 3),
  (6, 'Occupied', 2200000, 3),
  (7, 'Empty',    2200000, 3),
  (8, 'Empty',    2800000, 4),
  (9, 'Empty',    2800000, 4),
  (10, 'Empty',   2800000, 4),
  (11, 'Empty',   2800000, 4)
ON CONFLICT (bed_id) DO NOTHING;

-- -----------------------------------------------------------------
-- Yêu cầu đăng ký + tiêu chí + lịch hẹn xem phòng
-- rental_type IN ('Whole Room','Shared Room')
-- -----------------------------------------------------------------
INSERT INTO registration_request (
  registration_request_id,
  gender_policy,
  area,
  room_type_id,
  price_level,
  expected_date,
  duration,
  rental_type,
  status,
  tenant_id,
  sales_employee_id,
  number_of_people,
  created_at
) VALUES (
  1,
  'Mixed',
  'A',
  1,
  3000000,
  '2026-04-10',
  '6 tháng',
  'Shared Room',
  'New',
  1,
  1,
  2,
  NOW()
)
ON CONFLICT (registration_request_id) DO NOTHING;

INSERT INTO registration_request (
  registration_request_id,
  gender_policy,
  area,
  room_type_id,
  price_level,
  expected_date,
  duration,
  rental_type,
  status,
  tenant_id,
  sales_employee_id,
  number_of_people,
  created_at
) VALUES (
  2,
  'Female',
  'B',
  2,
  3500000,
  '2026-04-15',
  '12 tháng',
  'Shared Room',
  'Deposited',
  2,
  1,
  1,
  NOW() - INTERVAL '3 days'
)
ON CONFLICT (registration_request_id) DO NOTHING;

INSERT INTO registration_request (
  registration_request_id,
  gender_policy,
  area,
  room_type_id,
  price_level,
  expected_date,
  duration,
  rental_type,
  status,
  tenant_id,
  sales_employee_id,
  number_of_people,
  created_at
) VALUES (
  3,
  'Male',
  'C',
  3,
  2500000,
  '2026-04-20',
  '3 tháng',
  'Shared Room',
  'New',
  5,
  4,
  2,
  NOW() - INTERVAL '1 day'
)
ON CONFLICT (registration_request_id) DO NOTHING;

INSERT INTO registration_request_criteria (registration_request_id, criteria_id, value) VALUES
  (1, 1, 'Bắt buộc'),
  (1, 2, 'Ưu tiên'),
  (2, 3, 'Ưu tiên'),
  (3, 4, 'Bắt buộc')
ON CONFLICT (registration_request_id, criteria_id) DO NOTHING;

INSERT INTO viewing_appointment (
  appointment_id,
  appointment_time,
  status,
  confirmation_status,
  appointment_type,
  registration_request_id,
  sales_employee_id
) VALUES (
  1,
  NOW() + INTERVAL '2 days',
  'Pending Confirmation',
  'Unconfirmed',
  'Trực tiếp',
  1,
  1
)
ON CONFLICT (appointment_id) DO NOTHING;

INSERT INTO viewing_appointment (
  appointment_id,
  appointment_time,
  status,
  confirmation_status,
  appointment_type,
  registration_request_id,
  sales_employee_id
) VALUES (
  2,
  NOW() + INTERVAL '1 day',
  'Confirmed',
  'Confirmed',
  'Gọi video',
  3,
  4
)
ON CONFLICT (appointment_id) DO NOTHING;

-- -----------------------------------------------------------------
-- Phiếu cọc + thanh toán
-- -----------------------------------------------------------------
INSERT INTO deposit_receipt (
  deposit_receipt_id,
  note,
  created_at,
  status,
  tenant_id,
  sales_employee_id,
  manager_id,
  payment_deadline,
  total_deposit
) VALUES (
  1,
  'Đặt cọc cho 2 giường',
  NOW() - INTERVAL '1 day',
  'Paid',
  1,
  1,
  3,
  NOW() + INTERVAL '23 hours',
  10000000
)
ON CONFLICT (deposit_receipt_id) DO NOTHING;

INSERT INTO deposit_receipt (
  deposit_receipt_id,
  note,
  created_at,
  status,
  tenant_id,
  sales_employee_id,
  manager_id,
  payment_deadline,
  total_deposit
) VALUES (
  2,
  'Đặt cọc cho 1 giường (chờ thanh toán)',
  NOW(),
  'Pending Payment',
  2,
  1,
  3,
  NOW() + INTERVAL '20 hours',
  6000000
)
ON CONFLICT (deposit_receipt_id) DO NOTHING;

INSERT INTO deposit_receipt (
  deposit_receipt_id,
  note,
  created_at,
  status,
  tenant_id,
  sales_employee_id,
  manager_id,
  payment_deadline,
  total_deposit
) VALUES (
  3,
  'Phiếu cọc đã hủy (demo)',
  NOW() - INTERVAL '10 days',
  'Cancelled',
  3,
  4,
  6,
  NOW() - INTERVAL '9 days',
  5600000
)
ON CONFLICT (deposit_receipt_id) DO NOTHING;

INSERT INTO deposit_receipt (
  deposit_receipt_id,
  note,
  created_at,
  status,
  tenant_id,
  sales_employee_id,
  manager_id,
  payment_deadline,
  total_deposit
) VALUES (
  4,
  'Đặt cọc cho 2 giường (đã thanh toán)',
  NOW() - INTERVAL '5 days',
  'Paid',
  2,
  4,
  6,
  NOW() + INTERVAL '5 hours',
  8800000
)
ON CONFLICT (deposit_receipt_id) DO NOTHING;

INSERT INTO deposit_receipt_bed (deposit_receipt_id, bed_id) VALUES
  (1, 1),
  (1, 2),
  (2, 3),
  (3, 9),
  (4, 5),
  (4, 6)
ON CONFLICT (deposit_receipt_id, bed_id) DO NOTHING;

INSERT INTO payment (
  payment_id,
  note,
  amount,
  method,
  status,
  created_at,
  tenant_id,
  deposit_receipt_id,
  contract_id
) VALUES (
  1,
  'Thanh toán đặt cọc - Phiếu 1',
  10000000,
  'Cash',
  'Paid',
  NOW() - INTERVAL '1 day',
  1,
  1,
  NULL
)
ON CONFLICT (payment_id) DO NOTHING;

INSERT INTO payment (
  payment_id,
  note,
  amount,
  method,
  status,
  created_at,
  tenant_id,
  deposit_receipt_id,
  contract_id
) VALUES (
  2,
  'Thanh toán đặt cọc - Phiếu 4',
  8800000,
  'Bank Transfer',
  'Paid',
  NOW() - INTERVAL '5 days',
  2,
  4,
  NULL
)
ON CONFLICT (payment_id) DO NOTHING;

INSERT INTO payment (
  payment_id,
  note,
  amount,
  method,
  status,
  created_at,
  tenant_id,
  deposit_receipt_id,
  contract_id
) VALUES (
  3,
  'Thanh toán đặt cọc - Phiếu 2 (chờ)',
  6000000,
  'Bank Transfer',
  'Pending Payment',
  NOW(),
  2,
  2,
  NULL
)
ON CONFLICT (payment_id) DO NOTHING;

-- -----------------------------------------------------------------
-- Hợp đồng + giường + dịch vụ + biên bản
-- -----------------------------------------------------------------
INSERT INTO contract (
  contract_id,
  created_at,
  bed_count,
  bed_price,
  document_proof,
  confirmation_status,
  rental_type,
  tenant_id,
  deposit_receipt_id,
  room_id,
  employee_id,
  start_date,
  end_date
) VALUES (
  1,
  NOW() - INTERVAL '1 day',
  2,
  2500000,
  'chung-tu-demo',
  'Confirmed',
  'Shared Room',
  1,
  1,
  1,
  1,
  '2026-04-01',
  '2026-10-01'
)
ON CONFLICT (contract_id) DO NOTHING;

INSERT INTO contract (
  contract_id,
  created_at,
  bed_count,
  bed_price,
  document_proof,
  confirmation_status,
  rental_type,
  tenant_id,
  deposit_receipt_id,
  room_id,
  employee_id,
  start_date,
  end_date
) VALUES (
  2,
  NOW() - INTERVAL '5 days',
  2,
  2200000,
  'chung-tu-demo-2',
  'Confirmed',
  'Shared Room',
  2,
  4,
  3,
  4,
  '2026-03-15',
  '2026-09-15'
)
ON CONFLICT (contract_id) DO NOTHING;

-- Hợp đồng đã kết thúc (demo trả phòng)
INSERT INTO contract (
  contract_id,
  created_at,
  bed_count,
  bed_price,
  document_proof,
  confirmation_status,
  rental_type,
  tenant_id,
  deposit_receipt_id,
  room_id,
  employee_id,
  start_date,
  end_date
) VALUES (
  3,
  NOW() - INTERVAL '200 days',
  1,
  2800000,
  'chung-tu-cu',
  'Terminated',
  'Shared Room',
  3,
  NULL,
  4,
  1,
  '2025-01-01',
  '2025-07-01'
)
ON CONFLICT (contract_id) DO NOTHING;

INSERT INTO contract_bed (contract_id, bed_id) VALUES
  (1, 1),
  (1, 2),
  (2, 5),
  (2, 6),
  (3, 11)
ON CONFLICT (contract_id, bed_id) DO NOTHING;

INSERT INTO contract_service (contract_id, service_id) VALUES
  (1, 1),
  (1, 4),
  (2, 2),
  (2, 4)
ON CONFLICT (contract_id, service_id) DO NOTHING;

INSERT INTO record (record_id, created_at, note, contract_id, type) VALUES
  (1, NOW() - INTERVAL '12 hours', 'Biên bản bàn giao phòng/giường', 1, 'Handover')
ON CONFLICT (record_id) DO NOTHING;

INSERT INTO record (record_id, created_at, note, contract_id, type) VALUES
  (2, NOW() - INTERVAL '4 days', 'Biên bản bàn giao (hợp đồng 2)', 2, 'Handover')
ON CONFLICT (record_id) DO NOTHING;

INSERT INTO record (record_id, created_at, note, contract_id, type) VALUES
  (3, NOW() - INTERVAL '180 days', 'Biên bản trả phòng (demo)', 3, 'Check-out')
ON CONFLICT (record_id) DO NOTHING;

-- -----------------------------------------------------------------
-- (Tuỳ chọn) Ví dụ phiếu hoàn cọc (trạng thái vẫn Pending)
-- -----------------------------------------------------------------
INSERT INTO refund_receipt (
  refund_receipt_id,
  type,
  details,
  created_at,
  refund_amount,
  deduction_amount,
  additional_amount_due,
  deposit_receipt_id,
  contract_id,
  accountant_id,
  status
) VALUES (
  1,
  'Hoàn cọc dài hạn (>= 6 tháng)',
  '{"seed":"vi-du"}',
  NOW(),
  8000000,
  0,
  0,
  1,
  1,
  2,
  'Pending'
)
ON CONFLICT (refund_receipt_id) DO NOTHING;

INSERT INTO refund_receipt (
  refund_receipt_id,
  type,
  details,
  created_at,
  refund_amount,
  deduction_amount,
  additional_amount_due,
  deposit_receipt_id,
  contract_id,
  accountant_id,
  status
) VALUES (
  2,
  'Hoàn cọc (demo đã hoàn tất)',
  '{"seed":"hoan-tat"}',
  NOW() - INTERVAL '180 days',
  5000000,
  300000,
  0,
  NULL,
  3,
  2,
  'Completed'
)
ON CONFLICT (refund_receipt_id) DO NOTHING;

-- -----------------------------------------------------------------
-- Đồng bộ lại số giường tổng / giường trống theo bảng bed
-- -----------------------------------------------------------------
UPDATE room r
SET
  total_beds = x.total_beds,
  available_beds = x.available_beds,
  status = CASE WHEN x.available_beds > 0 THEN 'Available' ELSE 'Full' END
FROM (
  SELECT
    room_id,
    COUNT(*) AS total_beds,
    SUM(CASE WHEN status = 'Empty' THEN 1 ELSE 0 END) AS available_beds
  FROM bed
  GROUP BY room_id
) x
WHERE r.room_id = x.room_id;

-- -----------------------------------------------------------------
-- Đồng bộ sequence (SERIAL) theo ID đã seed
-- -----------------------------------------------------------------
SELECT setval(pg_get_serial_sequence('branch', 'branch_id'), COALESCE((SELECT MAX(branch_id) FROM branch), 1), true);
SELECT setval(pg_get_serial_sequence('regulation', 'regulation_id'), COALESCE((SELECT MAX(regulation_id) FROM regulation), 1), true);
SELECT setval(pg_get_serial_sequence('room_type', 'room_type_id'), COALESCE((SELECT MAX(room_type_id) FROM room_type), 1), true);
SELECT setval(pg_get_serial_sequence('service', 'service_id'), COALESCE((SELECT MAX(service_id) FROM service), 1), true);
SELECT setval(pg_get_serial_sequence('room', 'room_id'), COALESCE((SELECT MAX(room_id) FROM room), 1), true);
SELECT setval(pg_get_serial_sequence('bed', 'bed_id'), COALESCE((SELECT MAX(bed_id) FROM bed), 1), true);
SELECT setval(pg_get_serial_sequence('employee', 'employee_id'), COALESCE((SELECT MAX(employee_id) FROM employee), 1), true);
SELECT setval(pg_get_serial_sequence('tenant', 'tenant_id'), COALESCE((SELECT MAX(tenant_id) FROM tenant), 1), true);
SELECT setval(pg_get_serial_sequence('tenant_group', 'tenant_group_id'), COALESCE((SELECT MAX(tenant_group_id) FROM tenant_group), 1), true);
SELECT setval(pg_get_serial_sequence('rental_criteria', 'criteria_id'), COALESCE((SELECT MAX(criteria_id) FROM rental_criteria), 1), true);
SELECT setval(pg_get_serial_sequence('registration_request', 'registration_request_id'), COALESCE((SELECT MAX(registration_request_id) FROM registration_request), 1), true);
SELECT setval(pg_get_serial_sequence('viewing_appointment', 'appointment_id'), COALESCE((SELECT MAX(appointment_id) FROM viewing_appointment), 1), true);
SELECT setval(pg_get_serial_sequence('deposit_receipt', 'deposit_receipt_id'), COALESCE((SELECT MAX(deposit_receipt_id) FROM deposit_receipt), 1), true);
SELECT setval(pg_get_serial_sequence('contract', 'contract_id'), COALESCE((SELECT MAX(contract_id) FROM contract), 1), true);
SELECT setval(pg_get_serial_sequence('payment', 'payment_id'), COALESCE((SELECT MAX(payment_id) FROM payment), 1), true);
SELECT setval(pg_get_serial_sequence('record', 'record_id'), COALESCE((SELECT MAX(record_id) FROM record), 1), true);
SELECT setval(pg_get_serial_sequence('refund_receipt', 'refund_receipt_id'), COALESCE((SELECT MAX(refund_receipt_id) FROM refund_receipt), 1), true);

-- -----------------------------------------------------------------
-- Tài khoản đăng nhập (Auth)
-- Password gốc:  admin → admin123 | nhân viên → nv123 | khách → kh123 | luno → luno123
-- -----------------------------------------------------------------
INSERT INTO account (account_id, username, password_hash, role, employee_id, tenant_id) VALUES
  (1, 'admin',        '$2b$10$McGojPlhA1gTiFRh79kil.OiFaW9vAV78fKRCnB/5.alogYHpq9cu', 'admin',    NULL, NULL),
  (2, 'luno',         '$2b$10$BP.KmIh9s/pU0ZlOYg501eRSOKx5hnZCQoQZedDHvMi0oqZRcS5je', 'admin',    NULL, NULL),
  (3, 'sale01',       '$2b$10$eg3uG5j2sdaIPRoyAQJzgOZq69l9IqQiCpTth94/ckdtRmVcgBSCq', 'employee', 1,    NULL),
  (4, 'accountant01', '$2b$10$ehkI2FX.V4h0HepubMScXu7.8ByJo/jIhv/eR71HpyFj85ERcztNK', 'employee', 2,    NULL),
  (5, 'manager01',    '$2b$10$PPYsvWcGsfwjIq4pp.PfJe8CrstAE4VSXainPzOJWJ9jXoYeHReNS',  'employee', 3,    NULL),
  (6, 'manager02',    '$2b$10$1nQnz8OAPQDgwN01D2uXOe3sjjfDi8cXkBwtU2O0Re/OEWp1Ma/jm', 'employee', 6,    NULL),
  (7, 'khach01',      '$2b$10$Tu.fUYz2XZPpBlFDtdWNle5hV0LLgES3GzFq0J/LyQHVq7aT6nGnG', 'customer', NULL, 1)
ON CONFLICT (account_id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('account', 'account_id'), COALESCE((SELECT MAX(account_id) FROM account), 1), true);

COMMIT;
