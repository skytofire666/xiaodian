const assetPath = "./assets/forest-bell-dark.png";

let products = [
  {
    id: "walnut-bell",
    name: "核桃平安铃",
    type: "果壳铃",
    price: 68,
    tags: ["清亮", "现货", "车挂"],
    material: "老核桃壳、黄铜铃、棉蜡线、木珠",
    specs: "约 4.8cm / 26g",
    cycle: "现货 24 小时内发出",
    stock: "现货 12 件",
    tone: "清亮偏脆，适合车内和包挂",
    care: "保持干燥，黄铜部分可用软布轻擦",
    story: "保留核壳天然纹路，搭配小铜铃和墨绿色挂绳，适合作为平安礼物。",
    thumbX: "47%",
    thumbY: "58%",
  },
  {
    id: "moss-tassel",
    name: "苔影流苏包挂",
    type: "包挂",
    price: 56,
    tags: ["森系", "轻定制", "礼物"],
    material: "棉线流苏、黄铜叶片、小铃、木珠",
    specs: "约 12cm / 18g",
    cycle: "下单后 2-3 天制作",
    stock: "可定制绳色",
    tone: "声音轻柔，适合日常包挂",
    care: "流苏可轻梳，避免长时间挤压",
    story: "用低饱和绿线和黄铜叶片做出森林边缘的层次感，适合通勤包和帆布包。",
    thumbX: "26%",
    thumbY: "84%",
  },
  {
    id: "teal-car",
    name: "青藤车挂铃",
    type: "车挂",
    price: 88,
    tags: ["车挂", "礼盒", "人气"],
    material: "核桃壳、青绿色蜡线、黄铜铃、合金叶片",
    specs: "约 16cm / 35g",
    cycle: "现货 48 小时内发出",
    stock: "现货 6 件",
    tone: "低频更稳，轻晃有铜铃回声",
    care: "车内高温时避免长期暴晒",
    story: "青绿色绳结更醒目，适合挂在后视镜，也可加礼盒包装送新车朋友。",
    thumbX: "73%",
    thumbY: "78%",
  },
  {
    id: "berry-gift",
    name: "山莓祝福礼盒",
    type: "礼盒",
    price: 128,
    tags: ["礼盒", "祝福卡", "节日"],
    material: "果壳铃、干花卡、牛皮纸礼盒、麻绳",
    specs: "礼盒约 15cm x 11cm",
    cycle: "下单后 1-2 天打包",
    stock: "礼盒库存 9 份",
    tone: "可选清亮铃或柔和铃",
    care: "礼盒内含保养卡和防潮小袋",
    story: "为生日、乔迁和新车礼物设计，默认搭配干花卡，可备注祝福语。",
    thumbX: "18%",
    thumbY: "28%",
  },
  {
    id: "seed-mini",
    name: "种子小铃挂件",
    type: "果壳铃",
    price: 39,
    tags: ["入门", "小巧", "多色"],
    material: "小果壳、迷你铜铃、彩色棉线",
    specs: "约 3.6cm / 12g",
    cycle: "现货 24 小时内发出",
    stock: "现货 20 件",
    tone: "声音细小，适合钥匙和小包",
    care: "避免与尖锐钥匙长期摩擦",
    story: "尺寸更轻，适合第一次购买或多人伴手礼，可选墨绿、酒红、青蓝三色。",
    thumbX: "39%",
    thumbY: "72%",
  },
  {
    id: "custom-kit",
    name: "配件定制包",
    type: "定制",
    price: 19,
    tags: ["加购", "换色", "配件"],
    material: "挂绳、木珠、黄铜叶片、小铃、包装卡",
    specs: "按方案组合",
    cycle: "随主商品制作",
    stock: "按需搭配",
    tone: "可换清亮铃或柔和铃",
    care: "配件随主商品一起保养",
    story: "用于补足轻定制需求，把复杂沟通拆成绳色、铃音、配件、包装四个选项。",
    thumbX: "80%",
    thumbY: "34%",
  },
];

let cases = [
  {
    id: "new-car",
    title: "新车平安礼",
    type: "车挂",
    scene: "用户想送朋友新车礼物，需要不夸张、声音不吵、包装体面。",
    summary: "青藤车挂铃 + 山莓祝福礼盒，备注祝福卡。",
    result: "转化动作放在“同款购买”，定制需求放到咨询，不让用户反复截图沟通。",
    productIds: ["teal-car", "berry-gift"],
    thumbX: "70%",
    thumbY: "76%",
  },
  {
    id: "daily-bag",
    title: "帆布包森系搭配",
    type: "包挂",
    scene: "用户喜欢低饱和绿色，想要轻一点的日常挂件。",
    summary: "苔影流苏包挂 + 种子小铃挂件，可选青绿绳。",
    result: "案例页突出“搭配后的样子”，再关联产品，让购买路径更自然。",
    productIds: ["moss-tassel", "seed-mini"],
    thumbX: "30%",
    thumbY: "82%",
  },
  {
    id: "birthday",
    title: "生日祝福礼盒",
    type: "礼盒",
    scene: "用户预算 100 左右，想要有手作感，也需要能写祝福语。",
    summary: "核桃平安铃 + 干花卡 + 牛皮纸礼盒。",
    result: "礼盒选项和祝福卡入口在详情里前置，减少下单后补充备注。",
    productIds: ["walnut-bell", "berry-gift"],
    thumbX: "16%",
    thumbY: "36%",
  },
  {
    id: "workshop",
    title: "到店选铃音",
    type: "门店",
    scene: "用户对铃声敏感，想现场听清亮铃和柔和铃的区别。",
    summary: "预约体验选品，到店确认铃音、绳色、配件。",
    result: "门店页不做复杂地图列表，重点放营业时间、预约类型和服务规则。",
    productIds: ["custom-kit", "walnut-bell"],
    thumbX: "55%",
    thumbY: "55%",
  },
];

const state = {
  screen: "home",
  productFilter: "全部",
  caseFilter: "全部",
  productQuery: "",
  orderTab: "全部",
  toastTimer: null,
  apiOnline: false,
  agentMessages: [
    {
      role: "assistant",
      content: "你好，我是果壳铃小助手。可以帮你选款、查现货、看门店信息，也能引导定制咨询和到店预约。",
      quickReplies: ["推荐送礼款", "看现货", "到店预约", "怎么定制"],
      products: [],
    },
  ],
  agentLoading: false,
  cart: [],
  activeProductId: "",
  activeCaseId: "",
  caseReturnScreen: "cases",
  cartReturnScreen: "products",
  points: 0,
  pointRecords: [],
  checkedInToday: false,
};

const productFilterLabels = ["全部", "果壳铃", "包挂", "车挂", "礼盒", "定制"];
const caseFilterLabels = ["全部", "车挂", "包挂", "礼盒", "门店"];

