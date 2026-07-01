-- =============================================================
--  Flex-Stays Hotel Management System — MySQL Schema
--  Version : 1.0
--  Engine  : InnoDB | Charset: utf8mb4
-- =============================================================

CREATE DATABASE IF NOT EXISTS flexstays
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE flexstays;

-- =============================================================
-- TABLE 1 : users
--   Stores all guest accounts (email / Google OAuth)
-- =============================================================
CREATE TABLE IF NOT EXISTS users (
    id              BIGINT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    google_id       VARCHAR(128)    UNIQUE,
    first_name      VARCHAR(80)     NOT NULL,
    last_name       VARCHAR(80),
    email           VARCHAR(180)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255),                          -- NULL for Google-only accounts
    avatar_url      VARCHAR(500),
    phone           VARCHAR(20),
    role            ENUM('GUEST')   NOT NULL DEFAULT 'GUEST',
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_users_email  (email),
    INDEX idx_users_google (google_id)
) ENGINE=InnoDB;

-- =============================================================
-- TABLE 2 : staff
--   Stores all employee accounts (Admin, Reception, etc.)
-- =============================================================
CREATE TABLE IF NOT EXISTS staff (
    id              BIGINT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name      VARCHAR(80)     NOT NULL,
    last_name       VARCHAR(80),
    email           VARCHAR(180)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    role            ENUM('ADMIN','RECEPTION','HOUSEKEEPING','MAINTENANCE','MANAGER')
                                    NOT NULL,
    status          ENUM('ACTIVE','DEACTIVATED','ON_LEAVE')
                                    NOT NULL DEFAULT 'ACTIVE',
    last_login_at   DATETIME,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_staff_email (email),
    INDEX idx_staff_role  (role)
) ENGINE=InnoDB;

-- =============================================================
-- TABLE 3 : rooms
--   Hotel room inventory with category and pricing
-- =============================================================
CREATE TABLE IF NOT EXISTS rooms (
    id              BIGINT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    room_number     VARCHAR(10)     NOT NULL UNIQUE,
    floor           TINYINT         NOT NULL,
    category        ENUM('STANDARD','DELUXE','EXECUTIVE_SUITE','PRESIDENTIAL_SUITE')
                                    NOT NULL,
    name            VARCHAR(120)    NOT NULL,
    description     TEXT,
    price_per_night DECIMAL(10,2)   NOT NULL,
    max_guests      TINYINT         NOT NULL DEFAULT 2,
    amenities       JSON,                                  -- ["WiFi","AC","Sea View",...]
    image_url       VARCHAR(500),
    status          ENUM('AVAILABLE','OCCUPIED','MAINTENANCE','OUT_OF_ORDER')
                                    NOT NULL DEFAULT 'AVAILABLE',
    housekeeping    ENUM('CLEAN','DIRTY','CLEANING')
                                    NOT NULL DEFAULT 'CLEAN',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_rooms_status   (status),
    INDEX idx_rooms_category (category)
) ENGINE=InnoDB;

-- =============================================================
-- TABLE 4 : packages
--   Curated stay + experience bundles
-- =============================================================
CREATE TABLE IF NOT EXISTS packages (
    id              BIGINT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(150)    NOT NULL,
    slug            VARCHAR(150)    NOT NULL UNIQUE,
    description     TEXT,
    inclusions      JSON,                                  -- ["Breakfast","Spa","Airport Transfer",...]
    price           DECIMAL(10,2)   NOT NULL,
    duration_nights TINYINT         NOT NULL DEFAULT 1,
    category        VARCHAR(80),
    image_url       VARCHAR(500),
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_packages_active (is_active)
) ENGINE=InnoDB;

