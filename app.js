const assetPath = "./assets/hero-forest-bells.png";

const products = [
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

const cases = [
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
};

const productFilterLabels = ["全部", "果壳铃", "包挂", "车挂", "礼盒", "定制"];
const caseFilterLabels = ["全部", "车挂", "包挂", "礼盒", "门店"];
const orders = [
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
const storeInfo = {
  name: "果壳铃手作铺杭州工作室",
  address: "杭州市西湖区灵隐路 88 号手作工作室",
  longitude: 120.127,
  latitude: 30.245,
};

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
  sheet: document.getElementById("sheet"),
  sheetTitle: document.getElementById("sheetTitle"),
  sheetContent: document.getElementById("sheetContent"),
  toast: document.getElementById("toast"),
};

function money(value) {
  return `¥${value}`;
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
  return `
    <article class="product-card${compact}" data-product-card="${product.id}">
      <div class="product-thumb" style="--thumb-x: ${product.thumbX}; --thumb-y: ${product.thumbY};">
        <span class="pill light">${product.type}</span>
      </div>
      <div class="product-body">
        <div class="product-title-row">
          <h4>${product.name}</h4>
          <span class="price">${money(product.price)}</span>
        </div>
        <div class="tag-row">${visibleTags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        <p>${product.story}</p>
        <div class="card-actions">
          <button type="button" data-action="open-consult" data-product-id="${product.id}">问定制</button>
          <button type="button" data-action="open-product" data-product-id="${product.id}">看详情</button>
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
    <article class="case-card${compactClass}" data-case-card="${item.id}">
      <div class="case-thumb" style="--thumb-x: ${item.thumbX}; --thumb-y: ${item.thumbY};">
        <span class="pill light">${item.type}</span>
      </div>
      <div class="case-body">
        <div class="case-title-row">
          <h4>${item.title}</h4>
        </div>
        <p>${item.summary}</p>
        <div class="tag-row">${visibleRelated.map((product) => `<span>${product.name}</span>`).join("")}</div>
        <div class="card-actions">
          <button type="button" data-action="open-case" data-case-id="${item.id}">查看方案</button>
        </div>
      </div>
    </article>
  `;
}

function renderFilters(container, labels, active, action) {
  container.innerHTML = labels
    .map(
      (label) => `
        <button class="${label === active ? "is-selected" : ""}" type="button" data-action="${action}" data-value="${label}">
          ${label}
        </button>
      `
    )
    .join("");
}

function renderHome() {
  nodes.homeProducts.innerHTML = products.slice(0, 2).map((product) => renderProductCard(product, { compact: true })).join("");
  nodes.homeCases.innerHTML = cases.slice(0, 3).map((item) => renderCaseCard(item, { strip: true })).join("");
}

function renderProducts() {
  renderFilters(nodes.productFilters, productFilterLabels, state.productFilter, "set-product-filter");
  const filtered = products.filter(matchesProduct);
  nodes.productGrid.innerHTML = filtered.map((product) => renderProductCard(product)).join("");
  nodes.productEmpty.hidden = filtered.length > 0;
}

function renderCases() {
  renderFilters(nodes.caseFilters, caseFilterLabels, state.caseFilter, "set-case-filter");
  const filtered = cases.filter((item) => state.caseFilter === "全部" || item.type === state.caseFilter);
  nodes.caseGrid.innerHTML = filtered.map((item) => renderCaseCard(item)).join("");
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
          <h3>${order.status}</h3>
          <div class="order-main">
            <div class="order-thumb" style="background-position: ${order.thumbX} ${order.thumbY};" aria-hidden="true"></div>
            <div class="order-info">
              <div class="order-name" title="${order.productName}"></div>
              <span class="order-price">¥ ${order.price.toLocaleString("zh-CN")}</span>
            </div>
          </div>
          <div class="order-card-footer">
            <button class="${order.primary ? "primary" : ""}" type="button" data-action="order-action" data-order-id="${order.id}">
              ${order.action}
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
  shell.dataset.screen = screen;
  shell.classList.toggle("is-subpage", screen === "points" || screen === "orders");
  document.querySelectorAll("[data-view]").forEach((view) => {
    view.classList.toggle("is-active", view.dataset.view === screen);
  });
  document.querySelectorAll(".bottom-nav [data-nav-target]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.navTarget === screen);
  });
  if (screen === "orders") renderOrders();
  nodes.screen.scrollTo({ top: 0, behavior: "smooth" });
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
  nodes.sheet.classList.add("is-open");
  nodes.sheet.setAttribute("aria-hidden", "false");
}