const screenMeta = {
  home: { title: "果壳铃手作铺", section: "首页" },
  products: { title: "产品", section: "产品" },
  cases: { title: "案例", section: "案例" },
  store: { title: "门店", section: "门店" },
  me: { title: "我的", section: "我的" },
  points: { title: "积分中心", section: "我的" },
  orders: { title: "我的订单", section: "我的" },
  "product-detail": { title: "商品详情", section: "产品" },
  "case-detail": { title: "案例详情", section: "案例" },
  cart: { title: "购物袋", section: "产品" },
  checkout: { title: "确认订单", section: "产品" },
};
let orders = [
  {
    id: "order-pay",
    status: "待付款",
    productName: "山莓祝福礼盒",
    price: 1280,
    quantity: 1,
    spec: "礼盒装 / 清亮铃 / 祝福卡",
    orderNo: "XD2026060301280",
    logisticsNo: "",
    carrier: "待支付后生成",
    createdAt: "2026-06-03 13:26",
    paidAt: "待付款",
    receiver: "邓先生 138****6026",
    address: "杭州市西湖区灵隐路 88 号附近",
    currentNode: "订单待支付",
    logistics: ["提交订单，等待付款"],
    action: "去付款",
    primary: true,
    thumbX: "18%",
    thumbY: "36%",
  },
  {
    id: "order-receive",
    status: "待收货",
    productName: "青藤车挂铃",
    price: 860,
    quantity: 1,
    spec: "青绿色蜡线 / 低频铜铃 / 车挂",
    orderNo: "XD2026060210860",
    logisticsNo: "YT8842603985126",
    carrier: "圆通速递",
    createdAt: "2026-06-02 18:42",
    paidAt: "2026-06-02 18:45",
    receiver: "邓先生 138****6026",
    address: "杭州市西湖区灵隐路 88 号附近",
    currentNode: "运输中，预计明日送达",
    logistics: ["2026-06-03 09:30 已到达杭州转运中心", "2026-06-02 22:18 已揽收", "2026-06-02 20:10 手作铺已完成打包"],
    action: "查看物流",
    primary: false,
    thumbX: "73%",
    thumbY: "78%",
  },
];
let storeInfo = {
  name: "果壳铃手作铺杭州工作室",
  address: "杭州市西湖区灵隐路 88 号手作工作室",
  longitude: 120.127,
  latitude: 30.245,
};

const previewMode = new URLSearchParams(window.location.search).get("preview") === "1";
if (!previewMode) {
  products = [];
  cases = [];
  orders = [];
  storeInfo = normalizeStoreInfo();
}

const nodes = {
  screen: document.getElementById("screen"),
  homeProducts: document.getElementById("homeProducts"),
  homeCases: document.getElementById("homeCases"),
  productFilters: document.getElementById("productFilters"),
  productGrid: document.getElementById("productGrid"),
  productSearch: document.getElementById("productSearch"),
  productEmpty: document.getElementById("productEmpty"),
  caseFilters: document.getElementById("caseFilters"),
  caseGrid: document.getElementById("caseGrid"),
  profileTitle: document.getElementById("profileTitle"),
  profileSummary: document.getElementById("profileSummary"),
  pointsBalance: document.getElementById("pointsBalance"),
  pointsList: document.getElementById("pointsList"),
  storeOpenStatus: document.getElementById("storeOpenStatus"),
  storeHeroLabel: document.getElementById("storeHeroLabel"),
  storeAddress: document.getElementById("storeAddress"),
  storeHours: document.getElementById("storeHours"),
  productDetailView: document.getElementById("productDetailView"),
  caseDetailView: document.getElementById("caseDetailView"),
  cartView: document.getElementById("cartView"),
  checkoutView: document.getElementById("checkoutView"),
  sheet: document.getElementById("sheet"),
  sheetTitle: document.getElementById("sheetTitle"),
  sheetContent: document.getElementById("sheetContent"),
  agentPanel: document.getElementById("agentPanel"),
  agentMessages: document.getElementById("agentMessages"),
  agentQuick: document.getElementById("agentQuick"),
  agentForm: document.getElementById("agentForm"),
  agentInput: document.getElementById("agentInput"),
  toast: document.getElementById("toast"),
};

function money(value) {
  return `¥${value}`;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[char];
  });
}

function getApiBase() {
  if (window.location.protocol === "file:") {
    return "http://localhost:3000/api";
  }
  return `${window.location.origin}/api`;
}

const API_BASE = getApiBase();

function normalizeStoreInfo(info = {}) {
  return {
    name: textValue(info.name, "门店信息待配置"),
    address: textValue(info.address, "后台填写门店地址后，这里会显示导航信息。"),
    phone: textValue(info.phone),
    hours: textValue(info.hours),
    longitude: Number(info.longitude) || 0,
    latitude: Number(info.latitude) || 0,
  };
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "请求失败");
  }
  return data;
}

async function loadRemoteData() {
  const shell = document.querySelector(".app-shell");
  shell?.classList.add("is-loading");
  if (previewMode) {
    state.apiOnline = false;
    shell?.classList.remove("is-loading");
    return;
  }
  try {
    const data = await apiRequest("/bootstrap");
    products = Array.isArray(data.products) ? data.products : products;
    cases = Array.isArray(data.cases) ? data.cases : cases;
    orders = Array.isArray(data.orders) ? data.orders : orders;
    storeInfo = normalizeStoreInfo(data.storeInfo || storeInfo);
    state.apiOnline = true;
  } catch (error) {
    state.apiOnline = false;
    console.warn("后端暂未启动，继续使用页面内置数据。", error);
  } finally {
    shell?.classList.remove("is-loading");
  }
}

async function refreshOrders() {
  if (!state.apiOnline) return;
  try {
    orders = await apiRequest("/orders");
    renderOrders();
    renderMe();
  } catch (error) {
    console.warn("订单刷新失败。", error);
  }
}

function findProduct(id) {
  return products.find((product) => product.id === id);
}

