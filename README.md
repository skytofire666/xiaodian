# 果壳铃手作铺第一版

这是给线下手作店准备的第一版店铺系统，包含移动端店铺页、本地后端接口、后台管理页和本地数据存储。

## 启动

```bash
npm start
```

启动后打开：

- 店铺页：http://localhost:3000
- 后台页：http://localhost:3000/admin.html
- 健康检查：http://localhost:3000/api/health

## 第一版功能

- 商品列表、商品详情、筛选和搜索
- 案例展示
- 咨询提交
- 到店预约提交
- 订单提交
- AI 导购 Agent：回答选款、现货、定制、门店和预约问题
- 后台修改门店资料
- 后台新增/编辑商品
- 后台查看订单、预约和咨询
- 后台更新订单状态

## AI 导购 Agent

店铺页右下角有 `AI` 入口。当前第一版是本地规则型导购，会读取后台商品、案例和门店资料来回答：

- 推荐送礼、车挂、包挂、入门款
- 查询门店地址、营业时间和联系方式
- 引导定制咨询
- 引导到店预约
- 引导用户打开商品详情

接口地址：

```text
POST /api/agent/chat
```

示例：

```json
{
  "message": "我想送新车朋友，推荐什么"
}
```

后面如果要接真正的大模型，可以在这个接口里加模型服务，让 Agent 继续使用现有商品和门店数据作为知识来源。

当前已经接入 DeepSeek V4 Pro。密钥放在本机 `.env.local`，不会提交到 GitHub：

```text
DEEPSEEK_API_KEY=...
DEEPSEEK_MODEL=deepseek-v4-pro
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

后端启动时会自动读取 `.env.local`。如果 DeepSeek 暂时不可用，Agent 会自动回退到本地规则导购。

## 数据文件

- `data/store.seed.json`：初始种子数据，可以提交到 GitHub
- `data/store.json`：运行后自动生成，保存真实订单、预约、咨询和后台修改内容，不提交到 GitHub

如果想恢复初始数据，停止服务后删除 `data/store.json`，再重新启动即可。

## 下一步上线准备

第一版先不接微信支付。后续准备正式上线时，再补充：

- 真实门店地址、电话、客服微信
- 商品图片、价格、库存和规格
- 服务器域名
- 数据库方案
- 微信支付商户号
- 登录、权限和短信/微信通知
