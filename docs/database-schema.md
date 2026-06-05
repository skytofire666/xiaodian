# 数据库表说明

这套表只负责建结构，不导入本地假数据。`.env.local` 配好 MySQL 后运行：

```bash
npm run db:setup
```

## 前台当前已直接读取的基础表

- `store_info`：品牌/门店基础信息，前台门店页会用到地址、电话、营业时间、经纬度。
- `products`：商品列表和详情，前台首页、产品页、下单会用。
- `cases`：搭配案例，前台首页、案例页会用。
- `orders`：订单主表，前台我的订单、物流详情会用。
- `bookings`：到店预约/定制预约。
- `consultations`：在线咨询/定制咨询。

## 后台业务扩展表

- `product_categories`：商品分类。
- `stores`：多门店列表，适合后续做多个线下门店。
- `members`、`member_addresses`、`member_point_logs`：会员、收货地址、积分流水。
- `order_items`、`order_payments`、`order_logistics_tracks`：订单商品明细、支付记录、物流轨迹。
- `leads`、`lead_follow_logs`：线索列表和跟进记录。
- `coupons`、`member_coupons`：优惠券配置和用户领券记录。
- `content_banners`、`content_blocks`、`agreements`：首页 Banner、运营内容、协议内容。
- `logistics_companies`、`shipping_templates`：物流公司和运费模板。
- `admin_roles`、`admin_users`、`system_settings`、`payment_configs`、`service_configs`、`operation_logs`：后台账号权限、系统配置、支付/客服配置和操作日志。

## 填数据的关键提醒

- 现在前台页面主要读取 `products`、`cases`、`orders`、`store_info` 这几张表。
- 如果你先手动补商品，至少填写 `products.id`、`products.name`、`products.type`、`products.price`，并保持 `active = 1`。
- 如果你先手动补案例，至少填写 `cases.id`、`cases.title`，`product_ids` 建议填 JSON 数组，例如 `["product-001"]`。
- 如果你先手动补物流，当前页面会优先读 `orders.logistics_no`、`orders.carrier`、`orders.logistics`。`order_logistics_tracks` 是后续更规范的轨迹表。
