-- =============================================================
--  Flex-Stays Hotel Management System — Seed Data
--  Run AFTER schema.sql
-- =============================================================

USE flexstays;

-- =============================================================
-- STAFF  (passwords are BCrypt hashes of the plain text shown)
--   admin123       → $2a$12$LqZk3vIhNe0v2f8P1JRBFu...
--   All shown hashes are placeholders — replace with real BCrypt
--   hashes in production. The comment shows the plain password.
-- =============================================================
INSERT INTO staff (first_name, last_name, email, password_hash, role, status) VALUES
-- password: admin123
('System',   'Admin',       'admin@flexstays.com',        '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'ADMIN',        'ACTIVE'),
-- password: reception123
('Front',    'Desk',        'reception@flexstays.com',    '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'RECEPTION',    'ACTIVE'),
-- password: housekeeping123
('Chief',    'Housekeeper', 'housekeeping@flexstays.com', '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'HOUSEKEEPING', 'ACTIVE'),
-- password: maintenance123
('Lead',     'Technician',  'maintenance@flexstays.com',  '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MAINTENANCE',  'ACTIVE'),
-- password: manager123
('General',  'Manager',     'manager@flexstays.com',      '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MANAGER',      'ACTIVE');

-- =============================================================
-- USERS (sample guests)
--   password for all: guest123
-- =============================================================
INSERT INTO users (first_name, last_name, email, password_hash, phone, role) VALUES
('Aarav',   'Sharma',  'aarav.sharma@gmail.com',   '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '+91-9876543210', 'GUEST'),
('Priya',   'Nair',    'priya.nair@yahoo.com',     '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '+91-9123456789', 'GUEST'),
('Rahul',   'Mehta',   'rahul.mehta@outlook.com',  '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '+91-9988776655', 'GUEST'),
('Kavya',   'Reddy',   'kavya.reddy@gmail.com',    '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '+91-8877665544', 'GUEST'),
('Sanjay',  'Iyer',    'sanjay.iyer@gmail.com',    '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '+91-7766554433', 'GUEST'),
('Meera',   'Krishna', 'meera.krishna@gmail.com',  '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '+91-6655443322', 'GUEST'),
('Arjun',   'Patel',   'arjun.patel@gmail.com',    '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '+91-5544332211', 'GUEST'),
('Divya',   'Rao',     'divya.rao@yahoo.com',      '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '+91-9090909090', 'GUEST'),
('Vineeth', 'Kumar',   'vineeth@gmail.com',         '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '+91-8080808080', 'GUEST'),
('Lakshmi', 'Devi',    'lakshmi.devi@gmail.com',   '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '+91-7070707070', 'GUEST');

-- =============================================================
-- ROOMS — 40 rooms across 4 categories, 4 floors
-- =============================================================

-- Floor 1 : Standard Rooms 101–112
INSERT INTO rooms (room_number, floor, category, name, price_per_night, max_guests, amenities, status, housekeeping) VALUES
('101', 1, 'STANDARD', 'Standard Garden View',   3200, 2, '["WiFi","AC","TV","Tea/Coffee","Safe"]', 'OCCUPIED',    'CLEAN'),
('102', 1, 'STANDARD', 'Standard Garden View',   3200, 2, '["WiFi","AC","TV","Tea/Coffee","Safe"]', 'OCCUPIED',    'CLEAN'),
('103', 1, 'STANDARD', 'Standard Pool View',     3400, 2, '["WiFi","AC","TV","Mini Bar","Safe"]',   'OCCUPIED',    'CLEAN'),
('104', 1, 'STANDARD', 'Standard Pool View',     3400, 2, '["WiFi","AC","TV","Mini Bar","Safe"]',   'AVAILABLE',   'DIRTY'),
('105', 1, 'STANDARD', 'Standard Garden View',   3200, 2, '["WiFi","AC","TV","Tea/Coffee","Safe"]', 'AVAILABLE',   'CLEANING'),
('106', 1, 'STANDARD', 'Standard Garden View',   3200, 2, '["WiFi","AC","TV","Tea/Coffee","Safe"]', 'AVAILABLE',   'CLEANING'),
('107', 1, 'STANDARD', 'Standard Twin',          3000, 2, '["WiFi","AC","TV","Tea/Coffee"]',        'AVAILABLE',   'CLEAN'),
('108', 1, 'STANDARD', 'Standard Twin',          3000, 2, '["WiFi","AC","TV","Tea/Coffee"]',        'AVAILABLE',   'CLEAN'),
('109', 1, 'STANDARD', 'Standard Double',        3100, 2, '["WiFi","AC","TV","Safe"]',              'AVAILABLE',   'CLEAN'),
('110', 1, 'STANDARD', 'Standard Double',        3100, 2, '["WiFi","AC","TV","Safe"]',              'AVAILABLE',   'CLEAN'),
('111', 1, 'STANDARD', 'Standard Garden View',   3200, 2, '["WiFi","AC","TV","Tea/Coffee","Safe"]', 'AVAILABLE',   'CLEAN'),
('112', 1, 'STANDARD', 'Standard Garden View',   3200, 2, '["WiFi","AC","TV","Tea/Coffee","Safe"]', 'AVAILABLE',   'CLEAN');

-- Floor 2 : Deluxe Rooms 201–212
INSERT INTO rooms (room_number, floor, category, name, price_per_night, max_guests, amenities, status, housekeeping) VALUES
('201', 2, 'DELUXE', 'Deluxe Ocean Suite',    6500, 2, '["WiFi","AC","TV","Mini Bar","Balcony","Ocean View","Bathtub","Safe"]', 'OCCUPIED',    'CLEAN'),
('202', 2, 'DELUXE', 'Deluxe Ocean Suite',    6500, 2, '["WiFi","AC","TV","Mini Bar","Balcony","Ocean View","Bathtub","Safe"]', 'OCCUPIED',    'CLEAN'),
('203', 2, 'DELUXE', 'Deluxe King Room',      5800, 2, '["WiFi","AC","TV","Mini Bar","Balcony","Safe"]',                        'OCCUPIED',    'CLEAN'),
('204', 2, 'DELUXE', 'Deluxe King Room',      5800, 2, '["WiFi","AC","TV","Mini Bar","Balcony","Safe"]',                        'OCCUPIED',    'CLEAN'),
('205', 2, 'DELUXE', 'Deluxe Garden Suite',   5500, 3, '["WiFi","AC","TV","Mini Bar","Garden View","Safe"]',                   'OCCUPIED',    'CLEAN'),
('206', 2, 'DELUXE', 'Deluxe Garden Suite',   5500, 3, '["WiFi","AC","TV","Mini Bar","Garden View","Safe"]',                   'AVAILABLE',   'DIRTY'),
('207', 2, 'DELUXE', 'Deluxe Pool View',      6000, 2, '["WiFi","AC","TV","Mini Bar","Pool View","Bathtub"]',                  'AVAILABLE',   'DIRTY'),
('208', 2, 'DELUXE', 'Deluxe Pool View',      6000, 2, '["WiFi","AC","TV","Mini Bar","Pool View","Bathtub"]',                  'MAINTENANCE', 'CLEAN'),
('209', 2, 'DELUXE', 'Deluxe Twin Suite',     5200, 2, '["WiFi","AC","TV","Mini Bar","Safe"]',                                 'AVAILABLE',   'CLEAN'),
('210', 2, 'DELUXE', 'Deluxe Twin Suite',     5200, 2, '["WiFi","AC","TV","Mini Bar","Safe"]',                                 'AVAILABLE',   'CLEAN'),
('211', 2, 'DELUXE', 'Deluxe Corner Room',    6200, 2, '["WiFi","AC","TV","Mini Bar","Corner View","Safe"]',                   'AVAILABLE',   'CLEAN'),
('212', 2, 'DELUXE', 'Deluxe Corner Room',    6200, 2, '["WiFi","AC","TV","Mini Bar","Corner View","Safe"]',                   'AVAILABLE',   'CLEAN');

-- Floor 3 : Executive Suites 301–310
INSERT INTO rooms (room_number, floor, category, name, price_per_night, max_guests, amenities, status, housekeeping) VALUES
('301', 3, 'EXECUTIVE_SUITE', 'Executive Lounge Suite',  9500, 3, '["WiFi","AC","Smart TV","Mini Bar","Living Area","Work Desk","Espresso","Balcony"]', 'OCCUPIED',    'CLEAN'),
('302', 3, 'EXECUTIVE_SUITE', 'Executive Sky Suite',     9500, 3, '["WiFi","AC","Smart TV","Mini Bar","Living Area","City View","Bathtub","Shower"]',   'OCCUPIED',    'CLEAN'),
('303', 3, 'EXECUTIVE_SUITE', 'Executive Ocean Suite',  10500, 3, '["WiFi","AC","Smart TV","Mini Bar","Panoramic Ocean View","Private Balcony"]',       'OCCUPIED',    'CLEAN'),
('304', 3, 'EXECUTIVE_SUITE', 'Executive Garden Suite',  9000, 3, '["WiFi","AC","Smart TV","Mini Bar","Garden View","Work Desk","Espresso"]',           'OCCUPIED',    'CLEAN'),
('305', 3, 'EXECUTIVE_SUITE', 'Executive Premier Suite', 9800, 3, '["WiFi","AC","Smart TV","Mini Bar","Living Room","Dining Area","Jacuzzi"]',          'OCCUPIED',    'CLEAN'),
('306', 3, 'EXECUTIVE_SUITE', 'Executive Deluxe Suite',  9500, 3, '["WiFi","AC","Smart TV","Mini Bar","Balcony","Bathtub"]',                            'AVAILABLE',   'DIRTY'),
('307', 3, 'EXECUTIVE_SUITE', 'Executive Twin Suite',    8800, 4, '["WiFi","AC","Smart TV","Mini Bar","Twin Beds","Sofa Area"]',                        'AVAILABLE',   'DIRTY'),
('308', 3, 'EXECUTIVE_SUITE', 'Executive Corner Suite',  9200, 3, '["WiFi","AC","Smart TV","Mini Bar","Corner Panoramic View","Bathtub"]',              'MAINTENANCE', 'CLEAN'),
('309', 3, 'EXECUTIVE_SUITE', 'Executive Classic Suite', 9000, 3, '["WiFi","AC","Smart TV","Mini Bar","Classic Décor","Private Lounge"]',               'AVAILABLE',   'CLEAN'),
('310', 3, 'EXECUTIVE_SUITE', 'Executive Studio Suite',  8500, 2, '["WiFi","AC","Smart TV","Mini Bar","Studio Layout","Kitchenette"]',                  'AVAILABLE',   'CLEAN');

-- Floor 4 : Presidential Suites 401–406
INSERT INTO rooms (room_number, floor, category, name, price_per_night, max_guests, amenities, status, housekeeping) VALUES
('401', 4, 'PRESIDENTIAL_SUITE', 'Presidential Ocean Suite',  18000, 4, '["WiFi","AC","Smart TV x3","Full Bar","Ocean View","Private Pool","Butler","Jacuzzi","Dining Room"]', 'OCCUPIED', 'CLEAN'),
('402', 4, 'PRESIDENTIAL_SUITE', 'Presidential Sky Penthouse',20000, 4, '["WiFi","AC","Smart TV x4","Full Bar","360° City View","Rooftop Terrace","Butler","Hot Tub"]',        'OCCUPIED', 'CLEAN'),
('403', 4, 'PRESIDENTIAL_SUITE', 'Royal Heritage Suite',      22000, 6, '["WiFi","AC","Smart TV x5","Full Bar","Heritage Décor","Private Pool","Butler","Wine Cellar"]',       'OCCUPIED', 'CLEAN'),
('404', 4, 'PRESIDENTIAL_SUITE', 'Presidential Garden Villa', 16500, 4, '["WiFi","AC","Smart TV x2","Full Bar","Private Garden","Pool","Butler","BBQ Area"]',                  'OCCUPIED', 'CLEAN'),
('405', 4, 'PRESIDENTIAL_SUITE', 'Presidential Penthouse',    19000, 4, '["WiFi","AC","Smart TV x3","Full Bar","Penthouse View","Private Rooftop","Butler"]',                  'OCCUPIED', 'CLEAN'),
('406', 4, 'PRESIDENTIAL_SUITE', 'Imperial Grand Suite',      24000, 8, '["WiFi","AC","Smart TV x6","Full Bar","Grand Hall","Pool","Private Chef","Cinema Room"]',             'AVAILABLE','CLEAN');

-- =============================================================
-- PACKAGES
-- =============================================================
INSERT INTO packages (name, slug, description, inclusions, price, duration_nights, category) VALUES
('Honeymoon Escape',        'honeymoon-escape',       'Romantic getaway with rose petals, candlelit dinner, and couples spa',
 '["Deluxe Room (2N)","Candlelit Dinner","Couples Spa","Rose Petal Turndown","Breakfast","Late Checkout"]', 12000, 2, 'Romance'),

('Family Getaway',          'family-getaway',          'Fun-filled family package with activities for all ages',
 '["Executive Suite (3N)","Breakfast x4","Kids Club Access","Pool Passes","Adventure Activities","Airport Transfer"]', 18000, 3, 'Family'),

('Wellness Spa Retreat',    'wellness-spa-retreat',    '3-night holistic wellness programme with daily spa sessions',
 '["Deluxe Room (3N)","Daily Spa Session","Yoga Class","Detox Meals","Meditation","Ayurvedic Consultation"]', 22000, 3, 'Wellness'),

('Corporate Excellence',    'corporate-excellence',    'Productivity-focused business package with meeting facilities',
 '["Executive Suite (2N)","Conference Room (4hrs)","Business Breakfast","Airport Transfer","High-Speed WiFi","Laundry"]', 15000, 2, 'Business'),

('Weekend Escape',          'weekend-escape',           'Short weekend break with dining and leisure',
 '["Standard Room (2N)","Welcome Drinks","Dinner for 2","Swimming Pool Access","Late Checkout"]', 7500, 2, 'Leisure'),

('Luxury All-Inclusive',    'luxury-all-inclusive',    'The ultimate luxury experience — everything included',
 '["Presidential Suite (3N)","All Meals","Premium Bar","Spa Access","Airport Transfer","Butler Service","Yacht Tour"]', 65000, 3, 'Luxury'),

('Adventure & Thrill',      'adventure-thrill',        'Action-packed package for the thrill seekers',
 '["Standard Room (3N)","Breakfast","Scuba Diving","Parasailing","Hiking","Bonfire Night"]', 14000, 3, 'Adventure'),

('Birthday Celebration',    'birthday-celebration',    'Make birthdays unforgettable with surprise setup and cake',
 '["Deluxe Room (2N)","Cake & Decorations","Birthday Dinner","Spa Voucher","Personalized Photo Album"]', 9500, 2, 'Celebration');

-- =============================================================
-- BOOKINGS  (12 sample bookings — mix of statuses)
-- =============================================================
INSERT INTO bookings
    (booking_ref, user_id, room_id, check_in, check_out, nights, adult_count, room_price, taxes, total_amount, status, checked_in_at)
VALUES
('BK-2026-0001', 1,  13, '2026-06-18', '2026-06-21', 3, 2, 19500.00, 3510.00, 23010.00, 'CHECKED_IN',  '2026-06-18 14:00:00'),
('BK-2026-0002', 2,  1,  '2026-06-15', '2026-06-17', 2, 1,  6400.00, 1152.00,  7552.00, 'CHECKED_OUT', '2026-06-15 13:00:00'),
('BK-2026-0003', 3,  25, '2026-06-20', '2026-06-23', 3, 2, 28500.00, 5130.00, 33630.00, 'CHECKED_IN',  '2026-06-20 15:00:00'),
('BK-2026-0004', 4,  13, '2026-06-22', '2026-06-24', 2, 2, 19000.00, 3420.00, 22420.00, 'CONFIRMED',   NULL),
('BK-2026-0005', 5,  37, '2026-06-19', '2026-06-22', 3, 4, 54000.00, 9720.00, 63720.00, 'CHECKED_IN',  '2026-06-19 12:00:00'),
('BK-2026-0006', 6,  7,  '2026-06-16', '2026-06-18', 2, 2,  6000.00, 1080.00,  7080.00, 'CHECKED_OUT', '2026-06-16 14:30:00'),
('BK-2026-0007', 7,  14, '2026-06-21', '2026-06-25', 4, 2, 26000.00, 4680.00, 30680.00, 'CONFIRMED',   NULL),
('BK-2026-0008', 8,  29, '2026-06-17', '2026-06-20', 3, 3, 28500.00, 5130.00, 33630.00, 'CHECKED_IN',  '2026-06-17 16:00:00'),
('BK-2026-0009', 9,  38, '2026-06-14', '2026-06-17', 3, 2, 57000.00,10260.00, 67260.00, 'CHECKED_OUT', '2026-06-14 13:00:00'),
('BK-2026-0010', 10, 3,  '2026-06-20', '2026-06-22', 2, 2,  6800.00, 1224.00,  8024.00, 'CHECKED_IN',  '2026-06-20 14:00:00'),
('BK-2026-0011', 1,  26, '2026-06-23', '2026-06-26', 3, 2, 17400.00, 3132.00, 20532.00, 'CONFIRMED',   NULL),
('BK-2026-0012', 2,  4,  '2026-06-10', '2026-06-12', 2, 1,  6800.00, 1224.00,  8024.00, 'CANCELLED',   NULL);

-- =============================================================
-- PAYMENTS
-- =============================================================
INSERT INTO payments
    (booking_id, razorpay_order_id, razorpay_payment_id, amount, method, status, paid_at)
VALUES
(1,  'order_ABC001', 'pay_XYZ001', 23010.00, 'UPI',         'CAPTURED',  '2026-06-18 14:05:00'),
(2,  'order_ABC002', 'pay_XYZ002',  7552.00, 'CARD',         'CAPTURED',  '2026-06-15 13:10:00'),
(3,  'order_ABC003', 'pay_XYZ003', 33630.00, 'NET_BANKING',  'CAPTURED',  '2026-06-20 15:08:00'),
(4,  'order_ABC004', NULL,         22420.00, 'OTHER',         'PENDING',   NULL),
(5,  'order_ABC005', 'pay_XYZ005', 63720.00, 'CARD',         'CAPTURED',  '2026-06-19 12:05:00'),
(6,  'order_ABC006', 'pay_XYZ006',  7080.00, 'UPI',          'CAPTURED',  '2026-06-16 14:35:00'),
(7,  'order_ABC007', NULL,         30680.00, 'OTHER',         'PENDING',   NULL),
(8,  'order_ABC008', 'pay_XYZ008', 33630.00, 'WALLET',       'CAPTURED',  '2026-06-17 16:10:00'),
(9,  'order_ABC009', 'pay_XYZ009', 67260.00, 'CARD',         'CAPTURED',  '2026-06-14 13:05:00'),
(10, 'order_ABC010', 'pay_XYZ010',  8024.00, 'UPI',          'CAPTURED',  '2026-06-20 14:08:00'),
(11, 'order_ABC011', NULL,         20532.00, 'OTHER',         'PENDING',   NULL),
(12, 'order_ABC012', 'pay_XYZ012',  8024.00, 'UPI',          'REFUNDED',  '2026-06-10 11:00:00');

-- =============================================================
-- EVENTS
-- =============================================================
INSERT INTO events
    (event_ref, user_id, event_type, event_date, guest_count, budget_tier, venue_preference, status, approved_by, approved_at, estimated_cost)
VALUES
('EVT-2026-0001', 5, 'WEDDING',       '2026-07-10', 200, 'LUXURY',   'Grand Ballroom',      'APPROVED', 5, '2026-06-20 10:00:00', 450000.00),
('EVT-2026-0002', 3, 'CORPORATE',     '2026-07-15', 150, 'PREMIUM',  'Conference Centre',   'APPROVED', 5, '2026-06-21 11:00:00', 180000.00),
('EVT-2026-0003', 7, 'BIRTHDAY',      '2026-07-20',  80, 'STANDARD', 'Rooftop Terrace',     'PENDING',  NULL, NULL, NULL),
('EVT-2026-0004', 9, 'VIP_GATHERING', '2026-07-22',  30, 'LUXURY',   'Presidential Lounge', 'APPROVED', 5, '2026-06-22 09:00:00', 85000.00),
('EVT-2026-0005', 5, 'WEDDING',       '2026-08-01', 300, 'PREMIUM',  'Beachfront Lawn',     'REJECTED', 5, NULL, NULL),
('EVT-2026-0006', 2, 'CORPORATE',     '2026-08-05', 120, 'STANDARD', 'Seminar Hall',        'PENDING',  NULL, NULL, NULL),
('EVT-2026-0007', 7, 'ANNIVERSARY',   '2026-08-10',  50, 'PREMIUM',  'Azure Rooftop',       'APPROVED', 5, '2026-06-23 14:00:00', 65000.00),
('EVT-2026-0008', 1, 'VIP_GATHERING', '2026-08-15',  25, 'LUXURY',   'Presidential Suite',  'PENDING',  NULL, NULL, NULL);

-- =============================================================
-- DINING RESERVATIONS
-- =============================================================
INSERT INTO dining_reservations
    (reservation_ref, user_id, restaurant_name, reservation_date, reservation_time, guest_count, status)
VALUES
('DR-2026-0001', 1, 'Azure Rooftop',      '2026-06-25', '19:30:00', 2, 'CONFIRMED'),
('DR-2026-0002', 2, 'The Grand Terrace',  '2026-06-25', '20:00:00', 4, 'CONFIRMED'),
('DR-2026-0003', 3, 'Azure Rooftop',      '2026-06-26', '13:00:00', 3, 'CONFIRMED'),
('DR-2026-0004', 4, 'Silk Road Bistro',   '2026-06-26', '20:30:00', 2, 'PENDING'),
('DR-2026-0005', 5, 'The Grand Terrace',  '2026-06-27', '19:00:00', 6, 'CONFIRMED'),
('DR-2026-0006', 6, 'Azure Rooftop',      '2026-06-28', '21:00:00', 2, 'CONFIRMED');

-- =============================================================
-- MAINTENANCE REQUESTS
-- =============================================================
INSERT INTO maintenance_requests
    (ticket_ref, room_id, reported_by, assigned_to, issue_type, priority, title, description, status, affects_availability)
VALUES
('MNT-2026-0001', 20, 2, 4, 'PLUMBING',    'HIGH',   'Leaking AC condensation pipe',      'Water dripping from AC unit in Room 208',    'IN_PROGRESS', TRUE),
('MNT-2026-0002', 32, 2, 4, 'ELECTRICAL',  'MEDIUM', 'Bathroom light flickering',         'Light flickers intermittently in Room 308',  'OPEN',        TRUE),
('MNT-2026-0003', 1,  2, 4, 'FURNITURE',   'LOW',    'Wardrobe door hinge loose',         'Hinge on wardrobe door in Room 101 is loose','RESOLVED',    FALSE),
('MNT-2026-0004', 7,  3, 4, 'HVAC',        'MEDIUM', 'AC not cooling properly',           'Room 107 AC temperature inconsistent',       'OPEN',        FALSE),
('MNT-2026-0005', 25, 2, 4, 'PLUMBING',    'CRITICAL','Shower drain blocked',             'Shower drain completely blocked in Room 301', 'RESOLVED',   FALSE);

-- =============================================================
-- NOTIFICATIONS
-- =============================================================
INSERT INTO notifications (title, message, type, target_roles, ref_id, ref_type) VALUES
('Guest Checked In',        'Aarav Sharma checked into Room 201 (BK-2026-0001)',           'BOOKING',        'ADMIN,RECEPTION,MANAGER',                    1,  'booking'),
('Guest Checked Out',       'Priya Nair checked out from Room 101 (BK-2026-0002)',          'CHECKOUT',       'ADMIN,RECEPTION,HOUSEKEEPING,MANAGER',       2,  'booking'),
('Room 104 Marked Dirty',   'Room 104 housekeeping status set to DIRTY after checkout',    'HOUSEKEEPING',   'ADMIN,HOUSEKEEPING',                         NULL, NULL),
('New Wedding Request',     'Sanjay Iyer submitted a Wedding event for 200 guests',        'EVENT',          'ADMIN,MANAGER',                              1,  'event'),
('Maintenance Ticket Open', 'Critical: Shower drain blocked in Room 301',                  'MAINTENANCE',    'ADMIN,MAINTENANCE,MANAGER',                  5,  'maintenance'),
('Payment Received',        'Payment ₹23,010 captured for Booking BK-2026-0001',           'PAYMENT',        'ADMIN,MANAGER',                              1,  'payment'),
('Event Approved',          'Wedding event EVT-2026-0001 approved by Manager',             'EVENT',          'ADMIN,MANAGER',                              1,  'event'),
('Housekeeping Complete',   'Room 305 cleaning completed — status set to CLEAN',           'HOUSEKEEPING',   'ADMIN,RECEPTION,HOUSEKEEPING',               NULL, NULL),
('New Corporate Booking',   'Rahul Mehta booked Presidential Suite for ₹33,630',           'BOOKING',        'ADMIN,RECEPTION,MANAGER',                    3,  'booking'),
('Dining Reserved',         'Table reserved at Azure Rooftop for 2 guests on 25-Jun',      'DINING',         'ADMIN,MANAGER',                              1,  'dining');

-- =============================================================
-- AUDIT LOGS
-- =============================================================
INSERT INTO audit_logs (operator_id, operator_email, module, action, details) VALUES
(2, 'reception@flexstays.com',    'BOOKING',       'Checked in guest Aarav Sharma — Room 201',              '{"bookingId":1,"roomNumber":"201","guestEmail":"aarav.sharma@gmail.com"}'),
(2, 'reception@flexstays.com',    'BOOKING',       'Checked out guest Priya Nair — Room 101',               '{"bookingId":2,"roomNumber":"101","guestEmail":"priya.nair@yahoo.com"}'),
(3, 'housekeeping@flexstays.com', 'HOUSEKEEPING',  'Started cleaning Room 105',                             '{"roomNumber":"105","previousStatus":"DIRTY"}'),
(3, 'housekeeping@flexstays.com', 'HOUSEKEEPING',  'Completed cleaning Room 106 — status set to CLEAN',     '{"roomNumber":"106","newStatus":"CLEAN"}'),
(4, 'maintenance@flexstays.com',  'MAINTENANCE',   'Created ticket MNT-2026-0001: Leaking AC pipe Room 208','{"ticketId":1,"roomNumber":"208","priority":"HIGH"}'),
(4, 'maintenance@flexstays.com',  'MAINTENANCE',   'Resolved ticket MNT-2026-0003: Wardrobe hinge Room 101','{"ticketId":3,"resolution":"Hinge replaced"}'),
(5, 'manager@flexstays.com',      'EVENT',         'Approved Wedding event EVT-2026-0001 by Sanjay Iyer',   '{"eventId":1,"eventType":"WEDDING","guestCount":200}'),
(5, 'manager@flexstays.com',      'EVENT',         'Rejected Wedding event EVT-2026-0005',                  '{"eventId":5,"reason":"Venue unavailable on requested date"}'),
(1, 'admin@flexstays.com',        'STAFF',         'Added new staff account: chef@flexstays.com',           '{"email":"chef@flexstays.com","role":"RECEPTION"}'),
(1, 'admin@flexstays.com',        'STAFF',         'Reset password for: housekeeping@flexstays.com',        '{"email":"housekeeping@flexstays.com"}'),
(2, 'reception@flexstays.com',    'ROOM',          'Allocated Room 301 to booking BK-2026-0003',            '{"bookingId":3,"roomNumber":"301","guestId":3}'),
(3, 'housekeeping@flexstays.com', 'HOUSEKEEPING',  'Marked Room 104 as DIRTY',                              '{"roomNumber":"104","newHousekeeping":"DIRTY"}'),
(5, 'manager@flexstays.com',      'EVENT',         'Approved Anniversary event EVT-2026-0007',              '{"eventId":7,"eventType":"ANNIVERSARY","estimatedCost":65000}'),
(2, 'reception@flexstays.com',    'BOOKING',       'Processed walk-in booking for Vineeth Kumar',           '{"guestId":9,"roomNumber":"402"}'),
(1, 'admin@flexstays.com',        'SYSTEM',        'System backup initiated',                               '{"backupType":"full","trigger":"scheduled"}'),
(4, 'maintenance@flexstays.com',  'MAINTENANCE',   'Resolved drain blockage in Room 301',                   '{"ticketId":5,"resolution":"Drain cleared"}'),
(3, 'housekeeping@flexstays.com', 'HOUSEKEEPING',  'Lost & Found — Wallet found in Room 203',               '{"roomNumber":"203","item":"Black Wallet"}'),
(5, 'manager@flexstays.com',      'SYSTEM',        'Generated Monthly Revenue Report — June 2026',          '{"reportType":"revenue","month":"2026-06"}'),
(2, 'reception@flexstays.com',    'BOOKING',       'Cancelled booking BK-2026-0012 — Refund initiated',     '{"bookingId":12,"refundAmount":8024}'),
(1, 'admin@flexstays.com',        'SYSTEM',        'Cleared old notification queue (>30 days)',              '{"deletedCount":45}');