-- =============================================================
-- TABLE 5 : bookings
--   Core reservation record linking users ↔ rooms
-- =============================================================
CREATE TABLE IF NOT EXISTS bookings (
    id              BIGINT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_ref     VARCHAR(20)     NOT NULL UNIQUE,       -- e.g. BK-2024-0001
    user_id         BIGINT          UNSIGNED NOT NULL,
    room_id         BIGINT          UNSIGNED NOT NULL,
    package_id      BIGINT          UNSIGNED,              -- optional package add-on
    check_in        DATE            NOT NULL,
    check_out       DATE            NOT NULL,
    nights          SMALLINT        NOT NULL,
    adult_count     TINYINT         NOT NULL DEFAULT 1,
    child_count     TINYINT         NOT NULL DEFAULT 0,
    room_price      DECIMAL(10,2)   NOT NULL,
    package_price   DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    taxes           DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    total_amount    DECIMAL(10,2)   NOT NULL,
    special_requests TEXT,
    status          ENUM('CONFIRMED','CHECKED_IN','CHECKED_OUT','CANCELLED','NO_SHOW')
                                    NOT NULL DEFAULT 'CONFIRMED',
    checked_in_at   DATETIME,
    checked_out_at  DATETIME,
    cancelled_at    DATETIME,
    allocated_by    BIGINT          UNSIGNED,              -- staff.id (reception)
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_bookings_user     FOREIGN KEY (user_id)       REFERENCES users   (id) ON DELETE RESTRICT,
    CONSTRAINT fk_bookings_room     FOREIGN KEY (room_id)       REFERENCES rooms   (id) ON DELETE RESTRICT,
    CONSTRAINT fk_bookings_package  FOREIGN KEY (package_id)    REFERENCES packages(id) ON DELETE SET NULL,
    CONSTRAINT fk_bookings_staff    FOREIGN KEY (allocated_by)  REFERENCES staff   (id) ON DELETE SET NULL,

    INDEX idx_bookings_user     (user_id),
    INDEX idx_bookings_room     (room_id),
    INDEX idx_bookings_status   (status),
    INDEX idx_bookings_checkin  (check_in),
    INDEX idx_bookings_checkout (check_out)
) ENGINE=InnoDB;

-- =============================================================
-- TABLE 6 : payments
--   Razorpay transaction records linked to bookings
-- =============================================================
CREATE TABLE IF NOT EXISTS payments (
    id                  BIGINT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id          BIGINT          UNSIGNED NOT NULL UNIQUE,
    razorpay_order_id   VARCHAR(120)    UNIQUE,
    razorpay_payment_id VARCHAR(120)    UNIQUE,
    razorpay_signature  VARCHAR(256),
    amount              DECIMAL(10,2)   NOT NULL,
    currency            VARCHAR(5)      NOT NULL DEFAULT 'INR',
    method              ENUM('UPI','CARD','NET_BANKING','WALLET','EMI','CASH','OTHER')
                                        NOT NULL DEFAULT 'OTHER',
    status              ENUM('PENDING','CAPTURED','FAILED','REFUNDED','PARTIALLY_REFUNDED')
                                        NOT NULL DEFAULT 'PENDING',
    refund_amount       DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    refund_id           VARCHAR(120),
    paid_at             DATETIME,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,

    INDEX idx_payments_booking (booking_id),
    INDEX idx_payments_status  (status)
) ENGINE=InnoDB;

