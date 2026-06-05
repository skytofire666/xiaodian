const BASE_TABLES = [
  "store_info",
  "products",
  "cases",
  "orders",
  "bookings",
  "consultations",
];

const BUSINESS_TABLES = [
  "schema_migrations",
  "product_categories",
  "stores",
  "members",
  "member_addresses",
  "member_point_logs",
  "order_items",
  "order_payments",
  "order_logistics_tracks",
  "leads",
  "lead_follow_logs",
  "coupons",
  "member_coupons",
  "content_banners",
  "content_blocks",
  "agreements",
  "logistics_companies",
  "shipping_templates",
  "admin_roles",
  "admin_users",
  "system_settings",
  "payment_configs",
  "service_configs",
  "operation_logs",
];

const BASE_SCHEMA_STATEMENTS = [
  `
    CREATE TABLE IF NOT EXISTS store_info (
      id INT PRIMARY KEY,
      name VARCHAR(120) NOT NULL DEFAULT '',
      address VARCHAR(255) NOT NULL DEFAULT '',
      phone VARCHAR(80) NOT NULL DEFAULT '',
      hours VARCHAR(120) NOT NULL DEFAULT '',
      longitude DECIMAL(10,6) NULL,
      latitude DECIMAL(10,6) NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(80) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      type VARCHAR(80) NOT NULL DEFAULT '',
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      tags LONGTEXT NULL,
      material VARCHAR(255) NOT NULL DEFAULT '',
      specs VARCHAR(255) NOT NULL DEFAULT '',
      cycle VARCHAR(120) NOT NULL DEFAULT '',
      stock VARCHAR(120) NOT NULL DEFAULT '',
      tone VARCHAR(255) NOT NULL DEFAULT '',
      care VARCHAR(255) NOT NULL DEFAULT '',
      story TEXT NULL,
      thumb_x VARCHAR(20) NOT NULL DEFAULT '50%',
      thumb_y VARCHAR(20) NOT NULL DEFAULT '58%',
      active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS cases (
      id VARCHAR(80) PRIMARY KEY,
      title VARCHAR(160) NOT NULL,
      type VARCHAR(80) NOT NULL DEFAULT '',
      scene TEXT NULL,
      summary TEXT NULL,
      result TEXT NULL,
      product_ids LONGTEXT NULL,
      thumb_x VARCHAR(20) NOT NULL DEFAULT '50%',
      thumb_y VARCHAR(20) NOT NULL DEFAULT '50%',
      active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(80) PRIMARY KEY,
      status VARCHAR(40) NOT NULL DEFAULT '',
      product_name VARCHAR(160) NOT NULL DEFAULT '',
      product_id VARCHAR(80) NOT NULL DEFAULT '',
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      quantity INT NOT NULL DEFAULT 1,
      spec VARCHAR(255) NOT NULL DEFAULT '',
      order_no VARCHAR(80) NOT NULL DEFAULT '',
      logistics_no VARCHAR(120) NOT NULL DEFAULT '',
      carrier VARCHAR(120) NOT NULL DEFAULT '',
      created_at_text VARCHAR(40) NOT NULL DEFAULT '',
      paid_at VARCHAR(80) NOT NULL DEFAULT '',
      receiver VARCHAR(160) NOT NULL DEFAULT '',
      address VARCHAR(255) NOT NULL DEFAULT '',
      current_node VARCHAR(255) NOT NULL DEFAULT '',
      logistics LONGTEXT NULL,
      action VARCHAR(40) NOT NULL DEFAULT '',
      primary_order TINYINT(1) NOT NULL DEFAULT 0,
      thumb_x VARCHAR(20) NOT NULL DEFAULT '50%',
      thumb_y VARCHAR(20) NOT NULL DEFAULT '58%',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_order_no (order_no)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS bookings (
      id VARCHAR(80) PRIMARY KEY,
      type VARCHAR(80) NOT NULL DEFAULT '',
      time_text VARCHAR(120) NOT NULL DEFAULT '',
      note TEXT NULL,
      status VARCHAR(40) NOT NULL DEFAULT '',
      created_at_text VARCHAR(40) NOT NULL DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS consultations (
      id VARCHAR(80) PRIMARY KEY,
      product_id VARCHAR(80) NOT NULL DEFAULT '',
      topic VARCHAR(120) NOT NULL DEFAULT '',
      message TEXT NULL,
      contact VARCHAR(160) NOT NULL DEFAULT '',
      status VARCHAR(40) NOT NULL DEFAULT '',
      created_at_text VARCHAR(40) NOT NULL DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
];

const BUSINESS_SCHEMA_STATEMENTS = [
  `
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(80) PRIMARY KEY,
      description VARCHAR(255) NOT NULL DEFAULT '',
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS product_categories (
      id VARCHAR(80) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      parent_id VARCHAR(80) NULL,
      sort_order INT NOT NULL DEFAULT 0,
      status VARCHAR(40) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_product_categories_parent (parent_id),
      KEY idx_product_categories_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS stores (
      id VARCHAR(80) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      city VARCHAR(80) NOT NULL DEFAULT '',
      district VARCHAR(80) NOT NULL DEFAULT '',
      address VARCHAR(255) NOT NULL DEFAULT '',
      phone VARCHAR(80) NOT NULL DEFAULT '',
      manager_name VARCHAR(80) NOT NULL DEFAULT '',
      hours VARCHAR(120) NOT NULL DEFAULT '',
      longitude DECIMAL(10,6) NULL,
      latitude DECIMAL(10,6) NULL,
      cover_url VARCHAR(500) NOT NULL DEFAULT '',
      service_tags LONGTEXT NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'open',
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_stores_city (city),
      KEY idx_stores_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS members (
      id VARCHAR(80) PRIMARY KEY,
      openid VARCHAR(120) NULL,
      unionid VARCHAR(120) NULL,
      nickname VARCHAR(120) NOT NULL DEFAULT '',
      real_name VARCHAR(80) NOT NULL DEFAULT '',
      phone VARCHAR(40) NULL,
      avatar_url VARCHAR(500) NOT NULL DEFAULT '',
      level VARCHAR(40) NOT NULL DEFAULT 'normal',
      points INT NOT NULL DEFAULT 0,
      total_spend DECIMAL(12,2) NOT NULL DEFAULT 0,
      source VARCHAR(80) NOT NULL DEFAULT '',
      status VARCHAR(40) NOT NULL DEFAULT 'active',
      registered_at DATETIME NULL,
      last_login_at DATETIME NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uk_members_openid (openid),
      KEY idx_members_phone (phone),
      KEY idx_members_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS member_addresses (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      member_id VARCHAR(80) NOT NULL DEFAULT '',
      receiver_name VARCHAR(80) NOT NULL DEFAULT '',
      receiver_phone VARCHAR(40) NOT NULL DEFAULT '',
      province VARCHAR(80) NOT NULL DEFAULT '',
      city VARCHAR(80) NOT NULL DEFAULT '',
      district VARCHAR(80) NOT NULL DEFAULT '',
      address_detail VARCHAR(255) NOT NULL DEFAULT '',
      is_default TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_member_addresses_member (member_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS member_point_logs (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      member_id VARCHAR(80) NOT NULL DEFAULT '',
      change_points INT NOT NULL DEFAULT 0,
      balance_after INT NOT NULL DEFAULT 0,
      scene VARCHAR(80) NOT NULL DEFAULT '',
      source_id VARCHAR(120) NOT NULL DEFAULT '',
      description VARCHAR(255) NOT NULL DEFAULT '',
      operator_name VARCHAR(80) NOT NULL DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      KEY idx_member_point_logs_member (member_id),
      KEY idx_member_point_logs_scene (scene)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS order_items (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(80) NOT NULL,
      product_id VARCHAR(80) NOT NULL DEFAULT '',
      product_name VARCHAR(160) NOT NULL DEFAULT '',
      sku_id VARCHAR(80) NOT NULL DEFAULT '',
      sku_name VARCHAR(160) NOT NULL DEFAULT '',
      spec_text VARCHAR(255) NOT NULL DEFAULT '',
      unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
      quantity INT NOT NULL DEFAULT 1,
      subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      KEY idx_order_items_order (order_id),
      KEY idx_order_items_product (product_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS order_payments (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(80) NOT NULL,
      payment_no VARCHAR(120) NOT NULL DEFAULT '',
      method VARCHAR(40) NOT NULL DEFAULT '',
      amount DECIMAL(10,2) NOT NULL DEFAULT 0,
      status VARCHAR(40) NOT NULL DEFAULT '',
      paid_at DATETIME NULL,
      raw_response LONGTEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      KEY idx_order_payments_order (order_id),
      KEY idx_order_payments_no (payment_no)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS order_logistics_tracks (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(80) NOT NULL,
      carrier_code VARCHAR(80) NOT NULL DEFAULT '',
      carrier_name VARCHAR(120) NOT NULL DEFAULT '',
      logistics_no VARCHAR(120) NOT NULL DEFAULT '',
      node_status VARCHAR(80) NOT NULL DEFAULT '',
      node_text VARCHAR(255) NOT NULL DEFAULT '',
      event_time DATETIME NULL,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      KEY idx_order_logistics_order (order_id),
      KEY idx_order_logistics_no (logistics_no)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS leads (
      id VARCHAR(80) PRIMARY KEY,
      customer_name VARCHAR(80) NOT NULL DEFAULT '',
      phone VARCHAR(40) NOT NULL DEFAULT '',
      source VARCHAR(80) NOT NULL DEFAULT '',
      source_id VARCHAR(120) NOT NULL DEFAULT '',
      product_id VARCHAR(80) NOT NULL DEFAULT '',
      case_id VARCHAR(80) NOT NULL DEFAULT '',
      assigned_store_id VARCHAR(80) NOT NULL DEFAULT '',
      intention_level VARCHAR(40) NOT NULL DEFAULT '',
      status VARCHAR(40) NOT NULL DEFAULT 'pending',
      note TEXT NULL,
      last_follow_at DATETIME NULL,
      next_follow_at DATETIME NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_leads_phone (phone),
      KEY idx_leads_status (status),
      KEY idx_leads_store (assigned_store_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS lead_follow_logs (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      lead_id VARCHAR(80) NOT NULL,
      follow_type VARCHAR(40) NOT NULL DEFAULT '',
      content TEXT NULL,
      next_follow_at DATETIME NULL,
      operator_name VARCHAR(80) NOT NULL DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      KEY idx_lead_follow_logs_lead (lead_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS coupons (
      id VARCHAR(80) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      type VARCHAR(40) NOT NULL DEFAULT '',
      amount DECIMAL(10,2) NOT NULL DEFAULT 0,
      discount DECIMAL(5,2) NULL,
      threshold_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
      scope_type VARCHAR(40) NOT NULL DEFAULT 'all',
      scope_value LONGTEXT NULL,
      total_count INT NULL,
      received_count INT NOT NULL DEFAULT 0,
      used_count INT NOT NULL DEFAULT 0,
      per_user_limit INT NOT NULL DEFAULT 1,
      valid_from DATETIME NULL,
      valid_to DATETIME NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'draft',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_coupons_status (status),
      KEY idx_coupons_valid (valid_from, valid_to)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS member_coupons (
      id VARCHAR(80) PRIMARY KEY,
      coupon_id VARCHAR(80) NOT NULL,
      member_id VARCHAR(80) NOT NULL,
      code VARCHAR(120) NOT NULL DEFAULT '',
      status VARCHAR(40) NOT NULL DEFAULT 'unused',
      received_at DATETIME NULL,
      used_at DATETIME NULL,
      expires_at DATETIME NULL,
      order_id VARCHAR(80) NOT NULL DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      KEY idx_member_coupons_member (member_id),
      KEY idx_member_coupons_coupon (coupon_id),
      KEY idx_member_coupons_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS content_banners (
      id VARCHAR(80) PRIMARY KEY,
      position VARCHAR(80) NOT NULL DEFAULT 'home',
      title VARCHAR(160) NOT NULL DEFAULT '',
      subtitle VARCHAR(255) NOT NULL DEFAULT '',
      image_url VARCHAR(500) NOT NULL DEFAULT '',
      target_type VARCHAR(40) NOT NULL DEFAULT '',
      target_id VARCHAR(120) NOT NULL DEFAULT '',
      link_url VARCHAR(500) NOT NULL DEFAULT '',
      status VARCHAR(40) NOT NULL DEFAULT 'draft',
      sort_order INT NOT NULL DEFAULT 0,
      starts_at DATETIME NULL,
      ends_at DATETIME NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_content_banners_position (position),
      KEY idx_content_banners_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS content_blocks (
      id VARCHAR(80) PRIMARY KEY,
      block_key VARCHAR(120) NOT NULL DEFAULT '',
      title VARCHAR(160) NOT NULL DEFAULT '',
      subtitle VARCHAR(255) NOT NULL DEFAULT '',
      body_text TEXT NULL,
      image_url VARCHAR(500) NOT NULL DEFAULT '',
      content_json LONGTEXT NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'draft',
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_content_blocks_key (block_key),
      KEY idx_content_blocks_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS agreements (
      id VARCHAR(80) PRIMARY KEY,
      agreement_type VARCHAR(80) NOT NULL DEFAULT '',
      title VARCHAR(160) NOT NULL DEFAULT '',
      version VARCHAR(40) NOT NULL DEFAULT '',
      content LONGTEXT NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'draft',
      published_at DATETIME NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_agreements_type (agreement_type),
      KEY idx_agreements_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS logistics_companies (
      id VARCHAR(80) PRIMARY KEY,
      code VARCHAR(80) NOT NULL DEFAULT '',
      name VARCHAR(120) NOT NULL,
      contact_phone VARCHAR(80) NOT NULL DEFAULT '',
      config_json LONGTEXT NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'enabled',
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_logistics_companies_code (code),
      KEY idx_logistics_companies_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS shipping_templates (
      id VARCHAR(80) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      delivery_type VARCHAR(40) NOT NULL DEFAULT '',
      base_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
      free_threshold DECIMAL(10,2) NULL,
      rule_json LONGTEXT NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'enabled',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_shipping_templates_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS admin_roles (
      id VARCHAR(80) PRIMARY KEY,
      name VARCHAR(80) NOT NULL,
      permissions LONGTEXT NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'enabled',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS admin_users (
      id VARCHAR(80) PRIMARY KEY,
      username VARCHAR(80) NOT NULL,
      password_hash VARCHAR(255) NOT NULL DEFAULT '',
      display_name VARCHAR(80) NOT NULL DEFAULT '',
      role_id VARCHAR(80) NOT NULL DEFAULT '',
      status VARCHAR(40) NOT NULL DEFAULT 'enabled',
      last_login_at DATETIME NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uk_admin_users_username (username),
      KEY idx_admin_users_role (role_id),
      KEY idx_admin_users_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS system_settings (
      setting_key VARCHAR(120) PRIMARY KEY,
      setting_value LONGTEXT NULL,
      group_name VARCHAR(80) NOT NULL DEFAULT '',
      description VARCHAR(255) NOT NULL DEFAULT '',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_system_settings_group (group_name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS payment_configs (
      id VARCHAR(80) PRIMARY KEY,
      channel VARCHAR(80) NOT NULL DEFAULT '',
      merchant_id VARCHAR(120) NOT NULL DEFAULT '',
      app_id VARCHAR(120) NOT NULL DEFAULT '',
      config_json LONGTEXT NULL,
      enabled TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_payment_configs_channel (channel),
      KEY idx_payment_configs_enabled (enabled)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS service_configs (
      id VARCHAR(80) PRIMARY KEY,
      service_type VARCHAR(80) NOT NULL DEFAULT '',
      name VARCHAR(120) NOT NULL DEFAULT '',
      endpoint VARCHAR(500) NOT NULL DEFAULT '',
      config_json LONGTEXT NULL,
      enabled TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_service_configs_type (service_type),
      KEY idx_service_configs_enabled (enabled)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
  `
    CREATE TABLE IF NOT EXISTS operation_logs (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      admin_user_id VARCHAR(80) NOT NULL DEFAULT '',
      action VARCHAR(120) NOT NULL DEFAULT '',
      target_type VARCHAR(80) NOT NULL DEFAULT '',
      target_id VARCHAR(120) NOT NULL DEFAULT '',
      detail_json LONGTEXT NULL,
      ip_address VARCHAR(80) NOT NULL DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      KEY idx_operation_logs_admin (admin_user_id),
      KEY idx_operation_logs_target (target_type, target_id),
      KEY idx_operation_logs_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `,
];

const EXTRA_COLUMNS = [
  ["store_info", "logo_url", "VARCHAR(500) NOT NULL DEFAULT ''"],
  ["store_info", "app_domain", "VARCHAR(255) NOT NULL DEFAULT ''"],
  ["store_info", "api_domain", "VARCHAR(255) NOT NULL DEFAULT ''"],
  ["store_info", "support_phone", "VARCHAR(80) NOT NULL DEFAULT ''"],
  ["products", "category_id", "VARCHAR(80) NOT NULL DEFAULT ''"],
  ["products", "sku", "VARCHAR(120) NOT NULL DEFAULT ''"],
  ["products", "image_url", "VARCHAR(500) NOT NULL DEFAULT ''"],
  ["products", "stock_qty", "INT NULL"],
  ["products", "sales_count", "INT NOT NULL DEFAULT 0"],
  ["products", "sort_order", "INT NOT NULL DEFAULT 0"],
  ["products", "status", "VARCHAR(40) NOT NULL DEFAULT 'active'"],
  ["cases", "cover_url", "VARCHAR(500) NOT NULL DEFAULT ''"],
  ["cases", "store_id", "VARCHAR(80) NOT NULL DEFAULT ''"],
  ["cases", "sort_order", "INT NOT NULL DEFAULT 0"],
  ["cases", "status", "VARCHAR(40) NOT NULL DEFAULT 'published'"],
  ["orders", "member_id", "VARCHAR(80) NOT NULL DEFAULT ''"],
  ["orders", "customer_name", "VARCHAR(80) NOT NULL DEFAULT ''"],
  ["orders", "customer_phone", "VARCHAR(40) NOT NULL DEFAULT ''"],
  ["orders", "source", "VARCHAR(80) NOT NULL DEFAULT ''"],
  ["orders", "total_amount", "DECIMAL(10,2) NOT NULL DEFAULT 0"],
  ["orders", "payment_status", "VARCHAR(40) NOT NULL DEFAULT ''"],
  ["orders", "delivery_type", "VARCHAR(40) NOT NULL DEFAULT ''"],
  ["orders", "store_id", "VARCHAR(80) NOT NULL DEFAULT ''"],
  ["orders", "remark", "TEXT NULL"],
  ["orders", "shipped_at", "DATETIME NULL"],
  ["orders", "completed_at", "DATETIME NULL"],
  ["orders", "closed_at", "DATETIME NULL"],
  ["bookings", "member_id", "VARCHAR(80) NOT NULL DEFAULT ''"],
  ["bookings", "customer_name", "VARCHAR(80) NOT NULL DEFAULT ''"],
  ["bookings", "phone", "VARCHAR(40) NOT NULL DEFAULT ''"],
  ["bookings", "store_id", "VARCHAR(80) NOT NULL DEFAULT ''"],
  ["bookings", "appointment_at", "DATETIME NULL"],
  ["bookings", "assigned_to", "VARCHAR(80) NOT NULL DEFAULT ''"],
  ["bookings", "source", "VARCHAR(80) NOT NULL DEFAULT ''"],
  ["consultations", "member_id", "VARCHAR(80) NOT NULL DEFAULT ''"],
  ["consultations", "customer_name", "VARCHAR(80) NOT NULL DEFAULT ''"],
  ["consultations", "phone", "VARCHAR(40) NOT NULL DEFAULT ''"],
  ["consultations", "source", "VARCHAR(80) NOT NULL DEFAULT ''"],
  ["consultations", "assigned_store_id", "VARCHAR(80) NOT NULL DEFAULT ''"],
  ["consultations", "follow_note", "TEXT NULL"],
];

function quoteIdentifier(identifier) {
  if (!/^[a-zA-Z0-9_]+$/.test(identifier)) {
    throw new Error(`Unsafe SQL identifier: ${identifier}`);
  }
  return `\`${identifier}\``;
}

async function ensureColumn(pool, table, column, definition) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count
       FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?`,
    [table, column]
  );

  if (Number(rows[0]?.count || 0) > 0) return;
  await pool.query(`ALTER TABLE ${quoteIdentifier(table)} ADD COLUMN ${quoteIdentifier(column)} ${definition}`);
}

async function ensureBaseMysqlSchema(pool) {
  for (const statement of BASE_SCHEMA_STATEMENTS) {
    await pool.query(statement);
  }

  await pool.query(
    "INSERT IGNORE INTO store_info (id, name, address, phone, hours, longitude, latitude) VALUES (1, '', '', '', '', NULL, NULL)"
  );
}

async function ensureBusinessMysqlSchema(pool) {
  for (const statement of BUSINESS_SCHEMA_STATEMENTS) {
    await pool.query(statement);
  }

  for (const [table, column, definition] of EXTRA_COLUMNS) {
    await ensureColumn(pool, table, column, definition);
  }

  await pool.query(
    "INSERT IGNORE INTO schema_migrations (version, description) VALUES (?, ?)",
    ["2026-06-05-business-schema", "Create business tables for shop admin modules"]
  );
}

async function ensureFullMysqlSchema(pool) {
  await ensureBaseMysqlSchema(pool);
  await ensureBusinessMysqlSchema(pool);
}

module.exports = {
  BASE_TABLES,
  BUSINESS_TABLES,
  ensureBaseMysqlSchema,
  ensureBusinessMysqlSchema,
  ensureFullMysqlSchema,
};