function closeSheet() {
  nodes.sheet.classList.remove("is-open");
  nodes.sheetContent.classList.remove("has-detail-actions");
  nodes.sheet.setAttribute("aria-hidden", "true");
}

function openProduct(productId) {
  const product = findProduct(productId);
  if (!product) return;

  openSheet(
    product.name,
    `
      <div class="detail-image" style="background-position: ${product.thumbX} ${product.thumbY};"></div>
      <div class="detail-heading">
        <div>
          <h3>${product.name}</h3>
          <div class="tag-row">${product.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        </div>
        <span class="price">${money(product.price)}</span>
      </div>
      <p class="sheet-copy">${product.story}</p>
      <section class="tone-preview">
        <div>
          <span>铃音试听</span>
          <strong>${product.tone}</strong>
        </div>
        <button type="button" data-action="play-tone" data-product-id="${product.id}">
          试听
        </button>
      </section>
      <div class="detail-list">
        <div><span>材质</span><strong>${product.material}</strong></div>
        <div><span>尺寸重量</span><strong>${product.specs}</strong></div>
        <div><span>铃音</span><strong>${product.tone}</strong></div>
        <div><span>手作周期</span><strong>${product.cycle}</strong></div>
        <div><span>库存状态</span><strong>${product.stock}</strong></div>
        <div><span>保养方式</span><strong>${product.care}</strong></div>
      </div>
      <div class="option-grid" data-sheet-group="rope">
        <button class="is-selected" type="button" data-value="墨绿绳">墨绿绳</button>
        <button type="button" data-value="酒红绳">酒红绳</button>
        <button type="button" data-value="青蓝绳">青蓝绳</button>
      </div>
      <div class="sheet-actions detail-actions">
        <button class="secondary-action" type="button" data-action="open-consult" data-product-id="${product.id}">定制咨询</button>
        <button class="primary-action" type="button" data-action="open-order" data-product-id="${product.id}">立即购买</button>
      </div>
    `
  );
}

function openCase(caseId) {
  const item = cases.find((caseItem) => caseItem.id === caseId);
  if (!item) return;

  const related = item.productIds.map(findProduct).filter(Boolean);
  openSheet(
    item.title,
    `
      <div class="detail-image" style="background-position: ${item.thumbX} ${item.thumbY};"></div>
      <div class="detail-list">
        <div><span>使用场景</span><strong>${item.scene}</strong></div>
        <div><span>搭配方案</span><strong>${item.summary}</strong></div>
        <div><span>设计目的</span><strong>${item.result}</strong></div>
      </div>
      <div class="product-grid">
        ${related.map((product) => renderProductCard(product, { compact: true })).join("")}
      </div>
    `
  );
}

