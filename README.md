# AGI&FBHC Homepage

> 江南大学人工智能与计算生物学实验室（AGI&FBHC）官方网站 —— 展示课题组研究方向、科研成果、最新动态与开源项目。

[中文](#) | [English](#)

---

## 项目简介

本项目是 **AGI&FBHC 实验室** 的官方网站，集成了：

- **课题组介绍** — 研究方向、导师团队、招生信息
- **科研动态** — 微信公众号文章自动同步、GitHub 仓库展示
- **开源项目** — 实验室 GitHub 组织的项目列表与 README 摘要
- **双语支持** — 中英文切换，面向国际学术交流

线上地址：http://agi-fbhc.jiangnan.edu.cn（或内网 192.168.31.79）

---

## 技术架构

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Nginx     │────▶│  Frontend   │     │   Backend   │
│   :80       │     │  Vite 4173  │◀────│  Node 3001  │
└─────────────┘     └─────────────┘     └──────┬──────┘
        │                                       │
        └───────────────────────────────────────┘
                          │
                    ┌─────┴─────┐
                    │  MySQL    │
                    │  :3306    │
                    └───────────┘
```

| 层级 | 技术栈 | 说明 |
|------|--------|------|
| 前端 | React 18 + TypeScript + Vite | 粒子背景、Framer Motion 动画、Tailwind CSS |
| 后端 | Node.js + Express | REST API、MySQL 数据服务 |
| 数据库 | MySQL 8 | `articles` 表存储文章数据 |
| 部署 | Nginx + systemd | 生产环境反向代理 + 进程守护 |

---

## 目录结构

```
agi-fbhc-homepage/
├── app/                          # 前端（React + Vite）
│   ├── src/
│   │   ├── sections/             # 页面区块组件
│   │   │   ├── HeroSection.tsx   # 首页 Hero 粒子背景
│   │   │   ├── UpdatesSection.tsx # 最新动态（文章列表 + Markdown 弹窗）
│   │   │   ├── ResearchGroups.tsx # 研究方向
│   │   │   └── ...
│   │   ├── contexts/             # 语言上下文（i18n）
│   │   └── hooks/                # 自定义 Hooks
│   ├── dist/                     # 构建输出
│   └── .env.production           # 生产环境 API 地址
│
├── backend/                      # 后端（Express）
│   ├── server.js                 # 入口
│   ├── routes/
│   │   └── articles.js           # 文章 API 路由
│   ├── services/
│   │   ├── articles.js           # 文章 CRUD + 缓存
│   │   └── db.js                 # MySQL 连接池
│   ├── scrapers/
│   │   ├── wechat.js             # 微信文章爬取
│   │   └── github.js             # GitHub 仓库同步（README 摘要）
│   ├── scripts/
│   │   ├── import_wechat.js      # 微信 ZIP 导入脚本
│   │   └── sync_github_repos.js  # GitHub 仓库同步脚本
│   └── .env                      # 数据库密码等配置
│
├── DEPLOY.md                     # 完整部署文档
└── README.md                     # 本文件
```

---

## 核心功能

### 1. 最新动态（Updates）

自动聚合多源内容，支持分类筛选：

| 来源 | 同步方式 | 内容 |
|------|----------|------|
| **微信公众号** | ZIP 导入 + 自动解析 | 课题组公众号历史文章 |
| **GitHub** | API 自动同步 | 组织仓库列表 + README 摘要 |

**分类标签**：`LLM & Agents` / `AI for Biology` / `AI for Health` / `Group News`

**弹窗详情**：Markdown 渲染（标题、列表、代码块、图片、表格等）

### 2. 微信文章导入

```bash
cd backend
# 导入 ZIP 文件
node scripts/import_wechat.js /path/to/wechat_articles.zip

# 预览模式
node scripts/import_wechat.js /path/to/wechat_articles.zip --dry-run
```

支持内容自动清理：移除微信 UI 元素、作者行、日期行、JS 占位符等。

### 3. GitHub 仓库同步

```bash
cd backend
# 完整同步（读取每个仓库 README）
node scripts/sync_github_repos.js

# 快速同步（仅元数据）
node scripts/sync_github_repos.js --quick

# 预览
node scripts/sync_github_repos.js --dry-run
```

自动推断分类：基于仓库名、description、topics 标签。

### 4. API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/articles` | 文章列表（支持 category/source 筛选） |
| GET | `/api/articles/:id` | 单篇文章详情 |
| POST | `/api/articles/import-wechat` | 导入微信 ZIP |
| POST | `/api/articles/sync-github` | 同步 GitHub 仓库 |
| GET | `/api/articles/stats` | 统计信息 |

---

## 快速开始

### 环境要求

- Node.js 22+
- MySQL 8+
- Nginx（生产环境）

### 1. 克隆项目

```bash
git clone https://github.com/AGI-FBHC/agi-fbhc-homepage.git
cd agi-fbhc-homepage
```

### 2. 配置数据库

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE agi_fbhc_homepage CHARACTER SET utf8mb4;"

# 创建 articles 表（见 backend/services/db.js 或手动建表）
```

### 3. 启动后端

```bash
cd backend
cp .env.example .env
# 编辑 .env 填写数据库密码

npm install
npm start
# 服务运行在 http://localhost:3001
```

### 4. 启动前端

```bash
cd app
npm install

# 开发模式
npm run dev

# 生产构建
npm run build
npm run preview
```

### 5. 生产部署

详见 [DEPLOY.md](./DEPLOY.md) —— 包含 systemd 服务配置、Nginx 反向代理、开机自启等完整步骤。

---

## 系统服务管理

```bash
# 查看状态
sudo systemctl status agi-frontend agi-backend nginx

# 重启服务
sudo systemctl restart agi-backend agi-frontend

# 查看日志
sudo journalctl -u agi-backend -f
sudo journalctl -u agi-frontend -f
```

---

## 相关仓库

本网站展示的内容来自以下 AGI-FBHC 组织仓库：

| 仓库 | 方向 | 说明 |
|------|------|------|
| [MAPPIS](https://github.com/AGI-FBHC/MAPPIS) | AI for Biology | 蛋白质相互作用位点预测 |
| [IPNET](https://github.com/AGI-FBHC/IPNET) | AI for Health | 药物-靶点相互作用预测 |
| [BUAgents](https://github.com/AGI-FBHC/BUAgents) | LLM & Agents | 企业多智能体操作系统 |
| [GAMA](https://github.com/AGI-FBHC/GAMA) | LLM & Agents | 隐私保护多智能体系统 |
| [XClaw-Auto-Configuration](https://github.com/AGI-FBHC/XClaw-Auto-Configuration) | LLM & Agents | OpenClaw 科研助手配置 |

完整列表见 [GitHub Organization](https://github.com/AGI-FBHC)。

---

## 贡献

欢迎提交 Issue 和 PR！

- 前端问题：请提供浏览器版本和复现步骤
- 后端问题：请提供 `journalctl` 日志片段
- 数据同步问题：请检查 GitHub API 速率限制

---

## 许可证

MIT License © AGI&FBHC Lab, Jiangnan University

---

> 江南大学 · 人工智能与计算生物学实验室  
> Artificial General Intelligence & Frontier Biology and Health Computing Lab
