# Bake & Take - Node.js Backend

A Node.js/Express backend for the Bake & Take cake shop e-commerce application, converted from Django.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Customer, Staff, Admin, and Delivery Boy user types
- **Product Management**: CRUD operations for products with image gallery support
- **Order Management**: Complete order processing system with payment tracking
- **Custom Orders**: Custom cake design orders with image uploads
- **Feedback System**: Product reviews and ratings with approval workflow
- **File Uploads**: Image handling with Multer
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Database**: MongoDB with Mongoose ODM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Validation**: express-validator
- **Security**: Helmet, CORS, bcryptjs
- **Environment**: dotenv

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env` file and update the values:
   ```
   NODE_ENV=development
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/bake_take_db
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=9m
   JWT_REFRESH_EXPIRE=1d
   CORS_ORIGIN=http://localhost:3000,http://localhost:3001
   ```

3. **Start MongoDB**:
   Make sure MongoDB is running on your system.

4. **Run the application**:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /user/register` - Register new user
- `POST /user/login` - User login
- `GET /user/profile` - Get user profile (protected)

### Users
- `GET /user/getAllcustomers` - Get all customers (Admin/Staff)
- `GET /user/getAllstaff` - Get all staff (Admin)
- `POST /user/registerStaff` - Register staff member (Admin)
- `PUT /user/update/:id` - Update user profile
- `DELETE /user/delete/:id` - Delete user (Admin)

### Products
- `GET /product/getAllproduct` - Get all products
- `GET /product/getDetailedProduct/:id` - Get product details
- `POST /product/add` - Add new product (Admin/Staff)
- `PUT /product/update/:id` - Update product (Admin/Staff)
- `DELETE /product/delete/:id` - Delete product (Admin/Staff)
- `GET /product/categories` - Get all categories

### Orders
- `POST /order/placeOrder` - Place new order (Customer)
- `GET /order/getAllorder` - Get all orders (Admin/Staff)
- `GET /order/getDetaildOrder/:id` - Get order details (Admin/Staff)
- `GET /order/orderdProducts/:id` - Get ordered products (Admin/Staff)
- `PUT /order/update/:id` - Update order status (Admin/Staff)
- `DELETE /order/delete/:id` - Delete order (Admin)
- `GET /order/user/orders/:userId` - Get user orders

### Feedback
- `POST /feedback/add` - Add product feedback (Customer)
- `GET /feedback/all` - Get all feedback
- `GET /feedback/product/:productId` - Get product feedback
- `PUT /feedback/approve/:id` - Approve feedback (Admin/Staff)
- `DELETE /feedback/delete/:id` - Delete feedback (Admin/Staff)

### Custom Orders
- `POST /customizeorder/create` - Create custom order (Customer)
- `GET /customizeorder/all` - Get all custom orders (Admin/Staff)
- `GET /customizeorder/details/:id` - Get custom order details
- `PUT /customizeorder/update/:id` - Update custom order (Admin/Staff)
- `GET /customizeorder/user/:userId` - Get user custom orders
- `DELETE /customizeorder/delete/:id` - Delete custom order (Admin)

## User Roles

- **CUSTOMER**: Can place orders, add feedback, create custom orders
- **STAFF**: Can manage products, orders, and feedback
- **ADMIN**: Full access to all operations including user management
- **DELIVER_BOY**: Delivery personnel (future implementation)

## File Structure

```
backend-nodejs/
├── controllers/          # Route controllers
├── middleware/          # Custom middleware
├── models/             # Mongoose models
├── routes/             # Express routes
├── uploads/            # File uploads directory
├── utils/              # Utility functions
├── .env               # Environment variables
├── server.js          # Main application file
└── package.json       # Dependencies and scripts
```

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet security headers
- File upload restrictions

## Migration from Django

This backend maintains API compatibility with the original Django backend:
- Same endpoint URLs and request/response formats
- Equivalent user authentication and authorization
- Compatible database schema (adapted for MongoDB)
- Same business logic and validation rules

## Development

```bash
# Install nodemon for development
npm install -g nodemon

# Run in development mode
npm run dev

# Run tests (when implemented)
npm test
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure proper MongoDB connection
4. Set up reverse proxy (nginx)
5. Use PM2 for process management
6. Enable SSL/HTTPS
7. Configure proper CORS origins

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License