-- =============================================================
-- TABLE 7 : events
--   Wedding, Corporate, Birthday & VIP event proposals
-- =============================================================
CREATE TABLE IF NOT EXISTS events (
    id              BIGINT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    event_ref       VARCHAR(20)     NOT NULL UNIQUE,       -- EVT-2024-0001
    user_id         BIGINT          UNSIGNED NOT NULL,
    event_type      ENUM('WEDDING','CORPORATE','BIRTHDAY','VIP_GATHERING','ANNIVERSARY','OTHER')
                                    NOT NULL,
    event_date      DATE            NOT NULL,
    guest_count     SMALLINT        NOT NULL,
    budget_tier     ENUM('STANDARD','PREMIUM','LUXURY')
                                    NOT NULL DEFAULT 'STANDARD',
    venue_preference VARCHAR(120),
    special_notes   TEXT,
    status          ENUM('PENDING','APPROVED','REJECTED','COMPLETED','CANCELLED')
                                    NOT NULL DEFAULT 'PENDING',
    approved_by     BIGINT          UNSIGNED,              -- staff.id (manager)
    approved_at     DATETIME,
    rejection_reason VARCHAR(255),
    estimated_cost  DECIMAL(10,2),
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_events_user     FOREIGN KEY (user_id)     REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_events_approver FOREIGN KEY (approved_by) REFERENCES staff (id) ON DELETE SET NULL,

    INDEX idx_events_user   (user_id),
    INDEX idx_events_status (status),
    INDEX idx_events_date   (event_date)
) ENGINE=InnoDB;

-- =============================================================
-- TABLE 8 : dining_reservations
--   Restaurant table bookings
-- =============================================================
CREATE TABLE IF NOT EXISTS dining_reservations (
    id              BIGINT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    reservation_ref VARCHAR(20)     NOT NULL UNIQUE,       -- DR-2024-0001
    user_id         BIGINT          UNSIGNED NOT NULL,
    restaurant_name VARCHAR(120)    NOT NULL,
    reservation_date DATE           NOT NULL,
    reservation_time TIME           NOT NULL,
    guest_count     TINYINT         NOT NULL DEFAULT 1,
    special_requests TEXT,
    status          ENUM('PENDING','CONFIRMED','SEATED','COMPLETED','CANCELLED','NO_SHOW')
                                    NOT NULL DEFAULT 'CONFIRMED',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_dining_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_dining_user   (user_id),
    INDEX idx_dining_date   (reservation_date),
    INDEX idx_dining_status (status)
) ENGINE=InnoDB;

-- =============================================================
-- TABLE 9 : maintenance_requests
--   Room maintenance tickets with priority & assignment
-- =============================================================
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id              BIGINT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ticket_ref      VARCHAR(20)     NOT NULL UNIQUE,       -- MNT-2024-0001
    room_id         BIGINT          UNSIGNED NOT NULL,
    reported_by     BIGINT          UNSIGNED NOT NULL,     -- staff.id
    assigned_to     BIGINT          UNSIGNED,              -- staff.id (maintenance)
    issue_type      ENUM('PLUMBING','ELECTRICAL','HVAC','FURNITURE','CLEANING','PEST','OTHER')
                                    NOT NULL DEFAULT 'OTHER',
    priority        ENUM('LOW','MEDIUM','HIGH','CRITICAL')
                                    NOT NULL DEFAULT 'MEDIUM',
    title           VARCHAR(200)    NOT NULL,
    description     TEXT,
    status          ENUM('OPEN','IN_PROGRESS','RESOLVED','CLOSED','DEFERRED')
                                    NOT NULL DEFAULT 'OPEN',
    affects_availability BOOLEAN    NOT NULL DEFAULT FALSE,
    resolved_at     DATETIME,
    resolution_notes TEXT,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_mnt_room     FOREIGN KEY (room_id)     REFERENCES rooms (id) ON DELETE CASCADE,
    CONSTRAINT fk_mnt_reporter FOREIGN KEY (reported_by) REFERENCES staff (id) ON DELETE RESTRICT,
    CONSTRAINT fk_mnt_assignee FOREIGN KEY (assigned_to) REFERENCES staff (id) ON DELETE SET NULL,

    INDEX idx_mnt_room     (room_id),
    INDEX idx_mnt_status   (status),
    INDEX idx_mnt_priority (priority),
    INDEX idx_mnt_assignee (assigned_to)
) ENGINE=InnoDB;

