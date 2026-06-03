const crypto = require("crypto");
const fsSync = require("fs");
const fs = require("fs/promises");
const http = require("http");
const path = require("path");
const { URL } = require("url");

const rootDir = __dirname;
const dataDir = path.join(rootDir, "data");
const dataFile = process.env.XIAODIAN_DATA_FILE || path.join(dataDir, "store.json");
const seedFile = path.join(dataDir, "store.seed.json");
const port = Number(process.env.PORT || 3000);

loadLocalEnv();

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
  [".env.local", ".env"].forEach((fileName) => {
    const filePath = path.join(rootDir, fileName);
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
  return JSON.parse(raw);
}

async function writeStore(store) {
  await fs.mkdir(dataDir, { recursive: true });
  const tmpFile = `${dataFile}.tmp`;
  await fs.writeFile(tmpFile, JSON.stringify(store, null, 2), "utf8");
  await fs.rename(tmpFile, dataFile);
}

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

  if (request.method === "PATCH" && id === "orders" && action) {
    const body = await readBody(request);
    const order = store.orders.find((item) => item.id === action);
    if (!order) return sendError(response, 404, "订单不存在");
    order.status = text(body.status, order.status);
    order.currentNode = text(body.currentNode, order.currentNode);
    order.action = order.status === "待确认" ? "查看详情" : "查看物流";
    await writeStore(store);
    sendJson(response, 200, order);
    return;
  }

  sendError(response, 404, "后台接口不存在");
}

async function serveStatic(response, url) {
  const pathname = decodeURIComponent(url.pathname);
  const routePath = pathname === "/" ? "/index.html" : pathname === "/admin" ? "/admin.html" : pathname;
  const filePath = path.normalize(path.join(rootDir, routePath));

  if (!filePath.startsWith(rootDir)) {
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
  console.log(`后台管理：http://localhost:${port}/admin.html`);
});
