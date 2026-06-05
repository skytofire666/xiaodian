const crypto = require("crypto");
const fsSync = require("fs");
const fs = require("fs/promises");
const http = require("http");
const path = require("path");
const { URL } = require("url");
const { ensureBusinessMysqlSchema } = require("./db/schema");

const serverDir = __dirname;
const projectRoot = path.resolve(serverDir, "..");
const webDir = path.join(projectRoot, "web");
const adminDir = path.join(projectRoot, "admin");
loadLocalEnv();

const dataDir = path.join(serverDir, "data");
const dataFile = process.env.XIAODIAN_DATA_FILE || path.join(dataDir, "store.json");
const seedFile = path.join(dataDir, "store.seed.json");
const port = Number(process.env.PORT || 3000);
let mysqlPool = null;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function loadLocalEnv() {
  [
    path.join(projectRoot, ".env.local"),
    path.join(projectRoot, ".env"),
    path.join(serverDir, ".env.local"),
    path.join(serverDir, ".env"),
  ].forEach((filePath) => {
    if (!fsSync.existsSync(filePath)) return;
    const lines = fsSync.readFileSync(filePath, "utf8").split(/\r?\n/);
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const index = trimmed.indexOf("=");
      if (index === -1) return;
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim();
      if (key && process.env[key] === undefined) {
        process.env[key] = value.replace(/^["']|["']$/g, "");
      }
    });
  });
}

function nowText() {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

function jsonHeaders() {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, jsonHeaders());
  response.end(JSON.stringify(payload));
}

function sendError(response, statusCode, message) {
  sendJson(response, statusCode, { message });
}

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    const seed = await fs.readFile(seedFile, "utf8");
    await fs.writeFile(dataFile, seed, "utf8");
  }
}

async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(dataFile, "utf8");
  return normalizeStoreShape(JSON.parse(raw));
}

async function writeStore(store) {
  await fs.mkdir(dataDir, { recursive: true });
  const tmpFile = `${dataFile}.tmp`;
  await fs.writeFile(tmpFile, JSON.stringify(store, null, 2), "utf8");
  await fs.rename(tmpFile, dataFile);
}

function useMysql() {
  return String(process.env.DB_TYPE || "").toLowerCase() === "mysql";
}

function jsonText(value, fallback = []) {
  try {
    return JSON.stringify(value ?? fallback);
  } catch {
    return JSON.stringify(fallback);
  }
}

function parseJsonText(value, fallback = []) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === "") return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function parseJsonValue(value, fallback = {}) {
  if (value && typeof value === "object") return value;
  if (value === null || value === undefined || value === "") return fallback;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function normalizeStoreShape(store = {}) {
  return {
    storeInfo: store.storeInfo || {},
    products: Array.isArray(store.products) ? store.products : [],
    cases: Array.isArray(store.cases) ? store.cases : [],
    orders: Array.isArray(store.orders) ? store.orders : [],
    bookings: Array.isArray(store.bookings) ? store.bookings : [],
    consultations: Array.isArray(store.consultations) ? store.consultations : [],
    settings: store.settings && typeof store.settings === "object" ? store.settings : {},
  };
}

function mysqlConfig() {
  return {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
    connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT || 8000),
    charset: "utf8mb4",
  };
}

async function getMysqlPool() {
  if (mysqlPool) return mysqlPool;
  let mysql;
  try {
    mysql = require("mysql2/promise");
  } catch {
    throw new Error("缺少 MySQL 驱动，请先运行：npm install");
  }

  const config = mysqlConfig();
  ["host", "database", "user"].forEach((key) => {
    if (!config[key]) throw new Error(`缺少数据库配置：DB_${key.toUpperCase()}`);
  });
  mysqlPool = mysql.createPool(config);
  await ensureMysqlSchema(mysqlPool);
  return mysqlPool;
}