-- =============================================================
-- TABLE 10 : notifications
--   System-wide alerts visible to specific roles
-- =============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id          BIGINT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(200)    NOT NULL,
    message     TEXT            NOT NULL,
    type        ENUM('BOOKING','CHECKOUT','HOUSEKEEPING','MAINTENANCE','EVENT','DINING','SYSTEM','PAYMENT')
                                NOT NULL DEFAULT 'SYSTEM',
    target_roles SET('GUEST','ADMIN','RECEPTION','HOUSEKEEPING','MAINTENANCE','MANAGER')
                                NOT NULL DEFAULT 'ADMIN,MANAGER',
    ref_id      BIGINT          UNSIGNED,                  -- optional linked record id
    ref_type    VARCHAR(40),                               -- 'booking', 'event', 'maintenance', ...
    is_read     BOOLEAN         NOT NULL DEFAULT FALSE,
    created_by  BIGINT          UNSIGNED,                  -- staff.id or NULL (system)
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notif_staff FOREIGN KEY (created_by) REFERENCES staff(id) ON DELETE SET NULL,

    INDEX idx_notif_roles (target_roles),
    INDEX idx_notif_type  (type),
    INDEX idx_notif_read  (is_read)
) ENGINE=InnoDB;

-- =============================================================
-- TABLE 11 : audit_logs
--   Immutable record of every operational action
-- =============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id          BIGINT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    operator_id BIGINT          UNSIGNED,                  -- staff.id (NULL = system/guest)
    operator_email VARCHAR(180),                           -- denormalised for display
    module      ENUM('AUTH','BOOKING','PAYMENT','ROOM','HOUSEKEEPING','MAINTENANCE','EVENT','DINING','STAFF','SYSTEM')
                                NOT NULL,
    action      VARCHAR(255)    NOT NULL,
    details     JSON,                                      -- {"bookingId":123,"roomNumber":"201"}
    ip_address  VARCHAR(45),
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_staff FOREIGN KEY (operator_id) REFERENCES staff(id) ON DELETE SET NULL,

    INDEX idx_audit_operator (operator_id),
    INDEX idx_audit_module   (module),
    INDEX idx_audit_created  (created_at)
) ENGINE=InnoDB;

-- =============================================================
-- VIEWS — convenience read models
-- =============================================================

-- Active bookings with guest and room info
CREATE OR REPLACE VIEW v_active_bookings AS
SELECT
    b.id,
    b.booking_ref,
    CONCAT(u.first_name, ' ', COALESCE(u.last_name,'')) AS guest_name,
    u.email                                               AS guest_email,
    r.room_number,
    r.category                                            AS room_category,
    r.name                                                AS room_name,
    b.check_in,
    b.check_out,
    b.nights,
    b.total_amount,
    b.status,
    b.created_at
FROM bookings b
JOIN users u ON u.id = b.user_id
JOIN rooms  r ON r.id = b.room_id
WHERE b.status NOT IN ('CANCELLED','NO_SHOW');

-- Revenue summary per day
CREATE OR REPLACE VIEW v_daily_revenue AS
SELECT
    DATE(p.paid_at)     AS revenue_date,
    COUNT(*)            AS transaction_count,
    SUM(p.amount)       AS total_revenue,
    SUM(p.refund_amount) AS total_refunds,
    SUM(p.amount - p.refund_amount) AS net_revenue
FROM payments p
WHERE p.status IN ('CAPTURED','PARTIALLY_REFUNDED')
GROUP BY DATE(p.paid_at);

-- Room occupancy status summary
CREATE OR REPLACE VIEW v_room_status AS
SELECT
    category,
    COUNT(*)                                          AS total,
    SUM(status = 'AVAILABLE')                         AS available,
    SUM(status = 'OCCUPIED')                          AS occupied,
    SUM(status = 'MAINTENANCE')                       AS maintenance,
    SUM(housekeeping = 'DIRTY')                       AS dirty,
    SUM(housekeeping = 'CLEANING')                    AS cleaning,
    ROUND(SUM(status='OCCUPIED')/COUNT(*)*100, 1)     AS occupancy_rate_pct
FROM rooms
GROUP BY category;