function matchesProduct(product) {
  const query = state.productQuery.trim().toLowerCase();
  const filterMatch = state.productFilter === "全部" || product.type === state.productFilter;
  if (!filterMatch) return false;
  if (!query) return true;

  const haystack = [
    product.name,
    product.type,
    product.tags.join(" "),
    product.material,
    product.tone,
    product.story,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function renderProductCard(product, options = {}) {
  const compact = options.compact ? " compact-card" : "";
  const visibleTags = product.tags.slice(0, 2);
  const shortTone = textValue(product.tone).split(/[，,]/)[0] || "可到店试听";
  return `
    <article class="product-card${compact}" data-product-card="${escapeHtml(product.id)}">
      <div class="product-thumb" style="--thumb-x: ${escapeHtml(product.thumbX)}; --thumb-y: ${escapeHtml(product.thumbY)};">
        <span class="pill light">${escapeHtml(product.type)}</span>
      </div>
      <div class="product-body">
        <div class="product-title-row">
          <h4>${escapeHtml(product.name)}</h4>
          <span class="price">${money(product.price)}</span>
        </div>
        <div class="tag-row">${visibleTags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
        <div class="product-meta">
          <span>${escapeHtml(product.stock)}</span>
          <span>${escapeHtml(shortTone)}</span>
        </div>
        <p>${escapeHtml(product.story)}</p>
        <div class="card-actions product-card-actions">
          <button type="button" data-action="open-consult" data-product-id="${escapeHtml(product.id)}">问定制</button>
          <button type="button" data-action="add-cart" data-product-id="${escapeHtml(product.id)}">加清单</button>
          <button type="button" data-action="open-product" data-product-id="${escapeHtml(product.id)}">看详情</button>
        </div>
      </div>
    </article>
  `;
}

function renderCaseCard(item, options = {}) {
  const related = item.productIds.map(findProduct).filter(Boolean);
  const visibleRelated = related.slice(0, 2);
  const compactClass = options.strip ? " strip-card" : "";
  return `
    <article class="case-card${compactClass}" data-case-card="${escapeHtml(item.id)}">
      <div class="case-thumb" style="--thumb-x: ${escapeHtml(item.thumbX)}; --thumb-y: ${escapeHtml(item.thumbY)};">
        <span class="pill light">${escapeHtml(item.type)}</span>
      </div>
      <div class="case-body">
        <div class="case-title-row">
          <h4>${escapeHtml(item.title)}</h4>
        </div>
        <p>${escapeHtml(item.summary)}</p>
        <div class="tag-row">${visibleRelated.map((product) => `<span>${escapeHtml(product.name)}</span>`).join("")}</div>
        <div class="card-actions">
          <button type="button" data-action="open-case" data-case-id="${escapeHtml(item.id)}">查看方案</button>
        </div>
      </div>
    </article>
  `;
}

function renderFilters(container, labels, active, action) {
  container.innerHTML = labels
    .map(
      (label) => `
        <button class="${label === active ? "is-selected" : ""}" type="button" data-action="${action}" data-value="${escapeHtml(label)}">
          ${escapeHtml(label)}
        </button>
      `
    )
    .join("");
}

function renderEmptyContent(title, text, action = {}) {
  const button =
    action.label && action.target
      ? `<button type="button" data-nav-target="${escapeHtml(action.target)}">${escapeHtml(action.label)}</button>`
      : "";
  return `
    <strong>${escapeHtml(title)}</strong>
    <span>${escapeHtml(text)}</span>
    ${button}
  `;
}

function renderEmptyBlock(title, text, action = {}) {
  return `<div class="empty-state">${renderEmptyContent(title, text, action)}</div>`;
}

function renderHome() {
  const featuredProducts = products.slice(0, 3);
  const featuredCases = cases.slice(0, 3);
  nodes.homeProducts.innerHTML = featuredProducts.length
    ? featuredProducts.map((product) => renderProductCard(product, { compact: true })).join("")
    : renderEmptyBlock("还没有上架商品", "后台新增商品后，这里会自动展示新品。", { label: "先预约到店", target: "store" });
  nodes.homeCases.innerHTML = featuredCases.length
    ? featuredCases.map((item) => renderCaseCard(item, { strip: true })).join("")
    : renderEmptyBlock("还没有搭配案例", "后台添加案例后，首页会自动显示真实方案。", { label: "先看产品", target: "products" });
}

function renderProducts() {
  renderFilters(nodes.productFilters, productFilterLabels, state.productFilter, "set-product-filter");
  const filtered = products.filter(matchesProduct);
  nodes.productGrid.innerHTML = filtered.length ? filtered.map((product) => renderProductCard(product)).join("") : "";
  nodes.productEmpty.hidden = filtered.length > 0;
  if (!filtered.length) {
    const hasCatalog = products.length > 0;
    nodes.productEmpty.innerHTML = renderEmptyContent(
      hasCatalog ? "没有匹配到产品" : "还没有上架商品",
      hasCatalog ? "换个分类或关键词再试试。" : "后台添加商品后，这里会显示真实库存和价格。",
      hasCatalog ? {} : { label: "先预约到店", target: "store" }
    );
  }
}

function renderCases() {
  renderFilters(nodes.caseFilters, caseFilterLabels, state.caseFilter, "set-case-filter");
  const filtered = cases.filter((item) => state.caseFilter === "全部" || item.type === state.caseFilter);
  nodes.caseGrid.innerHTML = filtered.length
    ? filtered.map((item) => renderCaseCard(item)).join("")
    : renderEmptyBlock(
        cases.length ? "没有匹配到案例" : "还没有搭配案例",
        cases.length ? "换个案例分类再试试。" : "后台添加案例后，这里会展示真实客户方案。",
        { label: "返回首页", target: "home" }
      );
}

function renderMe() {
  const receivingCount = orders.filter((order) => order.status === "待收货").length;
  nodes.profileTitle.textContent = state.points || orders.length ? "手作收藏家" : "访客用户";
  nodes.profileSummary.textContent = `积分 ${state.points} · 订单 ${orders.length} 单 · 待收货 ${receivingCount} 单`;
}

function renderPoints() {
  nodes.pointsBalance.textContent = state.points.toLocaleString("zh-CN");
  nodes.pointsList.innerHTML = state.pointRecords.length
    ? state.pointRecords
        .map(
          (record) => `
            <div>
              <span>${escapeHtml(record.label)}</span>
              <strong>+${escapeHtml(record.points)}</strong>
            </div>
          `
        )
        .join("")
    : renderEmptyBlock("暂无积分明细", "完成订单、签到或分享后，这里会显示真实积分流水。");
}

function renderStore() {
  const hasAddress = storeInfo.address && !storeInfo.address.includes("后台填写");
  nodes.storeHeroLabel.textContent = storeInfo.name;
  nodes.storeAddress.textContent = storeInfo.address;
  nodes.storeHours.textContent = storeInfo.hours || "后台配置营业时间后显示";
  nodes.storeOpenStatus.textContent = storeInfo.hours ? `营业时间 · ${storeInfo.hours}` : "门店信息待配置";
  nodes.storeOpenStatus.classList.toggle("is-muted", !hasAddress);
}

function renderOrders() {
  const list = document.getElementById("orderList");
  if (!list) return;

  document.querySelectorAll(".order-tabs button").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.value === state.orderTab);
  });

  const filtered = orders.filter((order) => state.orderTab === "全部" || order.status === state.orderTab);
  if (!filtered.length) {
    list.innerHTML = `
      <div class="orders-empty">
        <span>暂无相关订单</span>
        <button type="button" data-nav-target="products">去看看新品</button>
      </div>
    `;
    return;
  }

  list.innerHTML = filtered
    .map(
      (order) => `
        <article class="order-card ${order.primary ? "is-pay" : ""}">
          <h3>${escapeHtml(order.status)}</h3>
          <div class="order-main">
            <div class="order-thumb" style="background-position: ${escapeHtml(order.thumbX)} ${escapeHtml(order.thumbY)};" aria-hidden="true"></div>
            <div class="order-info">
              <div class="order-name" title="${escapeHtml(order.productName)}">${escapeHtml(order.productName)}</div>
              <span class="order-price">${money(order.price)}</span>
            </div>
          </div>
          <div class="order-card-footer">
            <button class="${order.primary ? "primary" : ""}" type="button" data-action="order-action" data-order-id="${escapeHtml(order.id)}">
              ${escapeHtml(order.action)}
            </button>
          </div>
        </article>
      `
    )
    .join("");
}