async function ensureMysqlSchema(pool) {
  await pool.query(`
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
  `);

  await pool.query(`
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
  `);

  await pool.query(`
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
  `);

  await pool.query(`
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
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id VARCHAR(80) PRIMARY KEY,
      type VARCHAR(80) NOT NULL DEFAULT '',
      time_text VARCHAR(120) NOT NULL DEFAULT '',
      note TEXT NULL,
      status VARCHAR(40) NOT NULL DEFAULT '',
      created_at_text VARCHAR(40) NOT NULL DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await pool.query(`
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
  `);

  await pool.query(
    "INSERT IGNORE INTO store_info (id, name, address, phone, hours, longitude, latitude) VALUES (1, '', '', '', '', NULL, NULL)"
  );

  await ensureBusinessMysqlSchema(pool);
}

async function readMysqlStore() {
  const pool = await getMysqlPool();
  const [[storeInfoRow]] = await pool.query("SELECT * FROM store_info WHERE id = 1 LIMIT 1");
  const [productRows] = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
  const [caseRows] = await pool.query("SELECT * FROM cases ORDER BY created_at DESC");
  const [orderRows] = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
  const [bookingRows] = await pool.query("SELECT * FROM bookings ORDER BY created_at DESC");
  const [consultRows] = await pool.query("SELECT * FROM consultations ORDER BY created_at DESC");
  const [settingRows] = await pool.query("SELECT setting_key, setting_value FROM system_settings");
  const settings = Object.fromEntries(
    settingRows.map((row) => [row.setting_key, parseJsonValue(row.setting_value)])
  );

  return {
    storeInfo: {
      name: storeInfoRow?.name || "",
      address: storeInfoRow?.address || "",
      phone: storeInfoRow?.phone || "",
      hours: storeInfoRow?.hours || "",
      longitude: Number(storeInfoRow?.longitude) || 0,
      latitude: Number(storeInfoRow?.latitude) || 0,
    },
    products: productRows.map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      price: Number(row.price) || 0,
      tags: parseJsonText(row.tags),
      material: row.material,
      specs: row.specs,
      cycle: row.cycle,
      stock: row.stock,
      tone: row.tone,
      care: row.care,
      story: row.story || "",
      thumbX: row.thumb_x,
      thumbY: row.thumb_y,
      active: Boolean(row.active),
    })),
    cases: caseRows.map((row) => ({
      id: row.id,
      title: row.title,
      type: row.type,
      scene: row.scene || "",
      summary: row.summary || "",
      result: row.result || "",
      productIds: parseJsonText(row.product_ids),
      thumbX: row.thumb_x,
      thumbY: row.thumb_y,
      active: Boolean(row.active),
    })),
    orders: orderRows.map((row) => ({
      id: row.id,
      status: row.status,
      productName: row.product_name,
      productId: row.product_id,
      price: Number(row.price) || 0,
      quantity: Number(row.quantity) || 1,
      spec: row.spec,
      orderNo: row.order_no,
      logisticsNo: row.logistics_no,
      carrier: row.carrier,
      createdAt: row.created_at_text,
      paidAt: row.paid_at,
      receiver: row.receiver,
      address: row.address,
      currentNode: row.current_node,
      logistics: parseJsonText(row.logistics),
      action: row.action,
      primary: Boolean(row.primary_order),
      thumbX: row.thumb_x,
      thumbY: row.thumb_y,
    })),
    bookings: bookingRows.map((row) => ({
      id: row.id,
      type: row.type,
      time: row.time_text,
      note: row.note || "",
      status: row.status,
      createdAt: row.created_at_text,
    })),
    consultations: consultRows.map((row) => ({
      id: row.id,
      productId: row.product_id,
      topic: row.topic,
      message: row.message || "",
      contact: row.contact,
      status: row.status,
      createdAt: row.created_at_text,
    })),
    settings,
  };
}

async function replaceTable(connection, table, rows, sql, mapper) {
  await connection.query(`DELETE FROM ${table}`);
  for (const row of rows) {
    await connection.query(sql, mapper(row));
  }
}

async function writeMysqlStore(store) {
  const pool = await getMysqlPool();
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query(
      `INSERT INTO store_info (id, name, address, phone, hours, longitude, latitude)
       VALUES (1, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), address = VALUES(address), phone = VALUES(phone), hours = VALUES(hours), longitude = VALUES(longitude), latitude = VALUES(latitude)`,
      [
        store.storeInfo?.name || "",
        store.storeInfo?.address || "",
        store.storeInfo?.phone || "",
        store.storeInfo?.hours || "",
        Number(store.storeInfo?.longitude) || null,
        Number(store.storeInfo?.latitude) || null,
      ]
    );

    await replaceTable(
      connection,
      "products",
      store.products || [],
      `INSERT INTO products (id, name, type, price, tags, material, specs, cycle, stock, tone, care, story, thumb_x, thumb_y, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      (product) => [
        product.id,
        product.name,
        product.type,
        price(product.price),
        jsonText(product.tags),
        product.material || "",
        product.specs || "",
        product.cycle || "",
        product.stock || "",
        product.tone || "",
        product.care || "",
        product.story || "",
        product.thumbX || "50%",
        product.thumbY || "58%",
        product.active === false ? 0 : 1,
      ]
    );

    await replaceTable(
      connection,
      "cases",
      store.cases || [],
      `INSERT INTO cases (id, title, type, scene, summary, result, product_ids, thumb_x, thumb_y, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      (caseItem) => [
        caseItem.id,
        caseItem.title,
        caseItem.type || "",
        caseItem.scene || "",
        caseItem.summary || "",
        caseItem.result || "",
        jsonText(caseItem.productIds),
        caseItem.thumbX || "50%",
        caseItem.thumbY || "50%",
        caseItem.active === false ? 0 : 1,
      ]
    );

    await replaceTable(
      connection,
      "orders",
      store.orders || [],
      `INSERT INTO orders (id, status, product_name, product_id, price, quantity, spec, order_no, logistics_no, carrier, created_at_text, paid_at, receiver, address, current_node, logistics, action, primary_order, thumb_x, thumb_y)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      (order) => [
        order.id,
        order.status || "",
        order.productName || "",
        order.productId || "",
        price(order.price),
        Number(order.quantity) || 1,
        order.spec || "",
        order.orderNo || "",
        order.logisticsNo || "",
        order.carrier || "",
        order.createdAt || "",
        order.paidAt || "",
        order.receiver || "",
        order.address || "",
        order.currentNode || "",
        jsonText(order.logistics),
        order.action || "",
        order.primary ? 1 : 0,
        order.thumbX || "50%",
        order.thumbY || "58%",
      ]
    );

    await replaceTable(
      connection,
      "bookings",
      store.bookings || [],
      "INSERT INTO bookings (id, type, time_text, note, status, created_at_text) VALUES (?, ?, ?, ?, ?, ?)",
      (booking) => [booking.id, booking.type || "", booking.time || "", booking.note || "", booking.status || "", booking.createdAt || ""]
    );

    await replaceTable(
      connection,
      "consultations",
      store.consultations || [],
      "INSERT INTO consultations (id, product_id, topic, message, contact, status, created_at_text) VALUES (?, ?, ?, ?, ?, ?, ?)",
      (consult) => [consult.id, consult.productId || "", consult.topic || "", consult.message || "", consult.contact || "", consult.status || "", consult.createdAt || ""]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

const readJsonStore = readStore;
const writeJsonStore = writeStore;

readStore = async function readConfiguredStore() {
  if (useMysql()) return readMysqlStore();
  return readJsonStore();
};

writeStore = async function writeConfiguredStore(store) {
  if (useMysql()) return writeMysqlStore(store);
  return writeJsonStore(store);
};

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
    if (Buffer.concat(chunks).length > 1024 * 1024) {
      throw new Error("请求内容过大");
    }
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function text(value, fallback = "") {
  const result = String(value ?? "").trim();
  return result || fallback;
}

function price(value) {
  const result = Number(value);
  return Number.isFinite(result) && result >= 0 ? result : 0;
}

function list(value) {
  if (Array.isArray(value)) return value.map((item) => text(item)).filter(Boolean);
  return String(value ?? "")
    .split(/[，,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function publicStore(store) {
  return {
    storeInfo: store.storeInfo,
    products: store.products.filter((product) => product.active !== false),
    cases: store.cases,
    orders: store.orders,
  };
}

function createId(prefix) {
  if (crypto.randomUUID) return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function createOrderNo() {
  const stamp = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  return `XD${stamp}${Math.floor(Math.random() * 900 + 100)}`;
}

function normalizeProduct(input, existing = {}) {
  const name = text(input.name, existing.name || "未命名商品");
  const id = text(input.id, existing.id || createId("product"))
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return {
    id: id || existing.id || createId("product"),
    name,
    type: text(input.type, existing.type || "果壳铃"),
    price: price(input.price ?? existing.price),
    tags: list(input.tags ?? existing.tags),
    material: text(input.material, existing.material || "待补充"),
    specs: text(input.specs, existing.specs || "待补充"),
    cycle: text(input.cycle, existing.cycle || "待确认"),
    stock: text(input.stock, existing.stock || "待确认"),
    tone: text(input.tone, existing.tone || "待试听"),
    care: text(input.care, existing.care || "保持干燥，避免挤压"),
    story: text(input.story, existing.story || "这件商品还没有填写介绍。"),
    thumbX: text(input.thumbX, existing.thumbX || "50%"),
    thumbY: text(input.thumbY, existing.thumbY || "58%"),
    active: input.active === false || input.active === "false" ? false : true,
  };
}

function normalizeCase(input, existing = {}) {
  const title = text(input.title, existing.title || "未命名案例");
  const id = text(input.id, existing.id || createId("case"))
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return {
    id: id || existing.id || createId("case"),
    title,
    type: text(input.type, existing.type || "案例"),
    scene: text(input.scene, existing.scene || "待补充场景"),
    summary: text(input.summary, existing.summary || "待补充摘要"),
    result: text(input.result, existing.result || "待补充结果"),
    productIds: list(input.productIds ?? existing.productIds),
    thumbX: text(input.thumbX, existing.thumbX || "50%"),
    thumbY: text(input.thumbY, existing.thumbY || "50%"),
    active: input.active === false || input.active === "false" ? false : true,
  };
}

function normalizeSettingKey(value) {
  const key = text(value).replace(/[^a-zA-Z0-9_.-]/g, "");
  if (!key) throw new Error("配置键不能为空");
  return key.slice(0, 120);
}

function settingGroup(key) {
  return key.includes(".") ? key.split(".")[0] : "general";
}

async function saveAdminSetting(store, keyValue, values = {}) {
  const key = normalizeSettingKey(keyValue);
  const payload = values && typeof values === "object" ? values : {};
  if (useMysql()) {
    const pool = await getMysqlPool();
    await pool.query(
      `INSERT INTO system_settings (setting_key, setting_value, group_name, description)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), group_name = VALUES(group_name), description = VALUES(description)`,
      [key, jsonText(payload, {}), settingGroup(key), "后台配置页保存"]
    );
  } else {
    store.settings = {
      ...(store.settings || {}),
      [key]: payload,
    };
    await writeStore(store);
  }
  return { key, values: payload };
}

function includesAny(value, keywords) {
  return keywords.some((keyword) => value.includes(keyword));
}

function productText(product) {
  return [
    product.name,
    product.type,
    ...(product.tags || []),
    product.material,
    product.specs,
    product.cycle,
    product.stock,
    product.tone,
    product.story,
  ]
    .join(" ")
    .toLowerCase();
}

function summarizeProducts(products) {
  return products.slice(0, 3).map((product) => ({
    id: product.id,
    name: product.name,
    type: product.type,
    price: product.price,
    stock: product.stock,
    tone: product.tone,
    story: product.story,
    thumbX: product.thumbX,
    thumbY: product.thumbY,
  }));
}

function findAgentProducts(message, products) {
  const query = message.toLowerCase();
  let matches = products.filter((product) => productText(product).includes(query));

  if (!matches.length) {
    const rules = [
      { keys: ["车", "新车", "车挂", "后视镜"], types: ["车挂"], tags: ["车挂"] },
      { keys: ["包", "包挂", "通勤", "帆布"], types: ["包挂"], tags: ["包挂"] },
      { keys: ["礼", "送", "生日", "乔迁", "礼盒", "祝福"], types: ["礼盒"], tags: ["礼盒", "礼物"] },
      { keys: ["便宜", "入门", "钥匙", "小"], types: ["果壳铃"], tags: ["入门", "小巧"] },
      { keys: ["定制", "绳色", "换色", "配件"], types: ["定制"], tags: ["轻定制", "配件", "换色"] },
      { keys: ["现货", "今天", "马上", "发货"], types: [], tags: ["现货"] },
    ];

    const rule = rules.find((item) => includesAny(query, item.keys));
    if (rule) {
      matches = products.filter((product) => {
        const tags = product.tags || [];
        return rule.types.includes(product.type) || tags.some((tag) => rule.tags.includes(tag));
      });
    }
  }

  if (!matches.length && includesAny(query, ["推荐", "买什么", "哪个好", "看看", "选"])) {
    matches = [...products].sort((a, b) => Number(b.price) - Number(a.price)).slice(0, 3);
  }

  return summarizeProducts(matches);
}

function getDeepSeekConfig() {
  return {
    apiKey: process.env.DEEPSEEK_API_KEY || "",
    model: process.env.DEEPSEEK_MODEL || "deepseek-v4-pro",
    baseUrl: (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com").replace(/\/$/, ""),
  };
}

function buildAgentKnowledge(store) {
  const activeProducts = store.products.filter((product) => product.active !== false);
  return {
    storeInfo: store.storeInfo,
    products: activeProducts.map((product) => ({
      id: product.id,
      name: product.name,
      type: product.type,
      price: product.price,
      tags: product.tags,
      material: product.material,
      specs: product.specs,
      cycle: product.cycle,
      stock: product.stock,
      tone: product.tone,
      care: product.care,
      story: product.story,
    })),
    cases: store.cases.map((item) => ({
      title: item.title,
      type: item.type,
      scene: item.scene,
      summary: item.summary,
      productIds: item.productIds,
    })),
  };
}

function parseAgentJson(content) {
  const raw = text(content);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

async function callDeepSeekAgent(message, store, history = []) {
  const config = getDeepSeekConfig();
  if (!config.apiKey) return null;

  const knowledge = buildAgentKnowledge(store);
  const systemPrompt = [
    "你是果壳铃手作铺的 AI 导购 Agent。",
    "你只根据给定的门店、商品和案例资料回答，不编造不存在的商品、价格、库存、地址、支付能力。",
    "你的目标是帮助顾客选款、理解定制、到店预约、提交咨询或进入商品详情。",
    "回答要短、自然、像线下手作店店员，中文为主。",
    "当信息不确定时，引导顾客提交咨询或到店确认。",
    "必须只返回 JSON，不要 Markdown，不要代码块。",
    "JSON schema: {\"reply\":\"给顾客的回答\",\"productIds\":[\"商品ID\"],\"quickReplies\":[\"快捷回复\"],\"action\":\"consult|booking|order|none\"}",
    `门店与商品资料：${JSON.stringify(knowledge)}`,
  ].join("\n");

  const cleanHistory = Array.isArray(history)
    ? history
        .filter((item) => item && ["user", "assistant"].includes(item.role) && text(item.content))
        .slice(-8)
        .map((item) => ({ role: item.role, content: text(item.content).slice(0, 500) }))
    : [];

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: systemPrompt },
        ...cleanHistory,
        { role: "user", content: text(message).slice(0, 1000) },
      ],
      thinking: { type: "enabled" },
      reasoning_effort: "medium",
      stream: false,
      temperature: 0.4,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error?.message || `DeepSeek 调用失败：${response.status}`);
  }

  const content = payload.choices?.[0]?.message?.content;
  const parsed = parseAgentJson(content);
  if (!parsed?.reply) return null;

  const activeProducts = store.products.filter((product) => product.active !== false);
  const productIds = Array.isArray(parsed.productIds) ? parsed.productIds : [];
  const selectedProducts = summarizeProducts(
    productIds
      .map((id) => activeProducts.find((product) => product.id === id))
      .filter(Boolean)
  );

  return {
    reply: text(parsed.reply).slice(0, 600),
    quickReplies: Array.isArray(parsed.quickReplies) && parsed.quickReplies.length
      ? parsed.quickReplies.map((item) => text(item)).filter(Boolean).slice(0, 4)
      : ["推荐送礼款", "看现货", "到店预约", "怎么定制"],
    products: selectedProducts,
    action: text(parsed.action, "none"),
    provider: config.model,
  };
}

function buildLocalAgentReply(message, store) {
  const query = text(message).toLowerCase();
  const activeProducts = store.products.filter((product) => product.active !== false);
  const products = findAgentProducts(query, activeProducts);
  const quickReplies = ["推荐送礼款", "看现货", "到店预约", "怎么定制"];

  if (!query) {
    return {
      reply: "我在，可以帮你选款、查现货、看门店信息，也能把定制需求转给店主。",
      quickReplies,
      products: summarizeProducts(activeProducts.slice(0, 2)),
    };
  }

  if (includesAny(query, ["地址", "在哪", "门店", "营业", "几点", "电话", "微信", "导航"])) {
    return {
      reply: `${store.storeInfo.name}在${store.storeInfo.address}。营业时间：${store.storeInfo.hours || "待补充"}。联系方式：${store.storeInfo.phone || "待补充"}。如果要到店听铃音，可以先提交预约。`,
      quickReplies: ["到店预约", "看车挂", "看礼盒"],
      products: [],
      action: "booking",
    };
  }

  if (includesAny(query, ["定制", "绳色", "铃音", "礼盒", "祝福卡", "改", "配件"])) {
    const related = products.length ? products : summarizeProducts(activeProducts.filter((product) => product.type === "定制" || (product.tags || []).includes("轻定制")));
    return {
      reply: "可以轻定制。通常先确认商品款式、绳色、铃音、包装和预算；复杂需求建议提交咨询，店主再确认能不能做、多久能完成。",
      quickReplies: ["提交定制咨询", "看礼盒", "看车挂"],
      products: related,
      action: "consult",
    };
  }

  if (includesAny(query, ["预约", "到店", "自提", "体验", "听铃"])) {
    return {
      reply: "可以预约到店看实物、听铃音、选绳色，也可以预约自提。你可以在门店页提交预约，后台会收到记录。",
      quickReplies: ["到店预约", "看现货", "定制咨询"],
      products: [],
      action: "booking",
    };
  }

  if (includesAny(query, ["下单", "购买", "怎么买", "付款", "支付"])) {
    return {
      reply: "现在可以先在商品详情里提交订单，门店确认库存、价格和支付方式后再处理。正式微信支付可以等商户号准备好后接入。",
      quickReplies: ["看现货", "推荐送礼款", "定制咨询"],
      products: products.length ? products : summarizeProducts(activeProducts.slice(0, 3)),
    };
  }

  if (includesAny(query, ["售后", "退", "换", "保养", "坏了"])) {
    return {
      reply: "现货商品按门店售后规则处理；定制内容确认后，非质量问题需要先沟通。日常保养建议保持干燥，黄铜部分用软布轻擦，流苏避免长期挤压。",
      quickReplies: ["提交咨询", "看保养方式", "联系门店"],
      products,
      action: "consult",
    };
  }

  if (products.length) {
    const names = products.map((product) => `${product.name} ¥${product.price}`).join("、");
    return {
      reply: `我找到这些比较匹配：${names}。你可以点商品看材质、尺寸、库存和手作周期；拿不准的话也可以提交定制咨询。`,
      quickReplies: ["看详情", "定制咨询", "到店预约"],
      products,
    };
  }

  return {
    reply: "这个问题我先按门店导购来理解：你可以告诉我用途，比如送新车朋友、挂包、钥匙挂件、生日礼物，或者预算和喜欢的颜色，我再帮你缩小选择。",
    quickReplies,
    products: summarizeProducts(activeProducts.slice(0, 3)),
  };
}

async function buildAgentReply(message, store, history = []) {
  const localReply = buildLocalAgentReply(message, store);
  try {
    const aiReply = await callDeepSeekAgent(message, store, history);
    if (aiReply) {
      return {
        ...localReply,
        ...aiReply,
        products: aiReply.products?.length ? aiReply.products : localReply.products,
        quickReplies: aiReply.quickReplies?.length ? aiReply.quickReplies : localReply.quickReplies,
        action: aiReply.action && aiReply.action !== "none" ? aiReply.action : localReply.action || aiReply.action,
      };
    }
  } catch (error) {
    console.warn("DeepSeek Agent fallback:", error.message);
  }
  return {
    ...localReply,
    provider: "local-rules",
  };
}

async function handleApi(request, response, url) {
  if (request.method === "OPTIONS") {
    response.writeHead(204, jsonHeaders());
    response.end();
    return;
  }

  const store = await readStore();
  const segments = url.pathname.split("/").filter(Boolean);
  const [, resource, id, action] = segments;

  if (request.method === "GET" && resource === "health") {
    sendJson(response, 200, { ok: true, name: "xiaodian-api" });
    return;
  }

  if (request.method === "GET" && resource === "bootstrap") {
    sendJson(response, 200, publicStore(store));
    return;
  }

  if (request.method === "GET" && resource === "products") {
    if (id) {
      const product = store.products.find((item) => item.id === id && item.active !== false);
      if (!product) return sendError(response, 404, "商品不存在");
      sendJson(response, 200, product);
      return;
    }
    sendJson(response, 200, store.products.filter((product) => product.active !== false));
    return;
  }

  if (request.method === "GET" && resource === "cases") {
    sendJson(response, 200, store.cases);
    return;
  }

  if (request.method === "GET" && resource === "orders") {
    sendJson(response, 200, store.orders);
    return;
  }

  if (request.method === "POST" && resource === "agent" && id === "chat") {
    const body = await readBody(request);
    const result = await buildAgentReply(body.message, store, body.history);
    sendJson(response, 200, {
      ...result,
      createdAt: nowText(),
    });
    return;
  }

  if (request.method === "POST" && resource === "orders") {
    const body = await readBody(request);
    const product = store.products.find((item) => item.id === body.productId);
    if (!product) return sendError(response, 400, "请选择有效商品");

    const delivery = text(body.delivery, "快递");
    const note = text(body.note);
    const order = {
      id: createId("order"),
      status: "待确认",
      productName: product.name,
      productId: product.id,
      price: product.price,
      quantity: 1,
      spec: [delivery, note].filter(Boolean).join(" / ") || delivery,
      orderNo: createOrderNo(),
      logisticsNo: "",
      carrier: "门店待确认",
      createdAt: nowText(),
      paidAt: "待确认",
      receiver: `${text(body.customerName, "未填写姓名")} ${text(body.contact, "未填写联系方式")}`,
      address: text(body.address, "待补充"),
      currentNode: "订单已提交，等待门店确认",
      logistics: ["订单已提交，等待门店确认库存、价格和支付方式"],
      action: "查看详情",
      primary: false,
      thumbX: product.thumbX,
      thumbY: product.thumbY,
    };
    store.orders.unshift(order);
    await writeStore(store);
    sendJson(response, 201, order);
    return;
  }

  if (request.method === "POST" && resource === "consultations") {
    const body = await readBody(request);
    const consultation = {
      id: createId("consult"),
      productId: text(body.productId),
      topic: text(body.topic, "定制咨询"),
      message: text(body.message),
      contact: text(body.contact),
      status: "待回复",
      createdAt: nowText(),
    };
    if (!consultation.message && !consultation.contact) return sendError(response, 400, "请填写咨询内容或联系方式");
    store.consultations.unshift(consultation);
    await writeStore(store);
    sendJson(response, 201, consultation);
    return;
  }

  if (request.method === "POST" && resource === "bookings") {
    const body = await readBody(request);
    const booking = {
      id: createId("booking"),
      type: text(body.type, "定制咨询"),
      time: text(body.time, "待确认"),
      note: text(body.note),
      status: "待确认",
      createdAt: nowText(),
    };
    store.bookings.unshift(booking);
    await writeStore(store);
    sendJson(response, 201, booking);
    return;
  }

  if (resource === "admin") {
    await handleAdminApi(request, response, store, id, action);
    return;
  }

  sendError(response, 404, "接口不存在");
}

async function handleAdminApi(request, response, store, id, action) {
  if (request.method === "GET" && id === "data") {
    sendJson(response, 200, store);
    return;
  }

  if (request.method === "GET" && id === "summary") {
    sendJson(response, 200, {
      products: store.products.length,
      activeProducts: store.products.filter((product) => product.active !== false).length,
      orders: store.orders.length,
      pendingOrders: store.orders.filter((order) => order.status === "待确认").length,
      bookings: store.bookings.length,
      consultations: store.consultations.length,
    });
    return;
  }

  if (request.method === "GET" && id === "settings") {
    if (action) {
      const key = normalizeSettingKey(action);
      sendJson(response, 200, { key, values: store.settings?.[key] || {} });
      return;
    }
    sendJson(response, 200, store.settings || {});
    return;
  }

  if ((request.method === "PATCH" || request.method === "PUT" || request.method === "POST") && id === "settings" && action) {
    const body = await readBody(request);
    const result = await saveAdminSetting(store, action, body);
    sendJson(response, 200, result);
    return;
  }

  if (request.method === "PATCH" && id === "store") {
    const body = await readBody(request);
    store.storeInfo = {
      ...store.storeInfo,
      name: text(body.name, store.storeInfo.name),
      address: text(body.address, store.storeInfo.address),
      phone: text(body.phone, store.storeInfo.phone),
      hours: text(body.hours, store.storeInfo.hours),
      longitude: Number(body.longitude) || store.storeInfo.longitude,
      latitude: Number(body.latitude) || store.storeInfo.latitude,
    };
    await writeStore(store);
    sendJson(response, 200, store.storeInfo);
    return;
  }

  if (request.method === "POST" && id === "products") {
    const body = await readBody(request);
    const product = normalizeProduct(body);
    if (store.products.some((item) => item.id === product.id)) {
      return sendError(response, 409, "商品 ID 已存在");
    }
    store.products.unshift(product);
    await writeStore(store);
    sendJson(response, 201, product);
    return;
  }

  if (request.method === "PUT" && id === "products" && action) {
    const body = await readBody(request);
    const index = store.products.findIndex((product) => product.id === action);
    if (index === -1) return sendError(response, 404, "商品不存在");
    store.products[index] = normalizeProduct({ ...body, id: action }, store.products[index]);
    await writeStore(store);
    sendJson(response, 200, store.products[index]);
    return;
  }

  if (request.method === "POST" && id === "cases") {
    const body = await readBody(request);
    const caseItem = normalizeCase(body);
    if (store.cases.some((item) => item.id === caseItem.id)) {
      return sendError(response, 409, "案例 ID 已存在");
    }
    store.cases.unshift(caseItem);
    await writeStore(store);
    sendJson(response, 201, caseItem);
    return;
  }

  if (request.method === "PUT" && id === "cases" && action) {
    const body = await readBody(request);
    const index = store.cases.findIndex((item) => item.id === action);
    if (index === -1) return sendError(response, 404, "案例不存在");
    store.cases[index] = normalizeCase({ ...body, id: action }, store.cases[index]);
    await writeStore(store);
    sendJson(response, 200, store.cases[index]);
    return;
  }

  if (request.method === "PATCH" && id === "orders" && action) {
    const body = await readBody(request);
    const order = store.orders.find((item) => item.id === action);
    if (!order) return sendError(response, 404, "订单不存在");
    order.status = text(body.status, order.status);
    order.currentNode = text(body.currentNode, order.currentNode);
    order.carrier = text(body.carrier, order.carrier);
    order.logisticsNo = text(body.logisticsNo, order.logisticsNo);
    if (body.logisticsNode) {
      order.logistics = [text(body.logisticsNode), ...(Array.isArray(order.logistics) ? order.logistics : [])].filter(Boolean);
    }
    order.action = order.status === "待确认" ? "查看详情" : "查看物流";
    await writeStore(store);
    sendJson(response, 200, order);
    return;
  }

  sendError(response, 404, "后台接口不存在");
}

async function serveStatic(response, url) {
  const pathname = decodeURIComponent(url.pathname);
  let baseDir = webDir;
  let routePath = pathname;

  if (pathname === "/") {
    routePath = "/index.html";
  } else if (pathname === "/admin" || pathname === "/admin/") {
    baseDir = adminDir;
    routePath = "/admin.html";
  } else if (pathname.startsWith("/admin/")) {
    baseDir = adminDir;
    routePath = pathname.slice("/admin".length);
  }

  const filePath = path.normalize(path.join(baseDir, routePath));

  if (!filePath.startsWith(baseDir)) {
    sendError(response, 403, "访问路径不允许");
    return;
  }

  try {
    const content = await fs.readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
    });
    response.end(content);
  } catch {
    sendError(response, 404, "文件不存在");
  }
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(request, response, url);
      return;
    }
    await serveStatic(response, url);
  } catch (error) {
    console.error(error);
    sendError(response, 500, error.message || "服务器错误");
  }
});

server.listen(port, () => {
  console.log(`果壳铃手作铺已启动：http://localhost:${port}`);
  console.log(`后台管理：http://localhost:${port}/admin`);
});
