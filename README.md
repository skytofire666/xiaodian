# 果壳铃手作铺

这是一个线下手作店的第一版线上店铺系统，包含移动端前台、后台管理页、Node 接口服务和 MySQL 数据库建表脚本。

## 目录结构

```text
web/       前台页面、样式、交互脚本和图片资源（web/assets）
admin/     后台管理页面、样式和交互脚本
serve/     Node 服务、数据库 schema、建表脚本和 JSON 兜底数据
docs/      项目说明文档
```

## 启动

```bash
npm install
npm start
```

启动后打开：

- 前台：http://localhost:3000
- 后台：http://localhost:3000/admin
- 健康检查：http://localhost:3000/api/health

前台默认只展示接口返回的真实数据；如果需要临时看设计样例，可以打开 `http://localhost:3000/?preview=1`。

## 数据库

复制 `.env.example` 为 `.env.local`，填入 MySQL 配置后执行：

```bash
npm run db:setup
```

建表脚本位于 `serve/scripts/setup-database.js`，表结构位于 `serve/db/schema.js`。表说明见 `docs/database-schema.md`。

## 运行数据

- `serve/data/store.seed.json`：JSON 模式下的初始兜底数据，可以提交到 GitHub。
- `serve/data/store.json`：JSON 模式运行后自动生成，不提交到 GitHub。
- MySQL 模式下，真实业务数据写入数据库，本地假数据不会导入数据库。

## 部署提醒

部署到服务器后，推荐同域名转发：

- `/` 指向前台
- `/admin` 指向后台
- `/api` 指向 Node 接口

当前前台和后台默认都不启用演示数据，数据库为空时会显示空态。正式公开前建议先补后台登录和权限保护。
