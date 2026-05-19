# AGI&FBHC 主页部署文档

> 记录前后端部署方式、端口配置和服务管理

---

## 一、架构概览

```
用户访问
    ↓
Nginx (端口 80)
    ├── /      → 前端 Vite Preview (端口 4173)
    └── /api/  → 后端 Node.js API (端口 3001)
```

| 组件 | 端口 | 说明 |
|------|------|------|
| Nginx | 80 | 统一入口，反向代理 |
| 前端 (vite preview) | 4173 | React + Vite 生产预览 |
| 后端 (Node.js) | 3001 | Express API 服务 |
| MySQL | 3306 | 数据库 |

---

## 二、项目目录结构

```
agi-fbhc-homepage/
├── app/                    # 前端代码
│   ├── src/
│   ├── dist/               # 构建输出
│   ├── .env.production     # 生产环境配置
│   └── package.json
├── backend/                # 后端代码
│   ├── server.js           # 入口文件
│   ├── routes/             # API 路由
│   ├── services/           # 业务逻辑
│   ├── scripts/            # 工具脚本
│   ├── .env                # 环境变量
│   └── package.json
└── DEPLOY.md               # 本文件
```

---

## 三、前端部署

### 3.1 技术栈
- React + TypeScript + Vite
- Tailwind CSS
- Framer Motion

### 3.2 构建

```bash
cd /home/jnuaipr/Documents/GitHub/agi-fbhc-homepage/app

# 安装依赖
npm install

# 生产构建
npm run build
```

### 3.3 生产环境配置

文件：`app/.env.production`

```env
VITE_API_BASE=http://192.168.31.79:3001/api
```

> 注意：使用内网 IP，通过 Nginx 代理后实际访问的是相对路径 `/api/`

### 3.4 服务管理

**systemd 服务文件**：`/etc/systemd/system/agi-frontend.service`

```ini
[Unit]
Description=AGI&FBHC Homepage Frontend
After=network.target

[Service]
Type=simple
User=jnuaipr
WorkingDirectory=/home/jnuaipr/Documents/GitHub/agi-fbhc-homepage/app
ExecStart=/home/jnuaipr/.nvm/versions/node/v22.21.0/bin/npx vite preview --port 4173 --host 0.0.0.0
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

**常用命令**：

```bash
# 启动
sudo systemctl start agi-frontend

# 停止
sudo systemctl stop agi-frontend

# 重启
sudo systemctl restart agi-frontend

# 查看状态
sudo systemctl status agi-frontend

# 开机自启
sudo systemctl enable agi-frontend

# 查看日志
sudo journalctl -u agi-frontend -f
```

---

## 四、后端部署

### 4.1 技术栈
- Node.js 22 + Express
- MySQL2 (数据库驱动)
- node-cron (定时任务)

### 4.2 环境变量

文件：`backend/.env`

```env
PORT=3001
NODE_ENV=production

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=<密码>
DB_NAME=agi_fbhc_homepage

CACHE_TTL_SECONDS=300
CORS_ORIGIN=*
```

### 4.3 数据库

**数据库名**：`agi_fbhc_homepage`

**主要表**：
- `articles` - 文章数据（微信文章、GitHub 动态等）

**连接信息**：
- Host: localhost
- Port: 3306
- User: root

### 4.4 API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/articles` | 获取文章列表 |
| GET | `/api/articles/:id` | 获取单篇文章 |
| POST | `/api/articles/import-wechat` | 导入微信文章 ZIP |
| POST | `/api/articles/sync-github` | 同步 GitHub 仓库到数据库 |
| GET | `/api/github/stats` | GitHub 统计 |

**请求示例**：
```bash
# 同步 GitHub 仓库（完整模式，读取 README）
curl -X POST http://localhost/api/articles/sync-github \
  -H "Content-Type: application/json" \
  -d '{}'

# 快速模式（仅元数据，不读 README）
curl -X POST http://localhost/api/articles/sync-github \
  -H "Content-Type: application/json" \
  -d '{"quick": true}'

# 限制数量（测试用）
curl -X POST http://localhost/api/articles/sync-github \
  -H "Content-Type: application/json" \
  -d '{"maxRepos": 5}'
```

**请求示例**：
```bash
# 获取最新6篇文章
curl "http://localhost/api/articles?limit=6&sortBy=date&sortOrder=desc"

# 按分类筛选
curl "http://localhost/api/articles?category=AI%20for%20Biology&limit=6"
```

### 4.5 服务管理

**systemd 服务文件**：`/etc/systemd/system/agi-backend.service`