function openConsult(productId = "") {
  const product = productId ? findProduct(productId) : null;
  openSheet(
    "定制咨询",
    `
      <form class="sheet-form" id="consultForm">
        <label>
          想咨询的内容
          <textarea rows="4" name="message" placeholder="例如：想要核桃铃，墨绿绳，送新车朋友，预算 100 左右">${product ? `想咨询：${product.name}。` : ""}</textarea>
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

  openSheet(
    "确认购买",
    `
      <div class="detail-heading">
        <div>
          <h3>${product.name}</h3>
          <p class="sheet-copy">${product.stock} · ${product.cycle}</p>
        </div>
        <span class="price">${money(product.price)}</span>
      </div>
      <div class="option-grid" data-sheet-group="delivery">
        <button class="is-selected" type="button" data-value="快递">快递</button>
        <button type="button" data-value="到店自提">到店自提</button>
        <button type="button" data-value="礼盒包装">礼盒包装</button>
      </div>
      <div class="detail-list">
        <div><span>售后提示</span><strong>现货支持按平台规则售后；定制内容确认后，非质量问题需先沟通处理。</strong></div>
        <div><span>小程序衔接</span><strong>真实项目中这里对接小程序登录、收货地址和支付能力。</strong></div>
      </div>
      <button class="wide-action" type="button" data-action="confirm-order" data-product-id="${product.id}">模拟提交订单</button>
    `
  );
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
        <span>${order.carrier}</span>
        <strong>${order.currentNode}</strong>
        <p>物流单号：${order.logisticsNo || "待生成"}</p>
      </div>
      <article class="logistics-product">
        <div class="order-thumb" style="background-position: ${order.thumbX} ${order.thumbY};" aria-hidden="true"></div>
        <div>
          <h3>${order.productName}</h3>
          <p>${order.spec}</p>
          <strong>¥ ${order.price.toLocaleString("zh-CN")} × ${order.quantity}</strong>
        </div>
      </article>
      <div class="detail-list">
        <div><span>订单编号</span><strong>${order.orderNo}</strong></div>
        <div><span>购买时间</span><strong>${order.createdAt}</strong></div>
        <div><span>支付时间</span><strong>${order.paidAt}</strong></div>
        <div><span>收件信息</span><strong>${order.receiver}<br>${order.address}</strong></div>
      </div>
      <section class="logistics-timeline">
        <h3>物流轨迹</h3>
        ${order.logistics
          .map(
            (item, index) => `
              <div class="${index === 0 ? "is-current" : ""}">
                <span></span>
                <p>${item}</p>
              </div>
            `
          )
          .join("")}
      </section>
      <div class="sheet-actions">
        <button class="secondary-action" type="button" data-action="copy-logistics" data-order-id="${order.id}">复制单号</button>
        <button class="primary-action" type="button" data-action="show-toast" data-toast="真实项目中这里可跳转快递轨迹页">查看完整轨迹</button>
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
        <div><span>门店</span><strong>${storeInfo.name}</strong></div>
        <div><span>地址</span><strong>${storeInfo.address}</strong></div>
        <div><span>到店服务</span><strong>线下看实物、听铃音、选绳色，也可预约自提。</strong></div>
      </div>
      <div class="route-summary">
        <div><span>步行</span><strong>约 12 分钟</strong></div>
        <div><span>驾车</span><strong>约 8 分钟</strong></div>
        <div><span>公交</span><strong>约 18 分钟</strong></div>
      </div>
      <div class="option-grid" data-sheet-group="route">
        <button class="is-selected" type="button" data-value="walk">步行</button>
        <button type="button" data-value="drive">驾车</button>
        <button type="button" data-value="bus">公交</button>
      </div>
      <div class="sheet-actions">
        <button class="secondary-action" type="button" data-action="copy-address">复制地址</button>
        <button class="primary-action" type="button" data-action="open-map">打开地图</button>
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
    results.innerHTML = [
      ...productHits.slice(0, 4).map(
        (product) => `
          <button class="search-result" type="button" data-action="open-product" data-product-id="${product.id}">
            <span>产品</span>
            <strong>${product.name} · ${money(product.price)}</strong>
          </button>
        `
      ),
      ...caseHits.slice(0, 3).map(
        (item) => `
          <button class="search-result" type="button" data-action="open-case" data-case-id="${item.id}">
            <span>案例</span>
            <strong>${item.title}</strong>
          </button>
        `
      ),
    ].join("");
  };

  render();
  input.addEventListener("input", render);
  input.focus();
}

function submitBooking() {
  const type = document.querySelector('[data-booking-group="type"] .is-selected')?.dataset.value || "定制咨询";
  const time = document.querySelector('[data-booking-group="time"] .is-selected')?.dataset.value || "今天 15:00";
  const note = document.getElementById("bookingNote")?.value.trim();
  showToast(`已模拟提交：${type}，${time}${note ? `，备注：${note}` : ""}`);
}

async function copyAddress() {
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

function openMap() {
  const mode = document.querySelector('[data-sheet-group="route"] .is-selected')?.dataset.value || "walk";
  const url = buildMapUrl(mode);
  if (window.wx?.miniProgram?.postMessage) {
    window.wx.miniProgram.postMessage({
      data: {
        type: "openLocation",
        name: storeInfo.name,
        address: storeInfo.address,
        latitude: storeInfo.latitude,
        longitude: storeInfo.longitude,
      },
    });
    showToast("已发送门店导航给小程序");
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
      if (action === "open-navigation") openNavigation();
      if (action === "open-search") openSearch();
      if (action === "close-sheet") closeSheet();
      if (action === "copy-address") copyAddress();
      if (action === "copy-logistics") copyLogistics(button.dataset.orderId);
      if (action === "open-map") openMap();
      if (action === "points-checkin") showToast("签到成功，积分 +5");
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
          showToast("真实项目中这里接入小程序支付");
        } else {
          openLogistics(button.dataset.orderId);
        }
      }
      if (action === "confirm-order") {
        closeSheet();
        showToast("订单已模拟提交。真实项目中此处接入小程序支付。");
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

  nodes.productSearch.addEventListener("input", (event) => {
    state.productQuery = event.target.value;
    renderProducts();
  });

  document.addEventListener("submit", (event) => {
    if (event.target.id === "consultForm") {
      event.preventDefault();
      closeSheet();
      showToast("咨询已模拟提交。真实项目中可转入企微、客服或表单系统。");
    }
  });
}

function init() {
  renderHome();
  renderProducts();
  renderCases();
  renderOrders();
  bindEvents();
}

init();
