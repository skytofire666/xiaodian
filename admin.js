const API_BASE = window.location.protocol === "file:" ? "http://localhost:3000/api" : `${window.location.origin}/api`;

const state = {
  section: "dashboard",
  detail: "",
  selectedId: "",
  search: "",
  tabs: {
    orders: "全部",
    leads: "全部",
    marketing: "优惠券",
  },
  backend: {
    connected: false,
    loading: true,
    error: "",
    store: null,
  },
  toastTimer: null,
};

const nodes = {
  nav: document.getElementById("adminNav"),
  title: document.getElementById("adminTitle"),
  crumb: document.getElementById("adminCrumb"),
  content: document.getElementById("adminContent"),
  search: document.getElementById("globalSearch"),
  status: document.getElementById("backendStatus"),
  toast: document.getElementById("adminToast"),
};

const navItems = [
  { id: "dashboard", label: "数据看板", icon: "chart" },
  { id: "products", label: "产品管理", icon: "box" },
  { id: "cases", label: "案例管理", icon: "image" },
  { id: "orders", label: "订单管理", icon: "cart" },
  { id: "stores", label: "门店管理", icon: "pin" },
  { id: "members", label: "会员管理", icon: "users" },
  { id: "marketing", label: "营销中心", icon: "badge" },
  { id: "content", label: "内容管理", icon: "grid" },
  { id: "leads", label: "线索管理", icon: "message" },
  { id: "settings", label: "系统设置", icon: "settings" },
];

const data = {
  stats: [
    { label: "订单总数", value: "0" },
    { label: "订单金额", value: "¥0" },
    { label: "上架产品", value: "0" },
    { label: "待处理事项", value: "0", tone: "warm" },
  ],
  dashboardOrders: [],
  products: [],
  cases: [],
  stores: [],
  orders: [],
  members: [],
  leads: [],
  coupons: [],
};

const pageConfigs = {
  products: {
    title: "产品管理 / 产品列表",
    desc: "维护前台展示的商品、库存、价格、标签和上下架状态。",
    addLabel: "新增产品",
    filters: ["分类", "状态"],
    search: "搜索产品",
    total: "共 0 条",
    columns: [
      { key: "product", label: "产品", type: "thumb" },
      { key: "category", label: "分类" },
      { key: "price", label: "价格" },
      { key: "stock", label: "库存" },
      { key: "status", label: "状态", type: "status" },
      { key: "action", label: "操作", type: "action" },
    ],
    rows: data.products,
  },
  cases: {
    title: "案例管理 / 案例列表",
    desc: "维护前台案例种草内容，并关联商品形成购买路径。",
    addLabel: "新增案例",
    filters: ["标签", "门店", "状态"],
    search: "搜索案例",
    total: "共 0 条",
    columns: [
      { key: "caseName", label: "案例", type: "thumb" },
      { key: "tag", label: "标签" },
      { key: "store", label: "承接门店" },
      { key: "status", label: "状态", type: "status" },
      { key: "action", label: "操作", type: "action" },
    ],
    rows: data.cases,
  },
  stores: {
    title: "门店管理 / 门店列表",
    desc: "维护线下门店地址、电话、营业时间和到店服务。",
    addLabel: "新增门店",
    filters: ["城市", "状态"],
    search: "搜索门店",
    total: "共 0 条",
    columns: [
      { key: "store", label: "门店" },
      { key: "address", label: "地址" },
      { key: "phone", label: "电话" },
      { key: "status", label: "状态", type: "status" },
      { key: "action", label: "操作", type: "action" },
    ],
    rows: data.stores,
  },
  orders: {
    title: "订单管理 / 订单列表",
    desc: "处理前台提交的订单，确认库存、支付方式和物流信息。",
    filters: ["日期", "来源"],
    search: "订单号 / 手机",
    total: "共 0 条",
    tabKey: "orders",
    tabs: ["全部", "待确认", "待付款", "待发货", "待收货", "已完成", "退款"],
    columns: [
      { key: "no", label: "订单号" },
      { key: "member", label: "会员" },
      { key: "amount", label: "金额" },
      { key: "source", label: "来源" },
      { key: "status", label: "状态", type: "status" },
      { key: "action", label: "操作", type: "action" },
    ],
    rows: data.orders,
  },
  members: {
    title: "会员管理 / 会员列表",
    desc: "第一版先作为会员画像和消费记录入口，后续可接登录体系。",
    addLabel: "导出",
    filters: ["等级", "标签"],
    search: "昵称 / 手机",
    total: "共 0 条",
    columns: [
      { key: "member", label: "会员", type: "avatar" },
      { key: "phone", label: "手机" },
      { key: "level", label: "等级" },
      { key: "points", label: "积分" },
      { key: "spend", label: "消费额" },
      { key: "action", label: "操作", type: "action" },
    ],
    rows: data.members,
  },
  leads: {
    title: "线索管理 / 线索列表",
    desc: "汇总前台定制咨询和到店预约，方便门店跟进。",
    filters: ["门店", "来源"],
    search: "姓名 / 手机",
    total: "共 0 条",
    tabKey: "leads",
    tabs: ["全部", "待跟进", "跟进中", "已成交", "已关闭"],
    columns: [
      { key: "customer", label: "客户" },
      { key: "phone", label: "手机" },
      { key: "source", label: "来源" },
      { key: "store", label: "指派门店" },
      { key: "status", label: "状态", type: "status" },
      { key: "action", label: "操作", type: "action" },
    ],
    rows: data.leads,
  },
  marketing: {
    title: "营销中心 / 优惠券",
    desc: "配置优惠券、到店活动、积分兑换等运营动作。",
    addLabel: "创建优惠券",
    total: "共 0 条",
    tabKey: "marketing",
    tabs: ["优惠券", "活动", "签到", "积分商城 二期"],
    columns: [
      { key: "coupon", label: "券名" },
      { key: "type", label: "类型" },
      { key: "scope", label: "门槛 / 门店" },
      { key: "used", label: "已领 / 已用" },
      { key: "valid", label: "有效期" },
      { key: "status", label: "状态", type: "status" },
    ],
    rows: data.coupons,
  },
};

const contentCards = [
  { id: "banner", icon: "layout", title: "首页 Banner / 运营位", desc: "轮播图、运营位排序与跳转" },
  { id: "recommend", icon: "star", title: "推荐位", desc: "首页精选产品 / 精选案例" },
  { id: "story", icon: "store", title: "品牌故事 / 关于我们", desc: "品牌介绍图文内容" },
  { id: "agreement", icon: "file", title: "协议管理", desc: "隐私政策、用户协议" },
];

