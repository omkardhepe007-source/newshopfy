-- ============================================================
-- ShopEasy Database Schema
-- Run this to manually set up tables (JPA auto-creates them too)
-- ============================================================

CREATE DATABASE IF NOT EXISTS shopeasy_db;
USE shopeasy_db;

-- ========================
-- TABLE: roles
-- ========================
CREATE TABLE IF NOT EXISTS roles (
    id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
);

-- ========================
-- TABLE: users
-- ========================
CREATE TABLE IF NOT EXISTS users (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name      VARCHAR(100)        NOT NULL,
    email          VARCHAR(100)        NOT NULL UNIQUE,
    password       VARCHAR(255)        NOT NULL,
    mobile_number  VARCHAR(15),
    address        TEXT,
    active         BOOLEAN             NOT NULL DEFAULT TRUE,
    created_at     DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================
-- TABLE: user_roles (join table)
-- ========================
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- ========================
-- TABLE: products
-- ========================
CREATE TABLE IF NOT EXISTS products (
    id          BIGINT         AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(200)   NOT NULL,
    description TEXT,
    category    VARCHAR(100)   NOT NULL,
    price       DECIMAL(10,2)  NOT NULL,
    stock       INT            NOT NULL DEFAULT 0,
    image_url   VARCHAR(500),
    active      BOOLEAN        NOT NULL DEFAULT TRUE,
    created_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================
-- TABLE: carts
-- ========================
CREATE TABLE IF NOT EXISTS carts (
    id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ========================
-- TABLE: cart_items
-- ========================
CREATE TABLE IF NOT EXISTS cart_items (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id    BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity   INT    NOT NULL DEFAULT 1,
    FOREIGN KEY (cart_id)    REFERENCES carts(id)    ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ========================
-- TABLE: orders
-- ========================
CREATE TABLE IF NOT EXISTS orders (
    id               BIGINT         AUTO_INCREMENT PRIMARY KEY,
    user_id          BIGINT         NOT NULL,
    total_amount     DECIMAL(10,2)  NOT NULL,
    status           VARCHAR(20)    NOT NULL DEFAULT 'PENDING',
    shipping_address TEXT,
    created_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ========================
-- TABLE: order_items
-- ========================
CREATE TABLE IF NOT EXISTS order_items (
    id            BIGINT         AUTO_INCREMENT PRIMARY KEY,
    order_id      BIGINT         NOT NULL,
    product_id    BIGINT,
    product_name  VARCHAR(200)   NOT NULL,
    product_price DECIMAL(10,2)  NOT NULL,
    quantity      INT            NOT NULL,
    FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- ========================
-- SEED DATA
-- ========================
INSERT IGNORE INTO roles (name) VALUES ('ROLE_CUSTOMER'), ('ROLE_ADMIN');

-- Seed sample products (optional)
INSERT IGNORE INTO products (name, description, category, price, stock, image_url) VALUES
('iPhone 15 Pro', 'Latest Apple flagship with titanium design', 'Electronics', 129999.00, 50, 'https://picsum.photos/seed/iphone/400/300'),
('Samsung Galaxy S24', 'Premium Android experience with AI features', 'Electronics', 89999.00, 35, 'https://picsum.photos/seed/samsung/400/300'),
('Nike Air Max 270', 'Comfortable running shoes with Air cushioning', 'Footwear', 8999.00, 100, 'https://picsum.photos/seed/nike/400/300'),
('Levis 511 Slim Jeans', 'Classic slim-fit denim in dark wash', 'Clothing', 3999.00, 80, 'https://picsum.photos/seed/levis/400/300'),
('Sony WH-1000XM5', 'Industry-leading noise cancelling headphones', 'Electronics', 29999.00, 25, 'https://picsum.photos/seed/sony/400/300'),
('The Alchemist', 'Paulo Coelho bestselling novel', 'Books', 299.00, 200, 'https://picsum.photos/seed/book/400/300'),
('Yoga Mat Premium', 'Non-slip 6mm thick exercise mat', 'Sports', 1299.00, 60, 'https://picsum.photos/seed/yoga/400/300'),
('Coffee Maker Deluxe', '12-cup programmable coffee maker', 'Home & Kitchen', 4999.00, 30, 'https://picsum.photos/seed/coffee/400/300');
