-- ════════════════════════════════════════════════════════════════
--  LMS(KG) — Full Database Schema
--  Run this once against a fresh MySQL database named `lms_production`
--  (or whatever DB_NAME is set to in backend/.env)
-- ════════════════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS lms_production;
USE lms_production;

-- ── Core Users Table (one row per login account, any role) ───────
CREATE TABLE IF NOT EXISTS users (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    username        VARCHAR(100) NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    role            ENUM('SUPER_ADMIN','ADMIN','VENDOR','COLLEGE','MENTOR','STUDENT','ORGANIZATION') NOT NULL,
    status          ENUM('ACTIVE','DISABLED','LOCKED') NOT NULL DEFAULT 'ACTIVE',
    is_verified     TINYINT(1) NOT NULL DEFAULT 0,
    failed_attempts INT NOT NULL DEFAULT 0,
    lock_until      DATETIME NULL,
    created_by      INT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ── Admins (platform-level admins created by Super Admin) ────────
CREATE TABLE IF NOT EXISTS admins (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL UNIQUE,
    admin_name  VARCHAR(150) NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── Organizations (legacy/extra role, kept for compatibility) ────
CREATE TABLE IF NOT EXISTS organizations (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    user_id             INT NOT NULL UNIQUE,
    organization_name   VARCHAR(150) NOT NULL,
    org_code            VARCHAR(50) NOT NULL UNIQUE,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── Vendors ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vendors (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT NOT NULL UNIQUE,
    vendor_name  VARCHAR(150) NOT NULL,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── Colleges ───────────────────────────────────────────────────
-- user_id links to the COLLEGE login account (nullable for legacy rows
-- created before login support existed).
CREATE TABLE IF NOT EXISTS colleges (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT NULL UNIQUE,
    college_name  VARCHAR(200) NOT NULL,
    college_code  VARCHAR(50) NOT NULL UNIQUE,
    address       VARCHAR(255) NULL,
    email         VARCHAR(150) NULL,
    phone         VARCHAR(20) NULL,
    assigned_admin INT NULL,
    created_by    INT NULL,
    status        ENUM('ACTIVE','DISABLED') NOT NULL DEFAULT 'ACTIVE',
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_admin) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ── Vendor <-> College assignment (many-to-many) ──────────────
CREATE TABLE IF NOT EXISTS vendor_colleges (
    vendor_id    INT NOT NULL,
    college_id   INT NOT NULL,
    assigned_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (vendor_id, college_id),
    FOREIGN KEY (vendor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

-- ── Mentors (created by a College) ────────────────────────────
CREATE TABLE IF NOT EXISTS mentors (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT NOT NULL UNIQUE,
    mentor_name  VARCHAR(150) NOT NULL,
    mobile       VARCHAR(20) NULL,
    department   VARCHAR(100) NULL,
    college_id   INT NOT NULL,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

-- ── Students (self-registered) ────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT NOT NULL UNIQUE,
    roll_no       VARCHAR(50) NOT NULL,
    student_name  VARCHAR(150) NOT NULL,
    mobile        VARCHAR(20) NULL,
    college_id    INT NULL,
    course_id     INT NULL,
    year_id       INT NULL,
    semester_id   INT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE SET NULL
);

-- ── OTP verification (registration + forgot-password) ────────
CREATE TABLE IF NOT EXISTS otp_verification (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    email     VARCHAR(150) NOT NULL,
    otp       VARCHAR(10) NOT NULL,
    purpose   ENUM('REGISTER','FORGOT_PASSWORD') NOT NULL,
    is_used   TINYINT(1) NOT NULL DEFAULT 0,
    expiry    DATETIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email_purpose (email, purpose)
);

-- ════════════════════════════════════════════════════════════════
--  Seed: create the very first SUPER_ADMIN account
--  Email:    superadmin@lms.com
--  Password: SuperAdmin@123
--  (bcrypt hash below was generated with bcrypt cost 12 for that password)
-- ════════════════════════════════════════════════════════════════
INSERT INTO users (username, email, password, role, status, is_verified)
VALUES (
    'superadmin',
    'superadmin@lms.com',
    '$2b$12$RLVcaob1rAh3x0Jpsgiic.U4f1MoHfFOl.LYcQS6DBdc3qlX0roNa', -- bcrypt hash of "SuperAdmin@123"
    'SUPER_ADMIN',
    'ACTIVE',
    1
)
ON DUPLICATE KEY UPDATE email = email;

-- This hash was generated with: node -e "require('bcrypt').hash('SuperAdmin@123', 12).then(console.log)"
-- Login with: superadmin@lms.com / SuperAdmin@123