function setScreen(screen) {
  state.screen = screen;
  const shell = document.querySelector(".app-shell");
  const detailScreens = ["product-detail", "case-detail", "cart", "checkout"];
  const previousScreen = shell.dataset.screen;
  shell.dataset.screen = screen;
  shell.classList.toggle("is-changing-view", previousScreen !== screen);
  shell.classList.toggle("is-subpage", screen === "points" || screen === "orders" || detailScreens.includes(screen));
  shell.classList.toggle("is-detail-page", detailScreens.includes(screen));
  document.querySelectorAll("[data-view]").forEach((view) => {
    view.classList.toggle("is-active", view.dataset.view === screen);
  });
  document.querySelectorAll(".bottom-nav [data-nav-target]").forEach((button) => {
    const meta = screenMeta[screen];
    const isActive = button.dataset.navTarget === screen || button.textContent.trim() === meta?.section;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-current", isActive ? "page" : "false");
  });
  const meta = screenMeta[screen] || screenMeta.home;
  document.title = `${meta.title}｜果壳铃手作铺`;
  if (screen === "me") renderMe();
  if (screen === "points") renderPoints();
  if (screen === "store") renderStore();
  if (screen === "orders") renderOrders();
  nodes.screen.scrollTo({ top: 0, behavior: "smooth" });
  window.setTimeout(() => shell.classList.remove("is-changing-view"), 260);
}

function miniPageHead(title, badge = "") {
  return `
    <header class="mini-page-head">
      <button class="mini-page-back" type="button" data-action="detail-back" aria-label="返回">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>
      </button>
      <h2>${escapeHtml(title)}</h2>
      ${
        badge
          ? `<span>${escapeHtml(badge)}</span>`
          : `<button class="mini-page-menu" type="button" data-action="open-agent" aria-label="AI 导购">AI</button>`
      }
    </header>
  `;
}

function detailBack() {
  if (state.screen === "checkout") {
    setScreen("product-detail");
    return;
  }
  if (state.screen === "case-detail") {
    setScreen(state.caseReturnScreen || "cases");
    return;
  }
  if (state.screen === "cart") {
    setScreen(state.cartReturnScreen || "products");
    return;
  }
  setScreen("products");
}

function showToast(message) {
  window.clearTimeout(state.toastTimer);
  nodes.toast.textContent = message;
  nodes.toast.classList.add("is-visible");
  state.toastTimer = window.setTimeout(() => {
    nodes.toast.classList.remove("is-visible");
  }, 2500);
}

function openSheet(title, html) {
  nodes.sheetTitle.textContent = title;
  nodes.sheetContent.innerHTML = html;
  nodes.sheetContent.classList.toggle("has-detail-actions", html.includes("detail-actions"));
  nodes.sheet.classList.toggle("is-mini-screen", html.includes("mini-screen"));
  nodes.sheet.classList.add("is-open");
  nodes.sheet.setAttribute("aria-hidden", "false");
  document.body.classList.add("has-overlay");
}

function closeSheet() {
  nodes.sheet.classList.remove("is-open");
  nodes.sheet.classList.remove("is-mini-screen");
  nodes.sheetContent.classList.remove("has-detail-actions");
  nodes.sheet.setAttribute("aria-hidden", "true");
  document.body.classList.remove("has-overlay");
}

function openProduct(productId) {
  const product = findProduct(productId);
  if (!product) return;
  state.activeProductId = product.id;
  const relatedCase = cases.find((item) => item.productIds.includes(product.id));
  const relatedProducts = products
    .filter((item) => item.id !== product.id && (item.type === product.type || item.tags.some((tag) => product.tags.includes(tag))))
    .slice(0, 3);

  closeSheet();
  nodes.productDetailView.innerHTML = `
    <section class="mini-page product-mini-screen">
      ${miniPageHead("产品详情")}
      <div class="mini-hero" style="background-position: ${escapeHtml(product.thumbX)} ${escapeHtml(product.thumbY)};">
        <span>1/5</span>
      </div>
      <div class="mini-gallery-dots" aria-hidden="true">
        <span class="is-active"></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="mini-title-row">
        <div>
          <h3>${escapeHtml(product.name)}</h3>
          <p>${escapeHtml(product.story)}</p>
        </div>
        <strong>${money(product.price)}</strong>
      </div>
      <div class="mini-tags">${product.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
      <div class="mini-options" data-sheet-group="rope">
        <button class="is-selected" type="button" data-value="墨绿绳">颜色</button>
        <button type="button" data-value="尺寸">尺寸</button>
        <button type="button" data-value="材质">材质</button>
      </div>
      <div class="mini-line"></div>
      <div class="mini-line short"></div>
      <section class="mini-info-grid">
        <div><span>库存</span><strong>${escapeHtml(product.stock)}</strong></div>
        <div><span>周期</span><strong>${escapeHtml(product.cycle)}</strong></div>
        <div><span>铃音</span><strong>${escapeHtml(product.tone)}</strong></div>
        <div><span>规格</span><strong>${escapeHtml(product.specs)}</strong></div>
      </section>
      <section class="mini-service-row" aria-label="服务说明">
        <span>到店试听</span>
        <span>礼盒包装</span>
        <span>轻定制</span>
      </section>
      <section class="mini-case-link">
        <h4>用于这款的案例</h4>
        <button type="button" data-action="${relatedCase ? "open-case" : "show-toast"}" ${relatedCase ? `data-case-id="${escapeHtml(relatedCase.id)}"` : 'data-toast="暂无关联案例"'}>
          <span>${escapeHtml(relatedCase?.title || "到店选铃音")}</span>
        </button>
      </section>
      <section class="mini-related">
        <h4>相关推荐</h4>
        <div>
          ${relatedProducts
            .map(
              (item) => `
                <button type="button" data-action="open-product" data-product-id="${escapeHtml(item.id)}">
                  <span style="background-position: ${escapeHtml(item.thumbX)} ${escapeHtml(item.thumbY)};"></span>
                  <strong>${escapeHtml(item.name)}</strong>
                  <em>${money(item.price)}</em>
                </button>
              `
            )
            .join("")}
        </div>
      </section>
      <div class="detail-actions mini-actions">
        <button class="mini-icon-action" type="button" data-action="show-toast" data-toast="已加入收藏">收藏</button>
        <button class="mini-icon-action" type="button" data-action="show-toast" data-toast="已复制分享文案">分享</button>
        <button class="secondary-action" type="button" data-action="add-cart" data-product-id="${escapeHtml(product.id)}">加入清单</button>
        <button class="primary-action" type="button" data-action="open-order" data-product-id="${escapeHtml(product.id)}">立即购买</button>
      </div>
    </section>
  `;
  setScreen("product-detail");
}

function getCartEntries() {
  return state.cart
    .map((item) => ({
      ...item,
      product: findProduct(item.productId),
    }))
    .filter((item) => item.product);
}

function updateCartBadges() {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('[data-action="open-cart"]').forEach((button) => {
    if (count > 0) {
      button.dataset.count = String(count);
    } else {
      delete button.dataset.count;
    }
  });
}

function addToCart(productId) {
  const product = findProduct(productId);
  if (!product) return;

  const existing = state.cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.unshift({ productId, quantity: 1 });
  }
  postMiniProgramEvent("cartUpdated", { productId, quantity: existing?.quantity || 1 });
  updateCartBadges();
  showToast(`已加入待确认清单：${product.name}`);
}

function updateCartQuantity(productId, delta) {
  const item = state.cart.find((entry) => entry.productId === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter((entry) => entry.productId !== productId);
  }
  updateCartBadges();
  openCart();
}

