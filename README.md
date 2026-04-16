# 🛒 MultiVendor E-Commerce Platform

![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-ES2020-blue?logo=typescript)
![Express](https://img.shields.io/badge/Express-5.x-black?logo=express)
![MySQL](https://img.shields.io/badge/MySQL-8+-orange?logo=mysql)
![Sequelize](https://img.shields.io/badge/ORM-Sequelize-blue)
![Docker](https://img.shields.io/badge/Docker-✓-blue?logo=docker)
![AWS S3](https://img.shields.io/badge/AWS-S3-yellow?logo=amazonaws)
![Stripe](https://img.shields.io/badge/Payments-Stripe-purple?logo=stripe)
![Redis](https://img.shields.io/badge/Queue-BullMQ%2FRedis-red?logo=redis)

---

## 🚀 Project Overview

**MultiVendor** is a scalable **e-commerce backend REST API** built with **Node.js + TypeScript**. It supports a three-role system of Admins, Vendors, and Customers with full e-commerce capabilities including product management, orders, refunds, coupons, payments, and background job processing.

---

## 🧰 Tech Stack

| Category       | Tech                              |
| -------------- | --------------------------------- |
| 🧠 Language    | TypeScript (ES2020)               |
| ⚙️ Runtime     | Node.js 20 (Alpine)               |
| 🚀 Framework   | Express.js 5                      |
| 🗄️ Database   | MySQL 8 + Sequelize ORM           |
| 🔄 Migrations  | sequelize-cli (20 migrations)     |
| 🔐 Auth        | JWT (Access Token + Refresh Token)|
| 💳 Payments    | Stripe                            |
| ☁️ Storage     | AWS S3 (via multer-s3)            |
| 📧 Email       | Nodemailer                        |
| 📜 Logging     | Winston + CloudWatch              |
| ⏰ Scheduler   | node-cron                         |
| 📬 Queue       | BullMQ + Redis (ioredis)          |
| 🐳 Container   | Docker + Docker Compose           |

---

## 👤 Roles

| Role ID | Role    | Permissions |
|---------|---------|-------------|
| `1`     | Admin   | Manage users, categories, verify vendors, view dashboards, deliver orders |
| `2`     | Vendor  | Manage own products & vendor profile, create coupons, view dashboard |
| `3`     | Customer| Browse products, manage cart, place & cancel orders, write reviews |

---

## 📂 Project Structure

```
MultiVendor/
├── src/
│   ├── config/        ⚙️  db.ts, env.ts, s3Client.ts, redis.ts, sequelizeCliConfig.ts
│   ├── controllers/   🎯  authController, vendorController, productController, orderController, ...
│   ├── jobs/          ⏰  cronJobs.ts
│   ├── middlewares/   🛡️  authMiddleware, roleMiddleware, errorMiddleware, rateLimiter, uploadMiddleware, validationMiddleware
│   ├── migrations/    🔄  20 migration files (users → refund items)
│   ├── models/        🗄️  All Sequelize models + associations (models/index.ts)
│   ├── queues/        📬  Queue.ts (BullMQ queue definitions)
│   ├── routes/        🌐  10 route files
│   ├── seeders/       🌱  seed.ts (admin user + default categories)
│   ├── services/      🧠  Business logic (12 service files)
│   ├── types/         📝  Custom TypeScript types
│   ├── utils/         🔧  logger, apiError, validation, sendEmail, roleAssign
│   ├── workers/       ⚙️  Worker.ts (email worker + stripe worker)
│   └── server.ts      🚀  App entry point
├── .env.development
├── .env.production
├── Dockerfile
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

---

## 🎯 API Endpoints

### 🔐 Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public (rate limited) | Login & get tokens |
| POST | `/refresh-token` | Public (rate limited) | Refresh access token |
| POST | `/logout` | Auth | Logout & clear cookie |
| POST | `/change-password` | Auth | Change password |
| POST | `/forget-password` | Public (rate limited) | Send OTP to email |
| POST | `/reset-password` | Public | Reset password with OTP |

### 🏪 Vendor — `/api/vendor`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/profile` | Vendor | Create vendor profile |
| GET | `/profile` | Vendor | Get own profile |
| PUT | `/profile` | Vendor | Update vendor profile |
| GET | `/dashboard` | Vendor | View vendor dashboard stats |
| GET | `/verify/:id` | Admin | Verify a vendor by ID |

### 📦 Product — `/api/product`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Vendor | Create product (with image upload to S3) |
| GET | `/` | Vendor | Get own products |
| DELETE | `/:id` | Vendor | Soft-delete a product |
| POST | `/search-product` | Customer | Search products with filters & pagination |

### 🛒 Cart — `/api/cart`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/create` | Customer | Add item to cart |
| GET | `/` | Customer | View cart |
| DELETE | `/:id` | Customer | Remove item from cart |

### 📋 Order — `/api/order`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Customer | Place order from cart |
| POST | `/add-card` | Customer | Save a payment card (Stripe) |
| POST | `/create-payment` | Customer | Create Stripe payment |
| GET | `/listorder` | Customer | List own orders |
| PUT | `/cancel/:id` | Customer | Cancel an order |
| PATCH | `/deliver/:id` | Admin | Mark order as delivered |
| POST | `/return` | Customer | Request a refund/return |

### 🏷️ Category — `/api/category`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Admin | Create a category |
| GET | `/` | Auth | List all categories |
| DELETE | `/:id` | Admin | Delete a category |

### 🎟️ Coupon — `/api/coupon`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/create` | Admin / Vendor | Create a coupon |
| DELETE | `/:id` | Admin / Vendor | Delete a coupon |

### ⭐ Review — `/api/review`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Customer | Post a review (with image uploads to S3) |
| DELETE | `/:id` | Customer | Delete own review |

### 👤 User — `/api/user`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/search` | Admin | Search & filter users with pagination |
| DELETE | `/:id` | Admin | Soft-delete a user |

### 🛡️ Admin — `/api/admin`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/dashboard` | Admin | Admin dashboard summary |
| GET | `/topsell` | Admin | Top selling products |
| GET | `/toprated` | Admin | Top rated products |

---

## 📡 API Response Format

```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

Error response:
```json
{
  "success": false,
  "message": "Error description",
  "error": {}
}
```

---

## ⚙️ Environment Variables

Copy `.env.development` and fill in your values. Below are **all** required keys:

```dotenv
# App
NODE_ENV=development
LOG_LEVEL=debug
PORT=3000

# Admin Seed Credentials
NAME=admin
EMAIL=admin@example.com
PASS=admin@123

# MySQL Database
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=vendor
DB_HOST=localhost
DB_PORT=3306

# JWT Secrets
ACCESS_TOKEN=your_access_token_secret
REFRESH_TOKEN=your_refresh_token_secret

# Nodemailer (e.g. Gmail App Password)
SENDER_EMAIL=you@example.com
EMAIL_PASS=your_email_app_password

# Stripe
STRIPE_SECRET_KEY=sk_test_...

# AWS S3 (for file uploads)
AWS_REGION=ap-south-1
AWS_ACCESS_KEY=your_aws_access_key_id
AWS_SECRET_KEY=your_aws_secret_access_key
AWS_BUCKET_NAME=your_s3_bucket_name

# AWS CloudWatch (for production logging — can be same as above)
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key

# Redis — BullMQ queues
REDIS_URL=redis://localhost:6379
```

> ⚠️ Never commit `.env` files. They are listed in `.gitignore`.

---

## 📦 Installation (Local Development)

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 20+ |
| npm | 9+ |
| MySQL | 8+ |
| Redis | 6+ |

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/abhii47/MultiVendor.git
cd MultiVendor

# 2. Install dependencies
npm install

# 3. Configure environment
#    Edit .env.development with your DB, Redis, AWS, Stripe credentials
#    (no need to create a new file — just edit the existing one)

# 4. Compile TypeScript  ← required before running anything
npm run build

# 5. Start the server
#    This automatically runs DB migrations, seeds data, and starts the server
npm run dev
```

> The API will be available at **`http://localhost:3000`**

> **Note:** `npm run dev` does NOT hot-reload. It compiles and runs from `dist/`. After changing source code, run `npm run build` again before `npm run start`.

### Running Steps Individually

If you want more control, run each step manually:

```bash
npm run build                 # Compile TypeScript → dist/
npm run db:migrate:dev        # Run all pending DB migrations
npm run seed                  # Seed admin user + default categories
npm run start                 # Start the server (node dist/server.js)
```

---

## 🐳 Docker (Production)

The `Dockerfile` uses `node:20-alpine`, installs dependencies, builds TypeScript, and runs `npm run docker` (which runs prod migrations + seed + server).

```bash
# Build and start with Docker Compose
docker compose up -d --build
```

- Reads credentials from `.env.production`
- Runs DB migrations (production), seeds data, and starts the server
- Exposes port **3000**

To stop:
```bash
docker compose down
```

---

## 🌱 Database Migrations & Seeding

### Migrations

20 migration files cover the full schema:

`users` → `category` → `otp` → `refresh_token` → `vendor_profile` → `coupon` → `product` → `cart` → `order` → `order_item` → `review` → `cart_item` → `coupon_item` → `coupon_usage` → `stripe_customer` → `user_card` → `refund` → `refund_item` → `user_login_log`

```bash
# Run migrations (development)
npm run db:migrate:dev

# Undo last migration (development)
npm run db:migrate:undo:dev
```

### Seeder

Seeds the following on first run:

| Data | Details |
|------|---------|
| **Admin user** | Uses `NAME`, `EMAIL`, `PASS` from `.env` |
| **Categories** | Electronic, Fashion, Books, Home & Kitchen, Sports, Beauty, Grocery, Baby Product |

```bash
npm run seed
```

> Safe to run multiple times — uses `findOrCreate` and `ignoreDuplicates`.

---

## ⏰ Background Jobs

### Cron Jobs (`node-cron`) — Production only

| Schedule | Job |
|----------|-----|
| Every 10 min | Auto-cancel expired pending orders |
| Every 10 min | Delete expired OTPs from DB |
| Every midnight | Delete expired refresh tokens from DB |

### BullMQ Workers (Redis)

| Queue | Job Name | Action |
|-------|----------|--------|
| `email` | `sendOtpEmail` | Send OTP email via Nodemailer |
| `email` | `sendWelcomeEmail` | Send welcome email to new users |
| `stripe` | `createStripeCustomer` | Create Stripe customer for new users (role 3) |

---

## 🛡️ Security

| Feature | Details |
|---------|---------|
| **Rate Limiting** | Global: 100 req / 15 min · Auth routes: 5 req / 1 min |
| **Input Validation** | `express-validator` on all write endpoints |
| **JWT Auth** | Short-lived access token + long-lived refresh token |
| **Role Guards** | `allowRoles([1,2,3])` middleware on every protected route |
| **File Validation** | Only `jpg`, `jpeg`, `png`, `pdf` allowed · Max 5 MB |
| **SSL (Production)** | Sequelize `rejectUnauthorized: false` via SSL dialect option |
| **Soft Deletes** | Users and products use Sequelize `paranoid: true` |

---

## 📜 NPM Scripts

| Script | What it does |
|--------|--------------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled server (`node dist/server.js`) |
| `npm run dev` | Build → migrate (dev) → seed → start |
| `npm run seed` | Seed admin user + default categories |
| `npm run db:migrate:dev` | Run pending migrations (development) |
| `npm run db:migrate:undo:dev` | Undo last migration (development) |
| `npm run db:migrate:prod` | Run pending migrations (production) |
| `npm run db:migrate:undo:prod` | Undo last migration (production) |
| `npm run docker` | Migrate (prod) → seed → start (used inside Docker) |

---

## 🏗️ Architecture

```
HTTP Request
    ↓
Rate Limiter → Request Logger
    ↓
Router (10 route files)
    ↓
Auth Middleware → Role Middleware → Validation Middleware
    ↓
Controller (thin — calls service)
    ↓
Service (business logic)
    ↓
Sequelize Model → MySQL DB
    ↓ (async side-effects)
BullMQ Queue → Worker (email / stripe)
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit using conventional commits: `git commit -m "feat: add my feature"`
4. Push and open a Pull Request

---

## 📌 Future Improvements

* Redis caching for product listings ⚡
* WebSocket notifications 🔔
* Microservices split 🧩
* CI/CD pipeline (GitHub Actions) 🤖
* Admin frontend dashboard 🖥️

---

## 👨‍💻 Author

**Abhishek Rajpurohit**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub and share it with others!