const settingsCards = [
  { id: "account", icon: "shield", title: "账号与权限", desc: "后台账号、角色、数据范围" },
  { id: "pay", icon: "card", title: "支付配置", desc: "微信支付商户参数（小程序 / H5）" },
  { id: "logistics", icon: "truck", title: "物流 / 运费模板", desc: "快递公司、运费规则" },
  { id: "service", icon: "headset", title: "客服配置", desc: "企业微信 / 第三方客服接入" },
  { id: "logs", icon: "history", title: "操作日志", desc: "后台操作审计记录" },
  { id: "basic", icon: "hexagon", title: "基础信息", desc: "品牌名、Logo、客服电话" },
];

const secondaryPages = {
  banner: {
    parent: "content",
    title: "首页 Banner / 运营位",
    desc: "管理首页首屏轮播、运营坑位和跳转目标。",
    columns: ["位置", "标题", "跳转", "状态", "操作"],
    rows: [],
  },
  recommend: {
    parent: "content",
    title: "推荐位",
    desc: "控制首页热门产品、精选案例和排序。",
    columns: ["推荐区域", "内容", "排序", "状态", "操作"],
    rows: [],
  },
  story: {
    parent: "content",
    title: "品牌故事 / 关于我们",
    desc: "维护品牌介绍、工艺说明和门店主理人内容。",
    columns: ["模块", "内容类型", "更新时间", "状态", "操作"],
    rows: [],
  },
  agreement: {
    parent: "content",
    title: "协议管理",
    desc: "维护用户协议、隐私政策和售后说明。",
    columns: ["协议", "版本", "更新时间", "状态", "操作"],
    rows: [],
  },
  account: {
    parent: "settings",
    title: "账号与权限",
    desc: "配置后台角色、账号和数据权限范围。",
    columns: ["角色", "成员", "权限范围", "状态", "操作"],
    rows: [],
  },
  pay: {
    parent: "settings",
    title: "支付配置",
    desc: "配置微信支付、小程序支付和退款规则。",
    columns: ["渠道", "商户号", "能力", "状态", "操作"],
    rows: [],
  },
  logistics: {
    parent: "settings",
    title: "物流 / 运费模板",
    desc: "维护快递公司、物流单号规则和运费模板。",
    columns: ["模板", "快递公司", "计费规则", "状态", "操作"],
    rows: [],
  },
  service: {
    parent: "settings",
    title: "客服配置",
    desc: "配置企业微信、电话和第三方客服入口。",
    columns: ["入口", "方式", "展示位置", "状态", "操作"],
    rows: [],
  },
  logs: {
    parent: "settings",
    title: "操作日志",
    desc: "查看后台关键操作记录。",
    columns: ["时间", "账号", "动作", "对象", "结果"],
    rows: [],
  },
  basic: {
    parent: "settings",
    title: "基础信息",
    desc: "配置品牌名称、Logo、客服电话和营业信息。",
    columns: ["字段", "当前值", "更新时间", "状态", "操作"],
    rows: [],
  },
};

const iconMap = {
  chart: '<path d="M4 19V9"/><path d="M10 19V5"/><path d="M16 19v-7"/><path d="M3 19h18"/>',
  box: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5"/><path d="M12 12v9"/>',
  image: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="m7 16 3-4 3 3 2-2 3 3"/><circle cx="9" cy="9" r="1.2"/>',
  cart: '<path d="M5 5h2l2 10h8l2-7H8"/><circle cx="10" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/>',
  pin: '<path d="M12 21s6-5.3 6-11a6 6 0 0 0-12 0c0 5.7 6 11 6 11Z"/><circle cx="12" cy="10" r="2"/>',
  users: '<path d="M16 19c0-2-1.8-3.5-4-3.5S8 17 8 19"/><circle cx="12" cy="9" r="3"/><path d="M4 18c0-1.5 1.2-2.7 2.8-3"/><path d="M20 18c0-1.5-1.2-2.7-2.8-3"/>',
  badge: '<circle cx="12" cy="12" r="8"/><path d="m9 12 2 2 4-5"/><path d="m8 3 1.2 2.4"/><path d="M16 3 14.8 5.4"/>',
  grid: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
  message: '<path d="M5 6h14v10H8l-3 3V6Z"/><path d="M8 10h8"/><path d="M8 13h5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-5l-.3 3a7 7 0 0 0-1.7 1l-2.4-1-2 3.5L5.1 11a7 7 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 1.7 1l.3 3h5l.3-3a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5c.1-.3.1-.7.1-1Z"/>',
  search: '<path d="m21 21-4.35-4.35"/><circle cx="10.5" cy="10.5" r="7.5"/>',
  layout: '<path d="M4 7h16"/><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M9 11h6"/><path d="M9 15h3"/>',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2 7.5 14 3 9.6l6.2-.9L12 3Z"/>',
  store: '<path d="M4 10h16l-1.5-5h-13L4 10Z"/><path d="M6 10v9h12v-9"/><path d="M9 19v-5h6v5"/>',
  file: '<path d="M7 3h7l4 4v14H7V3Z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h6"/>',
  shield: '<path d="M12 3 5 6v5c0 4.4 2.9 8.4 7 10 4.1-1.6 7-5.6 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/>',
  card: '<rect x="4" y="6" width="16" height="12" rx="2"/><path d="M4 10h16"/><path d="M7 15h4"/>',
  truck: '<path d="M3 7h11v9H3V7Z"/><path d="M14 10h4l3 3v3h-7v-6Z"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/>',
  headset: '<path d="M5 13v-1a7 7 0 0 1 14 0v1"/><path d="M5 13h3v5H5v-5Z"/><path d="M16 13h3v5h-3v-5Z"/><path d="M16 20h-3"/>',
  history: '<path d="M4 12a8 8 0 1 0 2.3-5.7L4 8.6"/><path d="M4 4v5h5"/><path d="M12 8v5l3 2"/>',
  hexagon: '<path d="m12 3 7 4v10l-7 4-7-4V7l7-4Z"/><circle cx="12" cy="12" r="2"/>',
};

