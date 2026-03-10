# Sunscreen Web (Flask)

一个关于**防晒**的小网站（Flask + 数据库），目前提供最小可运行功能：用户注册登录、查看防晒产品、产品详情与评论。

## 本地启动（开发）

### 1) 创建虚拟环境并安装依赖

```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

### 2) 配置环境变量

复制 `.env.example` 为 `.env`，并按需修改。

### 3) 初始化数据库并（可选）填充示例数据

```bash
flask create-db
flask seed
```

### 4) 运行

```bash
python run.py
```

打开 `http://127.0.0.1:5000/`

## 数据库迁移（推荐：生产环境用）

本项目已集成 `Flask-Migrate`。首次创建迁移：

```bash
flask db init
flask db migrate -m "init"
flask db upgrade
```

后续模型变更：

```bash
flask db migrate -m "your message"
flask db upgrade
```

## AWS 部署（Elastic Beanstalk 基础路线）

本项目已提供：
- `wsgi.py`：部署入口
- `Procfile`：让平台用 gunicorn 启动

### 关键环境变量

- `APP_ENV=production`
- `SECRET_KEY=<强随机值>`
- `DATABASE_URL=<RDS 连接串>`

如果你使用 Postgres（RDS），常见示例：
- `DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME`

### 部署要点（概览）

- **不要用 SQLite 做生产数据库**：EB/容器文件系统可能是临时的；生产建议接 **RDS**。
- **迁移策略**：部署后在环境里执行 `flask db upgrade`（或在 CI/CD 中执行）。

后续你给出 Epic/User Story 后，我可以继续补齐：
- AWS 具体方案（EB / ECS / EC2）与配置文件
- RDS（Postgres/MySQL）驱动依赖与连接配置
- 静态资源（S3/CloudFront）与 CI/CD（GitHub Actions）