function openCart() {
  const entries = getCartEntries();
  const total = entries.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (state.screen !== "cart") {
    state.cartReturnScreen = ["product-detail", "case-detail", "me"].includes(state.screen) ? state.screen : "products";
  }
  closeSheet();
  nodes.cartView.innerHTML = `
    <section class="mini-page cart-page">
      ${miniPageHead("待确认清单")}
      <section class="cart-sheet">
        ${
          entries.length
            ? `
              <div class="cart-list">
                ${entries
                  .map(
                    ({ product, quantity }) => `
                      <article class="cart-item">
                        <div class="cart-thumb" style="background-position: ${escapeHtml(product.thumbX)} ${escapeHtml(product.thumbY)};" aria-hidden="true"></div>
                        <div>
                          <h3>${escapeHtml(product.name)}</h3>
                          <p>${escapeHtml(product.stock)} · ${escapeHtml(product.type)}</p>
                          <strong>${money(product.price)}</strong>
                        </div>
                        <div class="cart-stepper">
                          <button type="button" data-action="cart-quantity" data-product-id="${escapeHtml(product.id)}" data-delta="-1">-</button>
                          <span>${quantity}</span>
                          <button type="button" data-action="cart-quantity" data-product-id="${escapeHtml(product.id)}" data-delta="1">+</button>
                        </div>
                      </article>
                    `
                  )
                  .join("")}
              </div>
              <div class="cart-summary">
                <span>预估合计</span>
                <strong>${money(total)}</strong>
              </div>
              <div class="detail-actions checkout-actions">
                <div>
                  <span>预估合计</span>
                  <strong>${money(total)}</strong>
                </div>
                <button class="primary-action" type="button" data-action="checkout-cart">去确认</button>
              </div>
            `
            : `
              <div class="cart-empty">
                <strong>清单还是空的</strong>
                <span>把喜欢的果壳铃先加入清单，再逐件确认绳色、铃音和配送方式。</span>
                <button class="primary-action" type="button" data-action="detail-back">去选款</button>
              </div>
            `
        }
      </section>
    </section>
  `;
  setScreen("cart");
}

function checkoutCart() {
  const first = getCartEntries()[0];
  if (!first) {
    showToast("清单还是空的");
    return;
  }
  openOrder(first.product.id);
}

function openGiftGuide() {
  const giftProducts = products
    .filter((product) => product.type === "车挂" || product.tags.includes("礼盒") || product.tags.includes("现货"))
    .slice(0, 4);

  openSheet(
    "AI 选款",
    `
      <section class="gift-guide">
        <div class="gift-guide-head">
          <span>根据用途快速缩小选择</span>
          <strong>你想把铃送给谁？</strong>
        </div>
        <div class="gift-scenarios">
          <button type="button" data-action="gift-agent" data-message="我想送新车朋友，推荐什么">送新车朋友</button>
          <button type="button" data-action="gift-agent" data-message="我想买挂包上的森系小挂件">挂包日常用</button>
          <button type="button" data-action="gift-agent" data-message="我想要一份有包装的生日礼物">生日礼物</button>
          <button type="button" data-action="gift-agent" data-message="预算100以内，有没有现货推荐">预算 100 内</button>
        </div>
        <section class="mini-related gift-recommend">
          <h4>先看这些</h4>
          <div>
            ${
              giftProducts.length
                ? giftProducts
                    .map(
                      (product) => `
                        <button type="button" data-action="open-product" data-product-id="${escapeHtml(product.id)}">
                          <span style="background-position: ${escapeHtml(product.thumbX)} ${escapeHtml(product.thumbY)};"></span>
                          <strong>${escapeHtml(product.name)}</strong>
                          <em>${money(product.price)}</em>
                        </button>
                      `
                    )
                    .join("")
                : renderEmptyBlock("暂无可推荐商品", "后台添加商品并标记车挂、礼盒或现货后，这里会自动推荐。")
            }
          </div>
        </section>
      </section>
    `
  );
}

function openCase(caseId) {
  const item = cases.find((caseItem) => caseItem.id === caseId);
  if (!item) return;
  state.caseReturnScreen = state.screen === "product-detail" ? "product-detail" : "cases";
  state.activeCaseId = item.id;

  const related = item.productIds.map(findProduct).filter(Boolean);
  closeSheet();
  nodes.caseDetailView.innerHTML = `
    <section class="mini-page case-mini-screen">
      ${miniPageHead("案例详情")}
      <div class="mini-hero case-hero" style="background-position: ${escapeHtml(item.thumbX)} ${escapeHtml(item.thumbY)};">
        <div>
          <span>森系 | 车挂定制</span>
          <strong>${escapeHtml(item.title)}</strong>
        </div>
        <em>1/6</em>
      </div>
      <div class="mini-tags">
        <span>${escapeHtml(item.type)}</span>
        <span>门店</span>
      </div>
      <div class="mini-line"></div>
      <section class="mini-story-card">
        <div><span>使用场景</span><strong>${escapeHtml(item.scene)}</strong></div>
        <div><span>搭配方案</span><strong>${escapeHtml(item.summary)}</strong></div>
        <div><span>设计目的</span><strong>${escapeHtml(item.result)}</strong></div>
      </section>
      <section class="mini-needs" aria-label="客户需求">
        <article><span>安</span><strong>出行平安</strong></article>
        <article><span>森</span><strong>自然风格</strong></article>
        <article><span>音</span><strong>清亮铃音</strong></article>
        <article><span>礼</span><strong>礼盒包装</strong></article>
      </section>
      <section class="mini-related">
        <h4>关联产品</h4>
        <div>
          ${related
            .map(
              (product) => `
                <button type="button" data-action="open-product" data-product-id="${escapeHtml(product.id)}">
                  <span style="background-position: ${escapeHtml(product.thumbX)} ${escapeHtml(product.thumbY)};"></span>
                  <strong>${escapeHtml(product.name)}</strong>
                  <em>${money(product.price)}</em>
                </button>
              `
            )
            .join("")}
        </div>
      </section>
      <div class="mini-store-row">
        <span>承接门店</span>
        <strong>${escapeHtml(storeInfo.address)}</strong>
      </div>
      <div class="detail-actions mini-actions">
        <button class="mini-icon-action" type="button" data-action="copy-address">电话</button>
        <button class="primary-action" type="button" data-action="submit-booking">预约咨询</button>
      </div>
    </section>
  `;
  setScreen("case-detail");
}

function openConsult(productId = "") {
  const product = productId ? findProduct(productId) : null;
  openSheet(
    "定制咨询",
    `
      <form class="sheet-form" id="consultForm">
        <input name="productId" type="hidden" value="${product ? escapeHtml(product.id) : ""}" />
        <label>
          想咨询的内容
          <textarea rows="4" name="message" placeholder="例如：想要核桃铃，墨绿绳，送新车朋友，预算 100 左右">${product ? `想咨询：${escapeHtml(product.name)}。` : ""}</textarea>
        </label>
        <label>
          联系方式
          <input name="contact" type="text" placeholder="微信号或手机号" />
        </label>
        <div class="option-grid" data-sheet-group="consult">
          <button class="is-selected" type="button" data-value="绳色">绳色</button>
          <button type="button" data-value="铃音">铃音</button>
          <button type="button" data-value="礼盒">礼盒</button>
        </div>
        <button class="wide-action" type="submit">提交咨询</button>
      </form>
    `
  );
}

