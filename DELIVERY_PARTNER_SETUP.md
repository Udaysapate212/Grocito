# Grocito Delivery Partner System Setup Guide

## 🚀 System Overview

The Grocito Delivery Partner System consists of three main components:

- **Backend API** (Spring Boot) - Port 8080
- **Admin Dashboard** (React) - Port 3001
- **Delivery Partner Dashboard** (React) - Port 3002

## 📋 Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

## 🛠️ Setup Instructions

### 1. Database Setup

```sql
-- Create database
CREATE DATABASE grocito_db;

-- The application will automatically create tables on first run
```

### 2. Backend Setup (Spring Boot)

```bash
# Navigate to project root
cd grocito

# Update application.properties with your database credentials
# src/main/resources/application.properties

# Run the backend
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**

### 3. Admin Dashboard Setup

```bash
# Navigate to admin frontend
cd grocito-frontend-admin

# Install dependencies
npm install

# Start the admin dashboard
npm start
```

The admin dashboard will start on **http://localhost:3000**

### 4. Delivery Partner Dashboard Setup

```bash
# Navigate to delivery partner frontend
cd grocito-frontend-delivery-partner

# Install dependencies
npm install

# Start the delivery partner dashboard
npm start
```

The delivery partner dashboard will start on **http://localhost:3002**

## 🔐 Default Access

### Admin Dashboard (http://localhost:3000)

- **Super Admin:** admin@grocito.com / admin123
- **Regional Admin:** Various demo accounts available

### Delivery Partner Dashboard (http://localhost:3002)

- Register new account or use verified partner credentials

## 📱 System Workflow

### For Delivery Partners:

1. **Register** at http://localhost:3002/auth/register
2. **Wait for verification** (admin approval required)
3. **Login** after verification
4. **Set availability** (Available/Busy/Offline)
5. **Accept orders** and update delivery status
6. **Track earnings** and performance

### For Admins:

1. **Login** to admin dashboard at http://localhost:3000
2. **Navigate** to "Delivery Partners" section
3. **Review** verification requests
4. **Approve/Reject** partner applications
5. **Monitor** partner performance and analytics
6. **Manage** partner availability and assignments

## 🎯 Key Features

### Smart Order Assignment

- Maximum 3 orders per partner simultaneously
- Pincode-based partner filtering
- Automatic availability management
- First-come-first-serve assignment logic

### Role-Based Access Control

- **Super Admin:** Access to all pincodes and partners
- **Regional Admin:** Access to specific pincode partners only
- **Delivery Partner:** Personal dashboard and order management

### Real-Time Features

- Live availability status updates
- Real-time order notifications
- Instant status changes
- Performance tracking

## 🔧 Configuration

### Backend Configuration

Edit `src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/grocito_db
spring.datasource.username=your_username
spring.datasource.password=your_password

# Email (for notifications)
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
```

### Frontend Configuration

Both frontends use the backend API at `http://localhost:8080/api`

## 📊 API Endpoints

### Delivery Partner Authentication

- `POST /api/delivery-partner-auth/register` - Register new partner
- `POST /api/delivery-partner-auth/login` - Partner login
- `POST /api/delivery-partner-auth/forgot-password` - Password reset request
- `POST /api/delivery-partner-auth/reset-password` - Reset password with token

### Admin Management

- `GET /api/delivery-partner-auth/pending-verification` - Get pending requests
- `PUT /api/delivery-partner-auth/{id}/verification-status` - Approve/reject partner
- `GET /api/delivery-partners/all` - Get all partners (role-based)
- `GET /api/delivery-partners/analytics` - Get partner analytics

### Order Assignment

- `POST /api/order-assignments/assign-auto` - Auto-assign order
- `PUT /api/order-assignments/{id}/accept` - Accept order
- `PUT /api/order-assignments/{id}/reject` - Reject order
- `PUT /api/order-assignments/{id}/status` - Update order status

## 🐛 Troubleshooting

### Common Issues:

1. **Port conflicts:** Ensure ports 3000, 3002, and 8080 are available
2. **Database connection:** Verify MySQL is running and credentials are correct
3. **CORS issues:** Backend is configured for localhost origins
4. **Email notifications:** Configure SMTP settings for email features

### Logs:

- Backend logs: Console output and `logs/grocito.log`
- Frontend logs: Browser developer console

## 🎨 UI Features

### Modern Design

- Responsive layout for all screen sizes
- Consistent design system across dashboards
- Intuitive navigation and user experience
- Real-time status indicators

### Mobile Support

- Mobile-friendly delivery partner dashboard
- Touch-optimized controls
- Responsive tables and forms

## 🔄 Development

### Adding New Features:

1. Backend: Add controllers, services, and entities
2. Frontend: Create components and API services
3. Update routing and navigation
4. Test integration between components

### Database Changes:

- Spring Boot auto-updates schema on restart
- Manual migrations can be added if needed

## 📈 Monitoring

### Performance Metrics:

- Partner availability rates
- Order completion times
- System utilization
- Error rates and logs

### Analytics Available:

- Partner performance statistics
- Pincode-wise distribution
- Vehicle type analytics
- Earnings tracking

## 🚀 Production Deployment

### Backend:

```bash
mvn clean package
java -jar target/grocito-0.0.1-SNAPSHOT.jar
```

### Frontend:

```bash
# Admin Dashboard
cd grocito-frontend-admin
npm run build
# Deploy build/ folder to web server

# Delivery Partner Dashboard
cd grocito-frontend-delivery-partner
npm run build
# Deploy build/ folder to web server
```

## 📞 Support

For issues or questions:

1. Check logs for error details
2. Verify all services are running
3. Ensure database connectivity
4. Review API endpoint responses

---

**Happy Delivering! 🚚✨**
