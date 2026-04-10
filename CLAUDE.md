# MultiVendor Project Context

## Project Overview
MultiVendor is a Node.js/Express-based e-commerce platform with TypeScript that supports multiple vendors, products, orders, coupons, reviews, and refunds. The project uses Sequelize ORM with MySQL database and integrates with Stripe for payments and AWS S3 for file storage.

## Tech Stack
- **Language**: TypeScript (ES2020)
- **Runtime**: Node.js
- **Framework**: Express 5.x
- **Database**: MySQL 8+ with Sequelize ORM
- **Authentication**: JWT (jsonwebtoken)
- **Payment**: Stripe API
- **File Storage**: AWS S3
- **Email**: Nodemailer (SMTP)
- **Logging**: Winston (with CloudWatch and Daily Rotate)
- **Task Scheduling**: node-cron
- **File Upload**: Multer with Multer-S3
- **Password Hashing**: bcrypt

## Project Structure

### `/src/controllers` - Request Handlers
Handles HTTP requests and responses. Controllers call services for business logic.
- `authController.ts` - Login, signup, OTP, token refresh
- `adminController.ts` - Admin operations
- `userController.ts` - User profile, cards, logs
- `productController.ts` - Product CRUD
- `categoryController.ts` - Category management
- `cartController.ts` - Shopping cart operations
- `orderController.ts` - Order processing
- `reviewController.ts` - Product reviews
- `couponController.ts` - Coupon management
- `vendorController.ts` - Vendor operations

### `/src/services` - Business Logic
Implements business logic and data manipulation. Services interact with models and external APIs.
- `authService.ts` - Authentication logic, JWT tokens
- `userService.ts` - User operations
- `productService.ts` - Product operations
- `cartService.ts` - Cart operations
- `orderService.ts` - Order processing
- `stripeService.ts` - Stripe payment integration
- `refundService.ts` - Refund processing
- `vendorService.ts` - Vendor management
- Similar services for other entities

### `/src/models` - Database Models
Sequelize models defining database schema.
- `userModel.ts` - User table
- `productModel.ts` - Product catalog
- `orderModel.ts`, `orderitemModel.ts` - Orders and line items
- `cartModel.ts`, `cartitemModel.ts` - Shopping cart
- `couponModel.ts`, `couponitemModel.ts`, `couponUsageModel.ts` - Coupons
- `reviewModel.ts` - Product reviews
- `refundModel.ts`, `refundItemModel.ts` - Refunds
- Other supporting models for tokens, OTP, cards, logs

### `/src/routes` - API Routes
Express route definitions mapping endpoints to controllers.
- Structure: `/src/routes/<entity>Route.ts`
- Role-based access control applied via `authMiddleware` and `roleMiddleware`

### `/src/middlewares` - Express Middleware
- `authMiddleware.ts` - JWT authentication
- `roleMiddleware.ts` - Authorization by user role
- `errorMiddleware.ts` - Global error handling
- `logMiddleware.ts` - Request logging
- `uploadMiddleware.ts` - File upload handling
- `validationMiddleware.ts` - Request validation

### `/src/config` - Configuration
- `env.ts` - Environment variables
- `db.ts` - Sequelize database connection
- `s3Client.ts` - AWS S3 client
- `stripe.ts` - Stripe API client

### `/src/utils` - Utility Functions
- `validation.ts` - Input validation schemas
- `sendEmail.ts` - Nodemailer email sending
- `logger.ts` - Winston logger setup
- `apiError.ts` - Custom error class
- `response.ts` - Standardized response formatting
- `s3Helper.ts` - S3 file operations
- `generator.ts` - Generate IDs, OTPs, tokens
- `roleAssign.ts` - Role-based access control
- `loginLog.ts` - User login logging

### `/src/jobs` - Scheduled Tasks
- `cronJobs.ts` - node-cron scheduled jobs

## Coding Standards

### TypeScript
- **Strict Mode**: Enable strict type checking
- **No `any`**: Avoid `any` type; use generics or union types
- **Return Types**: Always explicitly define function return types
- **Async/Await**: Prefer async/await over `.then()` chains
- **Error Handling**: Use try-catch for async operations

### Express/Controllers
- Controllers should be thin; call services for logic
- Use middleware for authentication and validation
- Return standardized responses using `response.ts`
- Always send appropriate HTTP status codes

### Service Layer
- Implement all business logic in services
- Services should handle database operations via models
- Throw `ApiError` with appropriate status codes
- Don't directly access request/response objects

### Database Models
- Use Sequelize hooks for timestamps (createdAt, updatedAt)
- Define indexes on frequently queried columns
- Use proper associations and foreign keys
- Avoid N+1 queries with eager loading

### Error Handling
- Use custom `ApiError` class with status codes
- Global error middleware catches and responds
- Always log errors with Winston logger
- Return meaningful error messages to clients

### Validation
- Use `express-validator` for route-level validation
- Implement input sanitization
- Validate before database operations
- Return 400 status for validation failures

## Environment Variables

### Required .env Variables
```
NODE_ENV=development|production
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=multivendor
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRE=30d
AWS_S3_BUCKET=your-bucket
AWS_S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_PUBLISHABLE_KEY=your-stripe-public
SENDER_EMAIL=noreply@example.com
EMAIL_PASS=your-app-password
LOG_LEVEL=info
```

## API Response Format

All responses follow this structure:
```json
{
  "success": true/false,
  "message": "Description",
  "data": {} | [],
  "error": {} | null
}
```

## Common Workflows

### Adding a New Feature
1. Create model in `/src/models`
2. Create service in `/src/services` with business logic
3. Create controller in `/src/controllers` that uses service
4. Create routes in `/src/routes`
5. Add validation in `/src/utils/validation.ts`
6. Mount routes in `server.ts`

### Handling Payments
- Use `stripeService.ts` for all Stripe operations
- Always verify webhooks before processing
- Handle payment confirmations and failures
- Update order status based on payment result

### File Uploads
- Use `uploadMiddleware.ts` for file handling
- Files go to AWS S3 via `s3Helper.ts`
- Store S3 URLs in database
- Validate file types and sizes before upload

### Authentication
- JWT tokens stored in httpOnly cookies
- Tokens refreshed via refresh endpoint
- Middleware validates token presence and validity
- Include user roles in token payload

## Development Commands
```bash
npm run dev              # Build and run in development
npm run build           # Compile TypeScript to dist/
npm start               # Run production build
npm run db:migrate      # Run database migrations
npm run db:migrate:undo # Rollback migration
npm run seed            # Seed database with initial data
```

## Key Architecture Decisions
- **Service Layer**: All business logic isolated in services
- **Controller Thin**: Controllers only handle HTTP concerns
- **Error Handling**: Centralized via global error middleware
- **JWT Auth**: Stateless authentication with refresh tokens
- **Async Processing**: Use cron jobs for background tasks
- **Logging**: Centralized Winston logger with multiple transports

## Testing Guidelines
- Unit test services independently
- Mock database calls in unit tests
- Integration tests for API endpoints
- Test error scenarios and edge cases

## Performance Considerations
- Add indexes on foreign keys and frequently queried fields
- Use database query optimization and eager loading
- Cache frequently accessed data if needed
- Implement pagination for list endpoints
- Use connection pooling for database

## Security Considerations
- Never log sensitive data (passwords, tokens, API keys)
- Validate all user inputs
- Use parameterized queries (Sequelize handles this)
- Implement rate limiting on sensitive endpoints
- Use HTTPS in production
- Sanitize user-generated content
- Validate Stripe webhooks with signatures