function openOrder(productId) {
  const product = findProduct(productId);
  if (!product) return;

  state.activeProductId = product.id;
  closeSheet();
  nodes.checkoutView.innerHTML = `
    <form class="mini-page checkout-mini-screen sheet-form" id="orderForm">
      ${miniPageHead("结算确认", "小程序原生页")}
      <input name="productId" type="hidden" value="${escapeHtml(product.id)}" />
      <section class="checkout-address">
        <span>收货信息</span>
        <label>
          <input name="customerName" type="text" placeholder="姓名" />
        </label>
        <label>
          <input name="contact" type="text" placeholder="手机号或微信号" />
        </label>
        <label>
          <textarea rows="2" name="address" placeholder="详细地址或到店自提时间"></textarea>
        </label>
      </section>
      <section class="checkout-product">
        <div class="checkout-thumb" style="background-position: ${escapeHtml(product.thumbX)} ${escapeHtml(product.thumbY)};"></div>
        <div>
          <h3>${escapeHtml(product.name)} · 规格</h3>
          <p>×1</p>
        </div>
        <strong>${money(product.price)}</strong>
      </section>
      <div class="mini-options" data-sheet-group="delivery">
        <button class="is-selected" type="button" data-value="快递">快递</button>
        <button type="button" data-value="到店自提">到店自提</button>
        <button type="button" data-value="礼盒包装">礼盒包装</button>
      </div>
      <label class="checkout-note">
        <textarea rows="2" name="note" placeholder="备注：绳色、铃音、祝福卡内容"></textarea>
      </label>
      <div class="checkout-total">
        <div><span>优惠券</span><strong>无可用 ></strong></div>
        <div><span>积分抵扣</span><strong>- ¥ 0</strong></div>
        <div><span>运费</span><strong>¥ 0</strong></div>
        <div><span>实付金额</span><strong>${money(product.price)}</strong></div>
      </div>
      <section class="checkout-address checkout-store">
        <span>预约到店（可选）</span>
        <div class="mini-store-row inline">
          <strong>${escapeHtml(storeInfo.name)}</strong>
          <span>${escapeHtml(storeInfo.address)}</span>
        </div>
      </section>
      <div class="detail-actions checkout-actions">
        <div>
          <span>实付</span>
          <strong>${money(product.price)}</strong>
        </div>
        <button class="primary-action" type="submit">微信支付</button>
      </div>
    </form>
  `;
  setScreen("checkout");
}

function findOrder(orderId) {
  return orders.find((order) => order.id === orderId);
}

function openLogistics(orderId) {
  const order = findOrder(orderId);
  if (!order) return;

  openSheet(
    "物流详情",
    `
      <div class="logistics-state">
        <span>${escapeHtml(order.carrier)}</span>
        <strong>${escapeHtml(order.currentNode)}</strong>
        <p>物流单号：${escapeHtml(order.logisticsNo || "待生成")}</p>
      </div>
      <article class="logistics-product">
        <div class="order-thumb" style="background-position: ${escapeHtml(order.thumbX)} ${escapeHtml(order.thumbY)};" aria-hidden="true"></div>
        <div>
          <h3>${escapeHtml(order.productName)}</h3>
          <p>${escapeHtml(order.spec)}</p>
          <strong>${money(order.price)} × ${escapeHtml(order.quantity)}</strong>
        </div>
      </article>
      <div class="detail-list">
        <div><span>订单编号</span><strong>${escapeHtml(order.orderNo)}</strong></div>
        <div><span>购买时间</span><strong>${escapeHtml(order.createdAt)}</strong></div>
        <div><span>支付时间</span><strong>${escapeHtml(order.paidAt)}</strong></div>
        <div><span>收件信息</span><strong>${escapeHtml(order.receiver)}<br>${escapeHtml(order.address)}</strong></div>
      </div>
      <section class="logistics-timeline">
        <h3>物流轨迹</h3>
        ${order.logistics
          .map(
            (item, index) => `
              <div class="${index === 0 ? "is-current" : ""}">
                <span></span>
                <p>${escapeHtml(item)}</p>
              </div>
            `
          )
          .join("")}
      </section>
      <div class="sheet-actions">
        <button class="secondary-action" type="button" data-action="copy-logistics" data-order-id="${order.id}">复制单号</button>
        <button class="primary-action" type="button" data-action="show-toast" data-toast="更多轨迹可联系门店或查看快递平台">查看完整轨迹</button>
      </div>
    `
  );
}

function buildMapUrl(mode = "walk") {
  const modeMap = {
    walk: "walk",
    drive: "car",
    bus: "bus",
  };
  const encodedName = encodeURIComponent(storeInfo.name);
  const mapMode = modeMap[mode] || "walk";
  return `https://uri.amap.com/navigation?to=${storeInfo.longitude},${storeInfo.latitude},${encodedName}&mode=${mapMode}&policy=1&src=xiaodian&coordinate=gaode&callnative=1`;
}

function openNavigation() {
  const hasLocation = Boolean(Number(storeInfo.longitude) && Number(storeInfo.latitude));
  openSheet(
    "到店导航",
    `
      <div class="map-preview" aria-label="门店位置示意">
        <div class="map-pin">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m3 11 19-8-8 19-3-9z"></path>
          </svg>
        </div>
      </div>
      <div class="detail-list">
        <div><span>门店</span><strong>${escapeHtml(storeInfo.name)}</strong></div>
        <div><span>地址</span><strong>${escapeHtml(storeInfo.address)}</strong></div>
        <div><span>到店服务</span><strong>线下看实物、听铃音、选绳色，也可预约自提。</strong></div>
      </div>
      ${
        hasLocation
          ? `
            <div class="route-summary">
              <div><span>步行</span><strong>高德地图估算</strong></div>
              <div><span>驾车</span><strong>高德地图估算</strong></div>
              <div><span>公交</span><strong>高德地图估算</strong></div>
            </div>
            <div class="option-grid" data-sheet-group="route">
              <button class="is-selected" type="button" data-value="walk">步行</button>
              <button type="button" data-value="drive">驾车</button>
              <button type="button" data-value="bus">公交</button>
            </div>
          `
          : renderEmptyBlock("导航未配置", "后台填写门店地址和经纬度后，用户就能从这里打开地图导航。")
      }
      <div class="sheet-actions">
        <button class="secondary-action" type="button" data-action="copy-address">复制地址</button>
        <button class="primary-action" type="button" data-action="open-map" ${hasLocation ? "" : "disabled"}>打开地图</button>
      </div>
    `
  );
}