function icon(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${iconMap[name] || iconMap.grid}</svg>`;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[char];
  });
}

function textValue(value, fallback = "") {
  const result = String(value ?? "").trim();
  return result || fallback;
}

function moneyValue(value) {
  const number = Number(String(value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(number) ? number : 0;
}

function slugValue(value, fallback = "item") {
  return textValue(value, fallback)
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || `接口请求失败：${response.status}`);
  return payload;
}

function showToast(message) {
  window.clearTimeout(state.toastTimer);
  nodes.toast.textContent = message;
  nodes.toast.classList.add("is-visible");
  state.toastTimer = window.setTimeout(() => nodes.toast.classList.remove("is-visible"), 2200);
}

function replaceRows(target, rows) {
  target.splice(0, target.length, ...rows);
}

function mapProduct(product) {
  return {
    id: product.id,
    product: textValue(product.name, "未命名商品"),
    category: textValue(product.type, "未分类"),
    price: `¥${Number(product.price || 0).toLocaleString("zh-CN")}`,
    stock: textValue(product.stock, "待确认"),
    status: product.active === false ? "下架" : "在售",
    action: "编辑",
    raw: product,
  };
}

function mapCase(item) {
  return {
    id: item.id,
    caseName: textValue(item.title, "未命名案例"),
    tag: textValue(item.type, "案例"),
    store: "线上 / 门店",
    status: item.active === false ? "草稿" : "已发布",
    action: "编辑",
    raw: item,
  };
}

function mapOrder(order) {
  return {
    id: order.id,
    no: textValue(order.orderNo, "No.--"),
    member: textValue(order.receiver, "顾客").slice(0, 8),
    amount: `¥${Number(order.price || 0).toLocaleString("zh-CN")}`,
    source: "小程序",
    status: textValue(order.status, "待确认"),
    action: order.status === "待发货" ? "发货" : "详情",
    raw: order,
  };
}

function mapStore(storeInfo = {}) {
  return {
    id: "main-store",
    store: textValue(storeInfo.name, "主门店"),
    address: textValue(storeInfo.address, "待补充地址"),
    phone: textValue(storeInfo.phone, "待补充"),
    status: "营业",
    action: "编辑",
    raw: storeInfo,
  };
}

function mapBooking(booking) {
  return {
    id: booking.id,
    customer: textValue(booking.type, "到店预约"),
    phone: textValue(booking.time, "待确认时间"),
    source: "到店预约",
    store: "主门店",
    status: textValue(booking.status, "待跟进"),
    action: "跟进",
    raw: booking,
  };
}

function mapConsultation(consultation) {
  return {
    id: consultation.id,
    customer: textValue(consultation.topic, "定制咨询"),
    phone: textValue(consultation.contact, "待留联系方式"),
    source: "AI / 前台咨询",
    store: textValue(consultation.productId, "未绑定商品"),
    status: textValue(consultation.status, "待跟进"),
    action: "跟进",
    raw: consultation,
  };
}

function applyBackendStore(store) {
  const products = Array.isArray(store.products) ? store.products.map(mapProduct) : [];
  const cases = Array.isArray(store.cases) ? store.cases.map(mapCase) : [];
  const orders = Array.isArray(store.orders) ? store.orders.map(mapOrder) : [];
  const hasStoreInfo = store.storeInfo && ["name", "address", "phone", "hours"].some((key) => textValue(store.storeInfo[key]));
  const stores = hasStoreInfo ? [mapStore(store.storeInfo)] : [];
  const bookings = Array.isArray(store.bookings) ? store.bookings.map(mapBooking) : [];
  const consultations = Array.isArray(store.consultations) ? store.consultations.map(mapConsultation) : [];
  const leads = [...consultations, ...bookings];
  const todaySales = orders.reduce((sum, order) => sum + moneyValue(order.amount), 0);
  const pendingOrders = orders.filter((item) => ["待确认", "待付款"].includes(item.status)).length;
  const deliveryOrders = orders.filter((item) => item.status === "待发货").length;

  replaceRows(data.products, products);
  replaceRows(data.cases, cases);
  replaceRows(data.orders, orders);
  replaceRows(data.stores, stores);
  replaceRows(data.leads, leads);
  replaceRows(data.dashboardOrders, orders.slice(0, 4).map((order) => ({
    id: order.id,
    no: order.no,
    member: order.member,
    amount: order.amount,
    status: order.status,
    action: order.action,
    raw: order.raw,
  })));
  replaceRows(data.stats, [
    { label: "订单总数", value: String(orders.length || 0) },
    { label: "订单金额", value: `¥${todaySales.toLocaleString("zh-CN")}` },
    { label: "上架产品", value: String(products.filter((item) => item.status === "在售").length) },
    { label: "待处理事项", value: String(pendingOrders + deliveryOrders + leads.filter((item) => item.status !== "已成交").length), tone: "warm" },
  ]);
  pageConfigs.products.total = `共 ${products.length} 条`;
  pageConfigs.cases.total = `共 ${cases.length} 条`;
  pageConfigs.orders.total = `共 ${orders.length} 条`;
  pageConfigs.stores.total = `共 ${stores.length} 条`;
  pageConfigs.leads.total = `共 ${leads.length} 条`;
}

async function loadBackendData({ silent = false } = {}) {
  state.backend.loading = true;
  try {
    const store = await apiRequest("/admin/data");
    state.backend = {
      connected: true,
      loading: false,
      error: "",
      store,
    };
    applyBackendStore(store);
    if (!silent) showToast("后台数据已连接");
  } catch (error) {
    state.backend = {
      ...state.backend,
      connected: false,
      loading: false,
      error: error.message,
    };
    if (!silent) showToast(`后端未连接：${error.message}`);
  }
  render();
}

function statusClass(status) {
  if (["已完成", "已成交", "已发布", "营业", "在售", "进行中", "启用", "成功", "已上线"].includes(status)) return "is-success";
  if (["已发货", "精选"].includes(status)) return "is-info";
  if (["退款中", "下架"].includes(status)) return "is-danger";
  if (["待发货", "待跟进", "跟进中", "待上线", "草稿", "筹备中", "待配置", "待生效"].includes(status)) return "is-wait";
  return "is-muted";
}

function renderStatus(status) {
  return `<span class="status-pill ${statusClass(status)}">${escapeHtml(status)}</span>`;
}

function rowText(row) {
  return Object.values(row).join(" ").toLowerCase();
}

function filterRows(rows, config = {}) {
  const keyword = state.search.trim().toLowerCase();
  const activeTab = config.tabKey ? state.tabs[config.tabKey] : "全部";
  return rows.filter((row) => {
    const tabMatched = !config.tabKey || activeTab === "全部" || row.status === activeTab || row.type === activeTab;
    const searchMatched = !keyword || rowText(row).includes(keyword);
    return tabMatched && searchMatched;
  });
}

function renderNav() {
  nodes.nav.innerHTML = navItems
    .map(
      (item) => `
        <button class="nav-button ${item.id === state.section ? "is-active" : ""}" type="button" data-section="${item.id}">
          ${icon(item.icon)}
          <span>${item.label}</span>
        </button>
      `
    )
    .join("");
}

function setTitle(title, crumb = "品牌后台") {
  nodes.title.textContent = title;
  nodes.crumb.textContent = crumb;
}

function renderTable(columns, rows) {
  const emptyColspan = columns.length;
  return `
    <table class="data-table">
      <thead>
        <tr>${columns.map((column) => `<th>${escapeHtml(column.label || column)}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${
          rows.length
            ? rows
                .map(
                  (row) => `
                    <tr>
                      ${columns.map((column) => `<td>${renderCell(column, row)}</td>`).join("")}
                    </tr>
                  `
                )
                .join("")
            : `<tr><td colspan="${emptyColspan}"><div class="empty-state">没有匹配的数据</div></td></tr>`
        }
      </tbody>
    </table>
  `;
}

function renderCell(column, row) {
  const key = typeof column === "string" ? column : column.key;
  const type = typeof column === "string" ? "" : column.type;
  const value = row[key] ?? "";

  if (type === "status") return renderStatus(value);
  if (type === "action") {
    return `<button class="action-link" type="button" data-row-action="${escapeHtml(value)}" data-row-id="${escapeHtml(row.id || "")}">${escapeHtml(value)}</button>`;
  }
  if (type === "thumb") {
    return `
      <span class="mini-cell">
        <span class="mini-thumb" aria-hidden="true"></span>
        <strong>${escapeHtml(value)}</strong>
      </span>
    `;
  }
  if (type === "avatar") {
    return `
      <span class="mini-cell">
        <span class="mini-avatar" aria-hidden="true"></span>
        <strong>${escapeHtml(value)}</strong>
      </span>
    `;
  }
  return escapeHtml(value);
}

function renderFilters(filters = []) {
  if (!filters.length) return "";
  return `
    <div class="filter-group">
      ${filters.map((filter) => `<button class="filter-chip" type="button" data-filter="${filter}">${filter}</button>`).join("")}
    </div>
  `;
}

function renderTabs(config) {
  if (!config.tabs?.length) return "";
  const active = state.tabs[config.tabKey];
  return `
    <div class="tab-row">
      ${config.tabs
        .map(
          (tab) => `
            <button class="tab-button ${tab === active ? "is-active" : ""}" type="button" data-tab-key="${config.tabKey}" data-tab="${tab}">
              ${tab}
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

function renderSearch(placeholder) {
  if (!placeholder) return "";
  return `
    <label class="table-search">
      ${icon("search")}
      <input type="search" value="${escapeHtml(state.search)}" placeholder="${escapeHtml(placeholder)}" data-table-search />
    </label>
  `;
}

function renderFooter(total) {
  return `
    <div class="table-footer">
      <span>${escapeHtml(total || "共 0 条")}</span>
      <button class="page-dot is-active" type="button">1</button>
      <button class="page-dot" type="button">2</button>
      <button class="page-dot" type="button">3</button>
    </div>
  `;
}

function renderField(label, value = "", options = {}) {
  const type = options.type || "text";
  const placeholder = options.placeholder || "输入";
  const name = options.name ? ` name="${escapeHtml(options.name)}"` : "";
  return `
    <label class="form-field ${options.wide ? "is-wide" : ""}">
      <span>${escapeHtml(label)}</span>
      <input${name} type="${escapeHtml(type)}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" />
    </label>
  `;
}

function renderSelectField(label, choices = [], active = "", options = {}) {
  const name = options.name ? ` name="${escapeHtml(options.name)}"` : "";
  return `
    <label class="form-field ${options.wide ? "is-wide" : ""}">
      <span>${escapeHtml(label)}</span>
      <select${name}>
        ${choices.map((choice) => `<option ${choice === active ? "selected" : ""}>${escapeHtml(choice)}</option>`).join("")}
      </select>
    </label>
  `;
}

function renderUploadSlot(label = "上传图片") {
  return `
    <button class="upload-slot" type="button" data-add-action="${escapeHtml(label)}">
      <span>+</span>
    </button>
  `;
}

function renderSwitch(checked = true) {
  return `<button class="switch ${checked ? "is-on" : ""}" type="button" aria-label="开关"></button>`;
}

function renderRichEditor(label, placeholder = "编辑内容...", options = {}) {
  const name = options.name ? ` name="${escapeHtml(options.name)}"` : "";
  const value = options.value || "";
  return `
    <div class="rich-editor">
      <span>${escapeHtml(label)}</span>
      <div class="editor-toolbar" aria-hidden="true">
        <b>B</b><i>I</i><span>≡</span>
      </div>
      <textarea${name} rows="3" placeholder="${escapeHtml(placeholder)}">${escapeHtml(value)}</textarea>
    </div>
  `;
}

function renderDetailHead(title, primary = "保存") {
  return `
    <div class="detail-head">
      <h2>${escapeHtml(title)}</h2>
      <div class="row-actions">
        <button class="ghost-button" type="button" data-back>取消</button>
        <button class="primary-button" type="button" data-save-action="${escapeHtml(primary)}">${escapeHtml(primary)}</button>
      </div>
    </div>
  `;
}

function selectedRow(section = state.section) {
  const rows = pageConfigs[section]?.rows || [];
  if (!state.selectedId) return {};
  return rows.find((row) => row.id === state.selectedId) || rows[0] || {};
}

function selectedRaw(section = state.section) {
  return selectedRow(section).raw || {};
}

function collectDetailValues() {
  const values = {};
  document.querySelectorAll(".detail-page [name]").forEach((field) => {
    values[field.name] = field.value;
  });
  return values;
}

function currentDetailActive() {
  const switchButton = document.querySelector(".detail-page .switch");
  return !switchButton || switchButton.classList.contains("is-on");
}

async function saveCurrentDetail(actionLabel = "保存") {
  const values = collectDetailValues();
  if (state.detail === "product-edit") {
    const existingId = values.id || state.selectedId;
    const payload = {
      ...selectedRaw("products"),
      ...values,
      id: existingId || slugValue(values.name, "product"),
      price: moneyValue(values.price),
      active: currentDetailActive(),
    };
    const path = existingId ? `/admin/products/${encodeURIComponent(existingId)}` : "/admin/products";
    const method = existingId ? "PUT" : "POST";
    await apiRequest(path, { method, body: JSON.stringify(payload) });
    await loadBackendData({ silent: true });
    showToast("产品已保存到后端");
    return;
  }

  if (state.detail === "case-edit") {
    const existingId = values.id || state.selectedId;
    const payload = {
      ...selectedRaw("cases"),
      ...values,
      id: existingId || slugValue(values.title, "case"),
      active: currentDetailActive(),
    };
    const path = existingId ? `/admin/cases/${encodeURIComponent(existingId)}` : "/admin/cases";
    const method = existingId ? "PUT" : "POST";
    await apiRequest(path, { method, body: JSON.stringify(payload) });
    await loadBackendData({ silent: true });
    showToast("案例已保存到后端");
    return;
  }

  if (state.detail === "store-edit") {
    await apiRequest("/admin/store", { method: "PATCH", body: JSON.stringify(values) });
    await loadBackendData({ silent: true });
    showToast("门店信息已保存到后端");
    return;
  }

  if (state.detail === "order-detail") {
    const order = selectedRaw("orders");
    if (!order.id) throw new Error("没有选中的订单");
    await apiRequest(`/admin/orders/${encodeURIComponent(order.id)}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: "待收货",
        carrier: values.carrier,
        logisticsNo: values.logisticsNo,
        currentNode: values.logisticsNo ? `已发货，${values.carrier || "快递"}：${values.logisticsNo}` : "已发货，等待物流揽收",
        logisticsNode: `${new Date().toLocaleString("zh-CN", { hour12: false })} 后台确认发货`,
      }),
    });
    await loadBackendData({ silent: true });
    showToast("订单已发货并写入后端");
    return;
  }

  showToast(`「${actionLabel}」已预留，下一步可补对应接口`);
}

function renderProductEditor() {
  setTitle("产品管理 / 编辑产品", "产品管理 / 第二层");
  const product = selectedRaw("products");
  const isActive = product.active !== false;
  return `
    <section class="detail-page">
      ${renderDetailHead("产品管理 / 编辑产品", "保存并上架")}
      <div class="detail-grid">
        <div class="detail-card">
          <input type="hidden" name="id" value="${escapeHtml(product.id || "")}" />
          <div class="form-grid">
            ${renderField("产品名称", product.name || "", { name: "name", placeholder: "输入产品名称" })}
            ${renderField("价格", product.price || "", { name: "price", placeholder: "输入售价" })}
            ${renderSelectField("分类", ["车挂", "包挂", "礼盒", "配件", "果壳铃", "定制"], product.type || "车挂", { name: "type" })}
            ${renderSelectField("品牌", ["果壳铃"], "果壳铃")}
          </div>
          <div class="field-block">
            <span>图集</span>
            <div class="upload-row">
              ${renderUploadSlot("添加图片")}
              <span class="thumb-box"></span>
              <span class="thumb-box"></span>
            </div>
          </div>
          ${renderRichEditor("详情（富文本）", "描述商品故事、材质、铃音和保养方式...", { name: "story", value: product.story || "" })}
        </div>
        <aside class="detail-card side-card">
          <h3>规格 SKU（售价/尺寸/库存）</h3>
          <table class="mini-table">
            <thead><tr><th>规格</th><th>价格</th><th>库存</th></tr></thead>
            <tbody>
              <tr><td colspan="3"><div class="empty-state">暂无规格</div></td></tr>
            </tbody>
          </table>
          <button class="line-button" type="button" data-add-action="添加规格">+ 添加规格</button>
          ${renderField("库存", product.stock || "", { name: "stock", wide: true, placeholder: "输入库存" })}
          ${renderField("关键词", Array.isArray(product.tags) ? product.tags.join(",") : "", { name: "tags", wide: true })}
          <div class="side-row"><span>上架状态</span>${renderSwitch(isActive)}</div>
        </aside>
      </div>
    </section>
  `;
}

function renderCaseEditor() {
  setTitle("案例管理 / 编辑案例", "案例管理 / 第二层");
  const caseItem = selectedRaw("cases");
  return `
    <section class="detail-page">
      ${renderDetailHead("案例管理 / 编辑案例", "保存")}
      <div class="detail-grid">
        <div class="detail-card">
          <input type="hidden" name="id" value="${escapeHtml(caseItem.id || "")}" />
          <div class="form-grid">
            ${renderField("案例标题", caseItem.title || "", { name: "title", placeholder: "输入案例标题" })}
            ${renderField("场景", caseItem.scene || "", { name: "scene", placeholder: "输入使用场景" })}
          </div>
          <div class="field-block">
            <span>封面图</span>
            ${renderUploadSlot("上传封面")}
          </div>
          ${renderRichEditor("图文内容（富文本）", "记录搭配思路、材料、适用场景...", { name: "summary", value: caseItem.summary || "" })}
        </div>
        <aside class="detail-card side-card">
          <h3>标签</h3>
          <div class="tag-row"><button class="tag-button is-active" type="button">风格</button><button class="tag-button" type="button">故事</button><button class="tag-button" type="button">+</button></div>
          ${renderField("案例分类", caseItem.type || "车挂", { name: "type", wide: true })}
          <button class="side-link" type="button">关联产品 <span>›</span></button>
          <button class="side-link" type="button">承接门店 <span>›</span></button>
          <div class="side-row"><span>首页精选</span>${renderSwitch(caseItem.active !== false)}</div>
        </aside>
      </div>
    </section>
  `;
}

function renderOrderDetail() {
  setTitle("订单管理 / 订单详情", "订单管理 / 第二层");
  const order = selectedRaw("orders");
  const hasOrder = Boolean(order.id || order.orderNo);
  return `
    <section class="detail-page">
      <div class="detail-head">
        <h2>订单管理 / 订单详情</h2>
        ${renderStatus(order.status || "待确认")}
      </div>
      <div class="detail-grid">
        <div class="detail-card">
          <h3>商品明细</h3>
          ${
            hasOrder
              ? `<table class="mini-table order-lines">
                  <thead><tr><th>商品</th><th>数量</th><th>小计</th></tr></thead>
                  <tbody><tr><td>${escapeHtml(order.productName || "未命名商品")}</td><td>×${escapeHtml(order.quantity || 1)}</td><td>¥${escapeHtml(order.price || 0)}</td></tr></tbody>
                </table>`
              : `<div class="empty-state">暂无订单商品</div>`
          }
          <div class="price-list">
            <p><span>优惠券 / 积分抵扣</span><strong>-¥0</strong></p>
            <p><span>运费</span><strong>¥0</strong></p>
            <p><span>实付</span><strong class="price-blue">¥${escapeHtml(order.price || 0)}</strong></p>
          </div>
          <p class="address-line">${escapeHtml(order.address || "待补充地址")} · ${escapeHtml(order.receiver || "顾客")}</p>
        </div>
        <aside class="detail-card side-card">
          <h3>订单信息</h3>
          <p class="muted-line">订单号：${escapeHtml(order.orderNo || "待生成")}</p>
          <p class="muted-line">来源：${escapeHtml(order.source || "前台提交")}</p>
          <p class="muted-line">支付：${escapeHtml(order.paidAt || "待确认")}</p>
          ${renderSelectField("快递公司", ["待选择", "圆通公司", "顺丰速运", "中通快递"], order.carrier || "待选择", { name: "carrier", wide: true })}
          ${renderField("运单号", order.logisticsNo || "", { name: "logisticsNo", wide: true, placeholder: "填写物流单号" })}
          <button class="full-button" type="button" data-save-action="确认发货">确认发货</button>
        </aside>
      </div>
    </section>
  `;
}

function renderStoreEditor() {
  setTitle("门店管理 / 编辑门店", "门店管理 / 第二层");
  const store = selectedRaw("stores");
  return `
    <section class="detail-page">
      ${renderDetailHead("门店管理 / 编辑门店", "保存")}
      <div class="detail-grid">
        <div class="detail-card">
          <div class="form-grid">
            ${renderField("门店名称", store.name || store.store || "", { name: "name", placeholder: "输入门店名称" })}
            ${renderField("电话", store.phone || "", { name: "phone", placeholder: "输入联系电话" })}
            ${renderField("营业时间", store.hours || "", { name: "hours", placeholder: "例如 10:00 - 22:00" })}
            ${renderField("地址（地图选点）", store.address || "", { name: "address", wide: true, placeholder: "输入门店地址" })}
            ${renderField("经度", store.longitude || "", { name: "longitude", placeholder: "例如 120.127000" })}
            ${renderField("纬度", store.latitude || "", { name: "latitude", placeholder: "例如 30.245000" })}
          </div>
          <div class="map-box">地图 · 拖动选点</div>
          <div class="field-block">
            <span>门店图</span>
            <div class="upload-row">${renderUploadSlot("添加门店图")}<span class="thumb-box"></span></div>
          </div>
        </div>
        <aside class="detail-card side-card">
          <button class="side-link" type="button">发货规则 <span>›</span></button>
          <button class="side-link" type="button">绑定门店导购 <span>›</span></button>
          <div class="side-row"><span>营业状态</span>${renderSwitch(true)}</div>
        </aside>
      </div>
    </section>
  `;
}

function renderMemberDetail() {
  setTitle("会员管理 / 会员详情", "会员管理 / 第二层");
  const member = selectedRow("members");
  return `
    <section class="detail-page">
      <div class="detail-head"><h2>会员管理 / 会员详情</h2></div>
      <div class="member-layout">
        <div class="detail-card">
          <div class="member-profile">
            <span class="mini-avatar is-large"></span>
            <div><h3>${escapeHtml(member.member || "暂无会员")}</h3><p>手机号：${escapeHtml(member.phone || "暂无")} · ${escapeHtml(member.level || "暂无等级")}</p></div>
          </div>
          <h3>订单历史</h3>
          ${renderTable(
            [
              { key: "no", label: "订单号" },
              { key: "amount", label: "金额" },
              { key: "status", label: "状态", type: "status" },
            ],
            []
          )}
        </div>
        <aside class="detail-card side-card">
          <div class="points-card"><span>积分</span><strong>${escapeHtml(member.points || "0")}</strong><button type="button">手动调整</button></div>
          <h3>积分流水</h3>
          <div class="empty-state">暂无积分流水</div>
          <button class="tag-button is-active" type="button">优惠券</button>
        </aside>
      </div>
    </section>
  `;
}

function renderCouponEditor() {
  setTitle("营销中心 / 创建优惠券", "营销中心 / 第二层");
  return `
    <section class="detail-page">
      ${renderDetailHead("营销中心 / 创建优惠券", "保存")}
      <div class="detail-card">
        <div class="form-grid form-grid-three">
          ${renderField("券名称", "")}
          ${renderSelectField("适用范围", ["全部 / 指定分类", "指定产品", "指定门店"], "全部 / 指定分类")}
          <div class="form-field is-wide">
            <span>发放类型</span>
            <div class="segmented">
              <button class="is-active" type="button">满减</button>
              <button type="button">折扣</button>
              <button type="button">无门槛</button>
            </div>
          </div>
          ${renderField("有效期", "", { type: "date" })}
          ${renderSelectField("领取门槛", ["无门槛", "会员等级", "指定来源"], "无门槛")}
          ${renderField("发放数量", "")}
          ${renderField("面额", "¥")}
          ${renderSelectField("领取门槛", ["消费满", "不限"], "消费满")}
          ${renderField("发放数量", "限量")}
        </div>
      </div>
    </section>
  `;
}

function renderBannerEditor() {
  setTitle("内容管理 / 首页 Banner 与运营位", "内容管理 / 第二层");
  return `
    <section class="detail-page">
      <div class="detail-head">
        <h2>内容管理 / 首页 Banner 与运营位</h2>
        <button class="primary-button" type="button" data-add-action="新增 Banner">+ 新增</button>
      </div>
      <div class="detail-card">
        <h3>Banner（可拖动排序）</h3>
        <div class="banner-list">
          ${["森系手作 · 新店扩展", "端午特惠 · 晒包活动"].map(
            (title, index) => `
              <div class="banner-row">
                <span class="drag-dot">⋮⋮</span>
                <span class="thumb-box is-wide-thumb"></span>
                <strong>Banner ${index + 1} 标题 · ${title}</strong>
                <small>${index === 0 ? "投放中" : "未开始"}</small>
                ${renderSwitch(index === 0)}
                <button class="icon-button" type="button" data-add-action="编辑 Banner">✎</button>
              </div>
            `
          ).join("")}
        </div>
        <div class="form-grid">
          ${renderField("轮播广告位", "首页第一小品")}
          ${renderField("精选案例位", "首页第三小品")}
        </div>
      </div>
    </section>
  `;
}

function renderLeadDetail() {
  setTitle("线索管理 / 线索详情", "线索管理 / 第二层");
  const lead = selectedRow("leads");
  const raw = lead.raw || {};
  const isBooking = lead.source === "到店预约";
  const demand = isBooking
    ? [raw.type, raw.time, raw.note].filter(Boolean).join(" / ")
    : [raw.topic, raw.message].filter(Boolean).join(" / ");
  return `
    <section class="detail-page">
      <div class="detail-head">
        <h2>线索管理 / 线索详情</h2>
        ${renderStatus(lead.status || "待跟进")}
      </div>
      <div class="detail-grid">
        <div class="detail-card">
          <h3>客户信息</h3>
          <p class="muted-line">来源：${escapeHtml(lead.source || "前台提交")}</p>
          <p class="muted-line">联系信息：${escapeHtml(lead.phone || "待补充")}</p>
          <p class="muted-line">关联：${escapeHtml(lead.store || "主门店")}</p>
          ${renderField("需求描述", demand || "待补充需求", { wide: true })}
          ${renderSelectField("线索阶段", ["待跟进", "跟进中", "已成交", "已关闭"], lead.status || "待跟进", { wide: true })}
        </div>
        <aside class="detail-card side-card">
          <h3>跟进记录</h3>
          <ol class="timeline">
            <li><strong>前台提交：${escapeHtml(lead.customer || "新线索")}</strong><span>${escapeHtml(raw.createdAt || "刚刚")} · 系统</span></li>
            <li><strong>等待门店确认</strong><span>建议优先确认预算、用途、时间和联系方式</span></li>
          </ol>
          ${renderField("跟进内容", "", { wide: true, placeholder: "填写跟进记录..." })}
          <button class="full-button" type="button" data-add-action="提交跟进">提交</button>
        </aside>
      </div>
    </section>
  `;
}

function renderAccountRoles() {
  setTitle("系统设置 / 账号与权限", "系统设置 / 第二层");
  const columns = [
    { key: "role", label: "账号" },
    { key: "name", label: "角色" },
    { key: "scope", label: "门店" },
    { key: "status", label: "状态", type: "status" },
    { key: "action", label: "操作", type: "action" },
  ];
  const rows = [];
  return `
    <section class="detail-page">
      <div class="detail-head">
        <h2>系统设置 / 账号与权限</h2>
        <button class="primary-button" type="button" data-add-action="新增角色">+ 新增角色</button>
      </div>
      <div class="detail-card">
        ${renderTable(columns, rows)}
        <p class="hint-line">账号和权限表已经建好，接入登录接口后这里会显示真实后台账号。</p>
      </div>
    </section>
  `;
}

function renderFallbackSecondary(id) {
  const page = secondaryPages[id];
  if (!page) {
    state.detail = "";
    return renderContent();
  }

  const parentLabel = navItems.find((item) => item.id === page.parent)?.label || "品牌后台";
  setTitle(page.title, `${parentLabel} / 第二层`);
  const columns = page.columns.map((label, index) => ({ key: `col${index}`, label, type: label === "状态" ? "status" : label === "操作" ? "action" : "" }));
  const rows = [];

  return `
    <section class="secondary-panel">
      <div class="secondary-head">
        <div>
          <h2>${escapeHtml(page.title)}</h2>
          <p>${escapeHtml(page.desc)}</p>
        </div>
        <div class="row-actions">
          <button class="ghost-button" type="button" data-back>返回</button>
          <button class="primary-button" type="button" data-add-action="保存配置">保存配置</button>
        </div>
      </div>
      ${renderTable(columns, rows)}
      ${renderFooter("共 " + rows.length + " 条")}
    </section>
  `;
}

function renderDashboard() {
  setTitle("数据看板", "品牌后台");
  const columns = [
    { key: "no", label: "订单号" },
    { key: "member", label: "会员" },
    { key: "amount", label: "金额" },
    { key: "status", label: "状态", type: "status" },
    { key: "action", label: "操作", type: "action" },
  ];
  const pendingCount = data.orders.filter((item) => ["待确认", "待付款"].includes(item.status)).length;
  const deliveryCount = data.orders.filter((item) => item.status === "待发货").length;
  const bookingCount = data.leads.filter((item) => item.source === "到店预约").length;
  const consultCount = data.leads.filter((item) => item.source !== "到店预约" && item.status !== "已成交").length;

  return `
    <div class="content-stack">
      <div class="stat-grid">
        ${data.stats
          .map(
            (item) => `
              <article class="stat-card ${item.tone === "warm" ? "is-warm" : ""}">
                <span>${item.label}</span>
                <strong>${item.value}</strong>
              </article>
            `
          )
          .join("")}
      </div>

      <section class="ops-grid" aria-label="今日待办">
        <button type="button" data-section-shortcut="orders" data-tab-shortcut="待确认">
          <span>待确认订单</span>
          <strong>${pendingCount}</strong>
          <em>先确认库存和联系方式</em>
        </button>
        <button type="button" data-section-shortcut="orders" data-tab-shortcut="待发货">
          <span>待发货</span>
          <strong>${deliveryCount}</strong>
          <em>补快递公司和单号</em>
        </button>
        <button type="button" data-section-shortcut="leads">
          <span>到店预约</span>
          <strong>${bookingCount}</strong>
          <em>确认时间、选品和自提</em>
        </button>
        <button type="button" data-section-shortcut="leads">
          <span>定制咨询</span>
          <strong>${consultCount}</strong>
          <em>绳色、铃音、礼盒需求</em>
        </button>
      </section>

      <section class="section-panel">
        <div class="section-head">
          <div>
            <h2>最近订单</h2>
            <p>同步前台提交的订单，优先处理待确认和待发货。</p>
          </div>
          <div class="filter-group">
            <button class="filter-chip" type="button">全部状态</button>
            <button class="filter-chip" type="button">近 7 天</button>
          </div>
        </div>
        ${renderTable(columns, filterRows(data.dashboardOrders))}
      </section>
    </div>
  `;
}

function renderListPage(section) {
  const config = pageConfigs[section];
  setTitle(config.title, "品牌后台");
  const rows = filterRows(config.rows, config);

  return `
    <section class="section-panel">
      <div class="section-head">
        <div>
          <h2>${escapeHtml(config.title)}</h2>
          <p>${escapeHtml(config.desc || "支持筛选、搜索、分页与行操作。")}</p>
        </div>
        ${
          config.addLabel
            ? `<button class="primary-button" type="button" data-add-action="${escapeHtml(config.addLabel)}">+ ${escapeHtml(config.addLabel)}</button>`
            : ""
        }
      </div>
      ${renderTabs(config)}
      <div class="tool-row">
        ${renderFilters(config.filters)}
        ${renderSearch(config.search)}
      </div>
      ${renderTable(config.columns, rows)}
      ${renderFooter(config.total)}
    </section>
  `;
}

function renderCards(cards, type) {
  const isSetting = type === "settings";
  const wrapper = isSetting ? "setting-list" : "card-grid";
  const cardClass = isSetting ? "setting-card" : "module-card";

  return `
    <div class="${wrapper}">
      ${cards
        .map(
          (card) => `
            <button class="${cardClass}" type="button" data-detail="${card.id}">
              ${icon(card.icon)}
              <span>
                <h3>${escapeHtml(card.title)}</h3>
                <p>${escapeHtml(card.desc)}</p>
              </span>
              <span class="chevron" aria-hidden="true">›</span>
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

function detailForAction(section, label) {
  const routes = {
    dashboard: "order-detail",
    products: "product-edit",
    cases: "case-edit",
    orders: "order-detail",
    stores: "store-edit",
    members: "member-detail",
    leads: "lead-detail",
  };
  if (label === "编辑" || label === "详情" || label === "发货" || label === "处理" || label === "跟进" || label === "查看" || label === "查看物流") {
    return routes[section] || "";
  }
  return "";
}

function detailForAdd(section) {
  const routes = {
    products: "product-edit",
    cases: "case-edit",
    stores: "store-edit",
    marketing: "coupon-create",
  };
  return routes[section] || "";
}

function renderContentHome() {
  setTitle("内容管理", "品牌后台");
  return `
    <section class="section-panel">
      <div class="section-head">
        <div>
          <h2>内容管理</h2>
          <p>首页运营内容与品牌信息统一入口。</p>
        </div>
      </div>
      ${renderCards(contentCards, "content")}
    </section>
  `;
}

function renderSettingsHome() {
  setTitle("系统设置", "品牌后台");
  return `
    <section class="section-panel">
      <div class="section-head">
        <div>
          <h2>系统设置</h2>
          <p>账号、支付、物流和基础配置集中管理。</p>
        </div>
      </div>
      ${renderCards(settingsCards, "settings")}
    </section>
  `;
}

function renderSecondaryPage(id) {
  const renderers = {
    "product-edit": renderProductEditor,
    "case-edit": renderCaseEditor,
    "order-detail": renderOrderDetail,
    "store-edit": renderStoreEditor,
    "member-detail": renderMemberDetail,
    "coupon-create": renderCouponEditor,
    "lead-detail": renderLeadDetail,
    banner: renderBannerEditor,
    account: renderAccountRoles,
  };
  return renderers[id] ? renderers[id]() : renderFallbackSecondary(id);
}

function renderContent() {
  if (state.detail) return renderSecondaryPage(state.detail);
  if (state.section === "dashboard") return renderDashboard();
  if (state.section === "content") return renderContentHome();
  if (state.section === "settings") return renderSettingsHome();
  return renderListPage(state.section);
}

function render() {
  renderNav();
  nodes.content.innerHTML = renderContent();
  nodes.search.value = state.search;
  if (nodes.status) {
    nodes.status.textContent = state.backend.loading ? "连接中" : state.backend.connected ? "数据已连接" : "本地预览";
    nodes.status.classList.toggle("is-online", state.backend.connected);
    nodes.status.classList.toggle("is-offline", !state.backend.loading && !state.backend.connected);
  }
}

function bindEvents() {
  nodes.nav.addEventListener("click", (event) => {
    const button = event.target.closest("[data-section]");
    if (!button) return;
    state.section = button.dataset.section;
    state.detail = "";
    state.selectedId = "";
    state.search = "";
    render();
  });

  nodes.search.addEventListener("input", (event) => {
    state.search = event.target.value;
    render();
  });

  nodes.content.addEventListener("input", (event) => {
    if (!event.target.matches("[data-table-search]")) return;
    state.search = event.target.value;
    render();
  });

  nodes.content.addEventListener("click", (event) => {
    const shortcut = event.target.closest("[data-section-shortcut]");
    if (shortcut) {
      state.section = shortcut.dataset.sectionShortcut;
      state.detail = "";
      state.selectedId = "";
      state.search = "";
      if (shortcut.dataset.tabShortcut && state.tabs[state.section] !== undefined) {
        state.tabs[state.section] = shortcut.dataset.tabShortcut;
      }
      render();
      return;
    }

    const tab = event.target.closest("[data-tab-key]");
    if (tab) {
      state.tabs[tab.dataset.tabKey] = tab.dataset.tab;
      render();
      return;
    }

    const detail = event.target.closest("[data-detail]");
    if (detail) {
      state.detail = detail.dataset.detail;
      render();
      return;
    }

    if (event.target.closest("[data-back]")) {
      state.detail = "";
      state.selectedId = "";
      render();
      return;
    }

    const switchButton = event.target.closest(".switch");
    if (switchButton) {
      switchButton.classList.toggle("is-on");
      return;
    }

    const save = event.target.closest("[data-save-action]");
    if (save) {
      saveCurrentDetail(save.dataset.saveAction).catch((error) => showToast(error.message));
      return;
    }

    const action = event.target.closest("[data-row-action]");
    if (action) {
      const detail = detailForAction(state.section, action.dataset.rowAction);
      if (detail) {
        state.selectedId = action.dataset.rowId || "";
        state.detail = detail;
        render();
        return;
      }
      showToast(`已进入「${action.dataset.rowAction}」处理流程`);
      return;
    }

    const add = event.target.closest("[data-add-action]");
    if (add) {
      const detail = detailForAdd(state.section);
      if (detail && !state.detail) {
        state.selectedId = "";
        state.detail = detail;
        render();
        return;
      }
      showToast(`「${add.dataset.addAction}」已预留，下一步可接表单与接口`);
      return;
    }

    const filter = event.target.closest("[data-filter]");
    if (filter) {
      showToast(`已选择「${filter.dataset.filter}」筛选`);
    }
  });
}

bindEvents();
render();
loadBackendData();