```ini
[Unit]
Description=AGI&FBHC Homepage Backend
After=network.target mysql.service

[Service]
Type=simple
User=jnuaipr
WorkingDirectory=/home/jnuaipr/Documents/GitHub/agi-fbhc-homepage/backend
Environment=DB_PASSWORD=<密码>
Environment=NODE_ENV=production
Environment=PORT=3001
ExecStart=/home/jnuaipr/.nvm/versions/node/v22.21.0/bin/node server.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

**常用命令**：

```bash
# 启动
sudo systemctl start agi-backend

# 停止
sudo systemctl stop agi-backend

# 重启
sudo systemctl restart agi-backend

# 查看状态
sudo systemctl status agi-backend

# 开机自启
sudo systemctl enable agi-backend

# 查看日志
sudo journalctl -u agi-backend -f
```

---

## 五、Nginx 配置

**配置文件**：`/etc/nginx/sites-available/agi-fbhc-homepage`

```nginx
server {
    listen 80;
    server_name _;
    
    # Frontend proxy to vite preview
    location / {
        proxy_pass http://127.0.0.1:4173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # API proxy to backend
    location /api/ {
        proxy_pass http://127.0.0.1:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**启用配置**：

```bash
# 创建软链接
sudo ln -sf /etc/nginx/sites-available/agi-fbhc-homepage /etc/nginx/sites-enabled/

# 删除默认配置（避免冲突）
sudo rm -f /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

---

## 六、数据导入

### 6.1 微信文章导入

```bash
cd /home/jnuaipr/Documents/GitHub/agi-fbhc-homepage/backend

# 导入 ZIP 文件
node scripts/import_wechat.js /path/to/wechat_articles.zip

# 预览模式（不写入数据库）
node scripts/import_wechat.js /path/to/wechat_articles.zip --dry-run
```

**API 导入**：
```bash
curl -X POST http://localhost/api/articles/import-wechat \
  -H "Content-Type: application/json" \
  -d '{"zipPath": "/path/to/wechat_articles.zip"}'
```

### 6.2 GitHub 仓库同步

```bash
cd /home/jnuaipr/Documents/GitHub/agi-fbhc-homepage/backend

# 完整同步（读取每个仓库的 README）
node scripts/sync_github_repos.js

# 快速同步（仅元数据，跳过 README）
node scripts/sync_github_repos.js --quick

# 预览模式（不写入数据库）
node scripts/sync_github_repos.js --dry-run

# 限制数量（测试用）
node scripts/sync_github_repos.js --max=5
```

**API 同步**：
```bash
# 完整同步
curl -X POST http://localhost/api/articles/sync-github

# 快速同步
curl -X POST http://localhost/api/articles/sync-github \
  -H "Content-Type: application/json" \
  -d '{"quick": true}'
```

> 每个仓库生成一篇文章，ID 格式为 `github_repo_<仓库名>`。重复运行会自动更新已有条目（基于 `ON DUPLICATE KEY UPDATE`）。

### 6.3 文件存储

导入的文件保存在：
```
/home/jnuaipr/wechat_articles/
├── articles/     # Markdown 文件
├── images/       # 图片资源
└── covers/       # 封面图片
```

---

## 七、常用维护命令

```bash
# 查看所有服务状态
sudo systemctl status agi-frontend agi-backend nginx mysql

# 一键重启所有服务
sudo systemctl restart agi-backend agi-frontend nginx

# 查看后端日志
sudo journalctl -u agi-backend -f

# 查看前端日志
sudo journalctl -u agi-frontend -f

# 数据库连接测试
cd backend && node -e "require('./services/db').testConnection().then(r => console.log(r))"

# 文章统计
curl -s "http://localhost/api/articles/stats"

# GitHub 仓库同步
cd backend && node scripts/sync_github_repos.js
```

---

## 八、故障排查

| 问题 | 排查方法 |
|------|----------|
| 页面打不开 | `sudo systemctl status nginx` + `sudo nginx -t` |
| API 无响应 | `sudo systemctl status agi-backend` + 查看日志 |
| 前端白屏 | `sudo systemctl status agi-frontend` + 检查 `dist/` 是否存在 |
| 数据库错误 | 检查 MySQL 状态 + `.env` 密码配置 |
| 端口冲突 | `sudo lsof -i :4173` / `sudo lsof -i :3001` |

---

## 九、部署 checklist

- [ ] MySQL 数据库已创建 (`agi_fbhc_homepage`)
- [ ] 后端 `.env` 配置正确（特别是 DB_PASSWORD）
- [ ] 前端 `.env.production` API 地址正确
- [ ] 前端已构建 (`npm run build`)
- [ ] systemd 服务已创建并启用
- [ ] Nginx 配置已启用并测试通过
- [ ] 防火墙放行 80 端口（如有）
- [ ] 开机自启已设置

---

**最后更新**：2026-05-18