function openSearch() {
  openSheet(
    "搜索",
    `
      <label class="search-field">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7"></circle>
          <path d="m16 16 5 5"></path>
        </svg>
        <input id="sheetSearchInput" type="search" placeholder="搜森系、礼盒、车挂、清亮" autocomplete="off" />
      </label>
      <div class="search-results" id="sheetSearchResults"></div>
    `
  );
  const input = document.getElementById("sheetSearchInput");
  const results = document.getElementById("sheetSearchResults");

  const render = () => {
    const value = input.value.trim().toLowerCase();
    const productHits = products.filter((product) => {
      const text = [product.name, product.type, product.tags.join(" "), product.story].join(" ").toLowerCase();
      return !value || text.includes(value);
    });
    const caseHits = cases.filter((item) => {
      const text = [item.title, item.type, item.summary, item.scene].join(" ").toLowerCase();
      return !value || text.includes(value);
    });
    const items = [
      ...productHits.slice(0, 4).map(
        (product) => `
          <button class="search-result" type="button" data-action="open-product" data-product-id="${escapeHtml(product.id)}">
            <span>产品</span>
            <strong>${escapeHtml(product.name)} · ${money(product.price)}</strong>
          </button>
        `
      ),
      ...caseHits.slice(0, 3).map(
        (item) => `
          <button class="search-result" type="button" data-action="open-case" data-case-id="${escapeHtml(item.id)}">
            <span>案例</span>
            <strong>${escapeHtml(item.title)}</strong>
          </button>
        `
      ),
    ];
    results.innerHTML = items.length
      ? items.join("")
      : renderEmptyBlock(value ? "没有搜索结果" : "暂无可搜索内容", value ? "换个关键词再试试。" : "后台添加商品或案例后，这里会展示结果。");
  };

  render();
  input.addEventListener("input", render);
  input.focus();
}

function renderAgentProduct(product) {
  return `
    <button class="agent-product" type="button" data-action="agent-open-product" data-product-id="${escapeHtml(product.id)}">
      <span class="agent-product-thumb" style="--thumb-x: ${escapeHtml(product.thumbX || "50%")}; --thumb-y: ${escapeHtml(product.thumbY || "58%")};"></span>
      <span>
        <strong>${escapeHtml(product.name)} · ${money(product.price)}</strong>
        <span>${escapeHtml(product.stock || product.type || "可咨询")}</span>
      </span>
    </button>
  `;
}

function renderAgentMessages() {
  if (!nodes.agentMessages || !nodes.agentQuick) return;

  const messagesHtml = state.agentMessages
    .map((message) => {
      const productsHtml = message.products?.length
        ? `<div class="agent-products">${message.products.map(renderAgentProduct).join("")}</div>`
        : "";
      return `
        <div class="agent-message ${message.role}">
          ${escapeHtml(message.content)}
          ${productsHtml}
        </div>
      `;
    })
    .join("");

  const loadingHtml = state.agentLoading
    ? `
      <div class="agent-message assistant is-thinking" aria-live="polite">
        <span>正在思考</span>
        <span class="thinking-dots" aria-hidden="true">
          <i></i><i></i><i></i>
        </span>
      </div>
    `
    : "";

  nodes.agentMessages.innerHTML = `${messagesHtml}${loadingHtml}`;

  const last = state.agentMessages[state.agentMessages.length - 1];
  nodes.agentQuick.innerHTML = state.agentLoading
    ? ""
    : (last?.quickReplies || [])
    .map((reply) => `<button type="button" data-action="agent-quick" data-message="${escapeHtml(reply)}">${escapeHtml(reply)}</button>`)
    .join("");

  if (nodes.agentInput) {
    nodes.agentInput.disabled = state.agentLoading;
    nodes.agentInput.placeholder = state.agentLoading ? "小助手正在思考..." : "问问送礼、车挂、到店预约...";
  }
  const submitButton = nodes.agentForm?.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = state.agentLoading;
    submitButton.textContent = state.agentLoading ? "思考中" : "发送";
  }

  nodes.agentMessages.scrollTop = nodes.agentMessages.scrollHeight;
}

function openAgent() {
  nodes.agentPanel?.classList.add("is-open");
  nodes.agentPanel?.setAttribute("aria-hidden", "false");
  renderAgentMessages();
  window.setTimeout(() => nodes.agentInput?.focus(), 80);
}

function closeAgent() {
  nodes.agentPanel?.classList.remove("is-open");
  nodes.agentPanel?.setAttribute("aria-hidden", "true");
}

async function sendAgentMessage(message) {
  const content = textValue(message);
  if (!content || state.agentLoading) return;

  state.agentMessages.push({ role: "user", content, products: [], quickReplies: [] });
  state.agentLoading = true;
  renderAgentMessages();

  try {
    const response = await apiRequest("/agent/chat", {
      method: "POST",
      body: JSON.stringify({
        message: content,
        history: state.agentMessages.slice(-8).map((item) => ({ role: item.role, content: item.content })),
      }),
    });
    state.agentMessages.push({
      role: "assistant",
      content: response.reply || "我先记录下来了，可以再描述一下你的用途或预算。",
      products: response.products || [],
      quickReplies: response.quickReplies || ["推荐送礼款", "看现货", "到店预约"],
      action: response.action,
    });
  } catch (error) {
    state.agentMessages.push({
      role: "assistant",
      content: state.apiOnline ? error.message : "后端未启动，我暂时不能回答。请先运行 npm start。",
      products: [],
      quickReplies: ["推荐送礼款", "看现货", "到店预约"],
    });
  } finally {
    state.agentLoading = false;
    renderAgentMessages();
  }
}

function textValue(value) {
  return String(value ?? "").trim();
}

function postMiniProgramEvent(type, data = {}) {
  if (!window.wx?.miniProgram?.postMessage) return false;
  window.wx.miniProgram.postMessage({
    data: {
      type,
      ...data,
    },
  });
  return true;
}

async function submitBooking() {
  const type = document.querySelector('[data-booking-group="type"] .is-selected')?.dataset.value || "定制咨询";
  const time = document.querySelector('[data-booking-group="time"] .is-selected')?.dataset.value || "今天 15:00";
  const note = document.getElementById("bookingNote")?.value.trim();

  try {
    await apiRequest("/bookings", {
      method: "POST",
      body: JSON.stringify({ type, time, note }),
    });
    postMiniProgramEvent("bookingSubmitted", { bookingType: type, time });
    showToast(`预约已提交：${type}，${time}`);
    const noteInput = document.getElementById("bookingNote");
    if (noteInput) noteInput.value = "";
  } catch (error) {
    showToast(state.apiOnline ? error.message : "后端未启动，预约暂未提交");
  }
}

