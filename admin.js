const API_BASE = `${window.location.origin}/api`;

const state = {
  data: null,
  toastTimer: null,
};

const nodes = {
  summaryGrid: document.getElementById("summaryGrid"),
  storeForm: document.getElementById("storeForm"),
  productForm: document.getElementById("productForm"),
  productRows: document.getElementById("productRows"),
  orderList: document.getElementById("orderList"),
  bookingList: document.getElementById("bookingList"),
  consultList: document.getElementById("consultList"),
  toast: document.getElementById("adminToast"),
};

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

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "请求失败");
  return data;
}

function showToast(message) {
  window.clearTimeout(state.toastTimer);
  nodes.toast.textContent = message;
  nodes.toast.classList.add("is-visible");
  state.toastTimer = window.setTimeout(() => nodes.toast.classList.remove("is-visible"), 2200);
}

function productName(productId) {
  return state.data.products.find((product) => product.id === productId)?.name || productId || "未关联商品";
}

function fillForm(form, values) {
  Object.entries(values || {}).forEach(([key, value]) => {
    const field = form.elements[key];
    if (!field) return;
    if (field.type === "checkbox") {
      field.checked = value !== false;
      return;
    }
    field.value = Array.isArray(value) ? value.join(",") : value ?? "";
  });
}

function formObject(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  data.active = form.elements.active ? form.elements.active.checked : undefined;
  return data;
}

function clearProductForm() {
  nodes.productForm.reset();
  nodes.productForm.elements.editingId.value = "";
  nodes.productForm.elements.id.readOnly = false;
  nodes.productForm.elements.active.checked = true;
}

function editProduct(id) {
  const product = state.data.products.find((item) => item.id === id);
  if (!product) return;
  clearProductForm();
  fillForm(nodes.productForm, product);
  nodes.productForm.elements.editingId.value = product.id;
  nodes.productForm.elements.id.readOnly = true;
  nodes.productForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderSummary() {
  const data = state.data;
  const items = [
    ["商品数", data.products.length],
    ["上架商品", data.products.filter((product) => product.active !== false).length],
    ["订单", data.orders.length],
    ["待确认", data.orders.filter((order) => order.status === "待确认").length],
    ["预约", data.bookings.length],
    ["咨询", data.consultations.length],
  ];
  nodes.summaryGrid.innerHTML = items
    .map(
      ([label, value]) => `
        <div class="summary-item">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
        </div>
      `
    )
    .join("");
}

function renderStore() {
  fillForm(nodes.storeForm, state.data.storeInfo);
}

function renderProducts() {
  nodes.productRows.innerHTML = state.data.products
    .map(
      (product) => `
        <tr>
          <td>
            <strong>${escapeHtml(product.name)}</strong>
            <div>${escapeHtml(product.id)}</div>
          </td>
          <td>${escapeHtml(product.type)}</td>
          <td>¥${escapeHtml(product.price)}</td>
          <td>${escapeHtml(product.stock)}</td>
          <td>${product.active === false ? "下架" : "上架"}</td>
          <td><button type="button" data-action="edit-product" data-id="${escapeHtml(product.id)}">编辑</button></td>
        </tr>
      `
    )
    .join("");
}

function renderOrders() {
  if (!state.data.orders.length) {
    nodes.orderList.innerHTML = '<p class="empty">暂无订单</p>';
    return;
  }
  nodes.orderList.innerHTML = state.data.orders
    .map(
      (order) => `
        <article class="list-item">
          <h3>${escapeHtml(order.productName)} · ${escapeHtml(order.status)}</h3>
          <p>订单号：${escapeHtml(order.orderNo)}</p>
          <p>金额：¥${escapeHtml(order.price)}，${escapeHtml(order.spec)}</p>
          <p>收件/联系：${escapeHtml(order.receiver)}</p>
          <p>${escapeHtml(order.address)}</p>
          <div class="item-actions">
            <select data-order-status="${escapeHtml(order.id)}">
              ${["待确认", "待付款", "待发货", "待收货", "评价", "已完成", "已取消"]
                .map((status) => `<option value="${status}" ${status === order.status ? "selected" : ""}>${status}</option>`)
                .join("")}
            </select>
            <button type="button" data-action="save-order" data-id="${escapeHtml(order.id)}">更新</button>
          </div>
        </article>
      `
    )
    .join("");
}

function renderBookings() {
  if (!state.data.bookings.length) {
    nodes.bookingList.innerHTML = '<p class="empty">暂无预约</p>';
    return;
  }
  nodes.bookingList.innerHTML = state.data.bookings
    .map(
      (booking) => `
        <article class="list-item">
          <h3>${escapeHtml(booking.type)} · ${escapeHtml(booking.time)}</h3>
          <p>状态：${escapeHtml(booking.status)}</p>
          <p>备注：${escapeHtml(booking.note || "无")}</p>
          <p>提交时间：${escapeHtml(booking.createdAt)}</p>
        </article>
      `
    )
    .join("");
}

function renderConsultations() {
  if (!state.data.consultations.length) {
    nodes.consultList.innerHTML = '<p class="empty">暂无咨询</p>';
    return;
  }
  nodes.consultList.innerHTML = state.data.consultations
    .map(
      (consult) => `
        <article class="list-item">
          <h3>${escapeHtml(consult.topic)} · ${escapeHtml(productName(consult.productId))}</h3>
          <p>${escapeHtml(consult.message || "未填写咨询内容")}</p>
          <p>联系方式：${escapeHtml(consult.contact || "未填写")}</p>
          <p>状态：${escapeHtml(consult.status)}，提交时间：${escapeHtml(consult.createdAt)}</p>
        </article>
      `
    )
    .join("");
}

function renderAll() {
  renderSummary();
  renderStore();
  renderProducts();
  renderOrders();
  renderBookings();
  renderConsultations();
}

async function loadData() {
  state.data = await apiRequest("/admin/data");
  renderAll();
}

async function saveStore() {
  const payload = formObject(nodes.storeForm);
  await apiRequest("/admin/store", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  showToast("门店资料已保存");
  await loadData();
}

async function saveProduct(event) {
  event.preventDefault();
  const payload = formObject(nodes.productForm);
  const editingId = payload.editingId;
  delete payload.editingId;
  const path = editingId ? `/admin/products/${editingId}` : "/admin/products";
  const method = editingId ? "PUT" : "POST";
  await apiRequest(path, {
    method,
    body: JSON.stringify(payload),
  });
  showToast(editingId ? "商品已更新" : "商品已新增");
  clearProductForm();
  await loadData();
}

async function saveOrder(id) {
  const status = document.querySelector(`[data-order-status="${CSS.escape(id)}"]`)?.value || "待确认";
  await apiRequest(`/admin/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      status,
      currentNode: status === "待确认" ? "订单已提交，等待门店确认" : `订单状态已更新为：${status}`,
    }),
  });
  showToast("订单状态已更新");
  await loadData();
}

function bindEvents() {
  nodes.productForm.addEventListener("submit", (event) => {
    saveProduct(event).catch((error) => showToast(error.message));
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button?.dataset.action) return;
    const { action, id } = button.dataset;
    if (action === "save-store") saveStore().catch((error) => showToast(error.message));
    if (action === "clear-product") clearProductForm();
    if (action === "edit-product") editProduct(id);
    if (action === "save-order") saveOrder(id).catch((error) => showToast(error.message));
  });
}

async function init() {
  bindEvents();
  try {
    await loadData();
  } catch (error) {
    showToast(`后台连接失败：${error.message}`);
  }
}

init();