async function submitConsultForm(form) {
  const formData = new FormData(form);
  const topic = document.querySelector('[data-sheet-group="consult"] .is-selected')?.dataset.value || "定制咨询";
  const payload = {
    productId: formData.get("productId") || "",
    message: formData.get("message") || "",
    contact: formData.get("contact") || "",
    topic,
  };

  if (!textValue(payload.message)) {
    showToast("先写一下想咨询的内容");
    return;
  }

  if (!textValue(payload.contact)) {
    showToast("请留下微信号或手机号");
    return;
  }

  try {
    await apiRequest("/consultations", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    postMiniProgramEvent("consultationSubmitted", payload);
    closeSheet();
    showToast("咨询已提交，后台可查看");
  } catch (error) {
    showToast(state.apiOnline ? error.message : "后端未启动，咨询暂未提交");
  }
}

async function submitOrderForm(form) {
  const formData = new FormData(form);
  const delivery = document.querySelector('[data-sheet-group="delivery"] .is-selected')?.dataset.value || "快递";
  const payload = {
    productId: formData.get("productId") || "",
    delivery,
    customerName: formData.get("customerName") || "",
    contact: formData.get("contact") || "",
    address: formData.get("address") || "",
    note: formData.get("note") || "",
  };

  if (!textValue(payload.customerName)) {
    showToast("请填写姓名");
    return;
  }

  if (!textValue(payload.contact)) {
    showToast("请填写手机号或微信号");
    return;
  }

  if (!textValue(payload.address)) {
    showToast(delivery === "到店自提" ? "请填写自提时间" : "请填写收货地址");
    return;
  }

  try {
    const order = await apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    postMiniProgramEvent("orderSubmitted", { orderId: order.id, orderNo: order.orderNo, productId: payload.productId });
    orders = [order, ...orders.filter((item) => item.id !== order.id)];
    renderMe();
    closeSheet();
    showToast("订单已提交，等待门店确认");
    setScreen("orders");
  } catch (error) {
    showToast(state.apiOnline ? error.message : "后端未启动，订单暂未提交");
  }
}

async function copyAddress() {
  if (!storeInfo.address || storeInfo.address.includes("后台填写")) {
    showToast("后台还没有配置门店地址");
    return;
  }
  try {
    await navigator.clipboard.writeText(storeInfo.address);
    showToast("门店地址已复制");
  } catch {
    showToast(storeInfo.address);
  }
}

async function copyLogistics(orderId) {
  const order = findOrder(orderId);
  if (!order?.logisticsNo) {
    showToast("暂无物流单号");
    return;
  }

  try {
    await navigator.clipboard.writeText(order.logisticsNo);
    showToast("物流单号已复制");
  } catch {
    showToast(`物流单号：${order.logisticsNo}`);
  }
}

function checkInPoints() {
  if (state.checkedInToday) {
    showToast("今天已经签到过了");
    return;
  }
  state.checkedInToday = true;
  state.points += 5;
  state.pointRecords.unshift({
    label: "每日签到",
    points: 5,
  });
  renderMe();
  renderPoints();
  showToast("签到成功，积分 +5");
}

function openMap() {
  if (!Number(storeInfo.longitude) || !Number(storeInfo.latitude)) {
    showToast("后台还没有配置门店经纬度");
    return;
  }
  const mode = document.querySelector('[data-sheet-group="route"] .is-selected')?.dataset.value || "walk";
  const url = buildMapUrl(mode);
  if (window.wx?.miniProgram?.postMessage) {
    postMiniProgramEvent("openLocation", {
      name: storeInfo.name,
      address: storeInfo.address,
      latitude: storeInfo.latitude,
      longitude: storeInfo.longitude,
    });
    showToast("已发送门店导航");
    return;
  }
  window.open(url, "_blank", "noopener");
  showToast("已尝试打开地图导航");
}

function handleOptionSelect(button) {
  const group = button.closest("[data-booking-group], [data-sheet-group]");
  if (!group) return;
  group.querySelectorAll("button").forEach((item) => item.classList.remove("is-selected"));
  button.classList.add("is-selected");
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    const productCard = event.target.closest("[data-product-card]");
    const caseCard = event.target.closest("[data-case-card]");

    if (button?.dataset.navTarget) {
      const preset = button.dataset.presetFilter;
      if (preset) {
        state.productFilter = preset;
        renderProducts();
      }
      setScreen(button.dataset.navTarget);
      return;
    }

    if (button?.dataset.action) {
      const { action, productId, caseId, value, toast } = button.dataset;
      if (action === "set-product-filter") {
        state.productFilter = value;
        renderProducts();
      }
      if (action === "set-case-filter") {
        state.caseFilter = value;
        renderCases();
      }
      if (action === "open-product") openProduct(productId);
      if (action === "open-case") openCase(caseId);
      if (action === "open-consult") openConsult(productId);
      if (action === "open-order") openOrder(productId);
      if (action === "detail-back") detailBack();
      if (action === "add-cart") addToCart(productId);
      if (action === "open-cart") openCart();
      if (action === "cart-quantity") updateCartQuantity(productId, Number(button.dataset.delta) || 0);
      if (action === "checkout-cart") checkoutCart();
      if (action === "open-gift-guide") openGiftGuide();
      if (action === "gift-agent") {
        closeSheet();
        openAgent();
        sendAgentMessage(button.dataset.message);
      }
      if (action === "open-agent") openAgent();
      if (action === "close-agent") closeAgent();
      if (action === "agent-open-product") {
        closeAgent();
        openProduct(productId);
      }
      if (action === "agent-quick") {
        if (button.dataset.message === "到店预约") {
          closeAgent();
          setScreen("store");
        } else if (button.dataset.message?.includes("咨询")) {
          closeAgent();
          openConsult();
        } else {
          sendAgentMessage(button.dataset.message);
        }
      }
      if (action === "open-navigation") openNavigation();
      if (action === "open-search") openSearch();
      if (action === "close-sheet") closeSheet();
      if (action === "copy-address") copyAddress();
      if (action === "copy-logistics") copyLogistics(button.dataset.orderId);
      if (action === "open-map") openMap();
      if (action === "points-checkin") checkInPoints();
      if (action === "play-tone") {
        const product = findProduct(productId);
        showToast(product ? `正在试听：${product.name} · ${product.tone}` : "正在试听铃音");
      }
      if (action === "set-order-tab") {
        state.orderTab = value;
        renderOrders();
      }
      if (action === "order-action") {
        if (button.textContent.trim() === "去付款") {
          showToast("请联系门店确认付款方式");
        } else {
          openLogistics(button.dataset.orderId);
        }
      }
      if (action === "confirm-order") {
        const form = document.getElementById("orderForm");
        if (form) submitOrderForm(form);
      }
      if (action === "submit-booking") submitBooking();
      if (action === "show-toast") showToast(toast || "已点击");
      return;
    }

    if (button && button.closest("[data-booking-group], [data-sheet-group]")) {
      handleOptionSelect(button);
      return;
    }

    if (productCard) {
      openProduct(productCard.dataset.productCard);
      return;
    }

    if (caseCard) {
      openCase(caseCard.dataset.caseCard);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (nodes.sheet.classList.contains("is-open")) closeSheet();
    if (nodes.agentPanel.classList.contains("is-open")) closeAgent();
  });

  nodes.productSearch.addEventListener("input", (event) => {
    state.productQuery = event.target.value;
    renderProducts();
  });

  document.addEventListener("submit", (event) => {
    if (event.target.id === "consultForm") {
      event.preventDefault();
      submitConsultForm(event.target);
    }
    if (event.target.id === "orderForm") {
      event.preventDefault();
      submitOrderForm(event.target);
    }
    if (event.target.id === "agentForm") {
      event.preventDefault();
      const value = nodes.agentInput.value;
      nodes.agentInput.value = "";
      sendAgentMessage(value);
    }
  });
}

async function init() {
  await loadRemoteData();
  renderHome();
  renderProducts();
  renderCases();
  renderMe();
  renderPoints();
  renderStore();
  renderOrders();
  bindEvents();
  updateCartBadges();
}

init();
