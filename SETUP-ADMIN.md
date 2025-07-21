# 🚀 Grocito Multi-App Setup Guide

## 📌 **Architecture Overview**

```
🏗️ Grocito Platform Architecture:
├── 🛒 grocito-frontend/           (Port 3000 - Customer App)
│   └── Role: USER only
├── 👨‍💼 grocito-frontend-admin/    (Port 3001 - Admin Portal)  
│   └── Role: ADMIN only
├── 🚚 grocito-frontend-delivery/   (Port 3002 - Future)
│   └── Role: DELIVERY_PARTNER only
└── ☕ Backend (Java Spring Boot)   (Port 8080)
    └── Shared APIs for all frontends
```

---

## ✅ **What We've Built**

### 🔐 **Enhanced Role-Based Authentication**
- ✅ Separate admin portal with TypeScript
- ✅ Role validation (ADMIN only for admin portal)
- ✅ Cross-app role protection
- ✅ Secure token management
- ✅ Forgot password for both customer & admin

### 👨‍💼 **Admin Portal Features**
- ✅ Professional admin login page
- ✅ Admin dashboard with analytics
- ✅ Role-based route protection
- ✅ Admin-specific forgot password
- ✅ Clean, data-focused UI design

### 🛒 **Customer App Protection**
- ✅ Enhanced ProtectedRoute with role checking
- ✅ Auto-redirect non-USER roles to appropriate portals
- ✅ Improved security and user experience

---

## 🚀 **Quick Start**

### **1. Start Backend Server**
```bash
# In main project directory
mvn spring-boot:run
# Backend will run on http://localhost:8080
```

### **2. Start Customer App**
```bash
cd grocito-frontend/frontend
npm install
npm start
# Customer app will run on http://localhost:3000
```

### **3. Start Admin Portal**
```bash
cd grocito-frontend-admin
npm install
npm start
# Admin portal will run on http://localhost:3001
```

---

## 🔐 **Login Credentials**

### **Customer App** (`localhost:3000`)
- **Demo User:** `john@example.com` / `password123`
- **Role:** USER only

### **Admin Portal** (`localhost:3001`)
- **Demo Admin:** `admin@grocito.com` / `admin123`
- **Role:** ADMIN only

---

## 🛡️ **Security Features**

### **Role-Based Access Control**
```javascript
// Customer App - Only USER role allowed
if (user.role !== 'USER') {
  // Redirect to appropriate portal
  if (user.role === 'ADMIN') → localhost:3001
  if (user.role === 'DELIVERY_PARTNER') → localhost:3002
}

// Admin Portal - Only ADMIN role allowed
if (user.role !== 'ADMIN') {
  // Access denied - redirect to login
}
```

### **Cross-App Protection**
- ✅ Admin users can't access customer app
- ✅ Customer users can't access admin portal
- ✅ Automatic redirection to correct portal
- ✅ Session cleanup on role mismatch

---

## 📊 **Admin Portal Features**

### **Current Features** ✅
- Professional login interface
- Role-based authentication
- Dashboard with key metrics
- Quick action buttons
- Recent activity feed
- Responsive design

### **Coming Soon** 🚧
- User management interface
- Order management system
- Product management
- Advanced analytics
- Real-time notifications

---

## 🎨 **UI/UX Differences**

### **Customer App** 🛒
- Bright, shopping-focused design
- Product-centric interface
- Colorful, engaging UI
- Mobile-first approach

### **Admin Portal** 👨‍💼
- Professional gray-blue theme
- Data-heavy dashboard design
- Clean, analytical interface
- Desktop-first approach

---

## 🔧 **Technical Stack**

| Component | Customer App | Admin Portal |
|-----------|-------------|--------------|
| **Framework** | React 18 (JS) | React 19 (TS) |
| **Styling** | Tailwind CSS | Tailwind CSS |
| **Port** | 3000 | 3001 |
| **Role** | USER | ADMIN |
| **Focus** | Shopping UX | Data Management |

---

## 📁 **Project Structure**

```
📁 Grocito/
├── 🛒 grocito-frontend/frontend/
│   ├── src/components/
│   │   ├── LoginPage.js ✅
│   │   ├── ForgotPasswordPage.js ✅
│   │   ├── ProtectedRoute.js ✅ (Enhanced)
│   │   └── ... (customer components)
│   └── Role: USER only
├── 👨‍💼 grocito-frontend-admin/
│   ├── src/components/auth/
│   │   ├── AdminLoginPage.tsx ✅
│   │   ├── AdminForgotPasswordPage.tsx ✅
│   │   └── AdminRoute.tsx ✅
│   ├── src/components/dashboard/
│   │   └── AdminDashboard.tsx ✅
│   └── Role: ADMIN only
└── ☕ src/main/java/ (Backend)
    ├── Controller/UserController.java
    ├── Services/UserService.java
    └── Entity/User.java (role: USER/ADMIN/DELIVERY_PARTNER)
```

---

## 🧪 **Testing the Setup**

### **Test Role-Based Access**
1. **Login as Admin** (`admin@grocito.com`) in admin portal
2. **Try accessing customer app** → Should redirect to admin portal
3. **Login as User** (`john@example.com`) in customer app  
4. **Try accessing admin portal** → Should show access denied

### **Test Forgot Password**
1. **Customer App:** `localhost:3000/forgot-password`
2. **Admin Portal:** `localhost:3001/forgot-password`
3. Both should send emails via backend API

---

## 🎯 **Next Steps**

### **Phase 2: Core Admin Features**
1. **User Management Interface**
   - View all users with filtering
   - Edit user roles and details
   - Suspend/activate accounts

2. **Order Management System**
   - View all orders with status
   - Update order status
   - Assign delivery partners

3. **Real-time Features**
   - Live order updates
   - Push notifications
   - Real-time analytics

### **Phase 3: Delivery Partner App**
1. Create `grocito-frontend-delivery` (Port 3002)
2. Delivery-focused mobile interface
3. Order tracking and status updates

---

## 🔗 **API Endpoints Used**

```javascript
// Authentication (Both Apps)
POST /api/users/login
POST /api/users/forgot-password

// Admin-Only APIs
GET  /api/users              // Get all users
PUT  /api/users/{id}/role    // Update user role
GET  /api/orders/all         // Get all orders

// Customer APIs
GET  /api/products
POST /api/orders
GET  /api/orders/user/{id}
```

---

## 🎉 **Success! You now have:**

✅ **Separate, secure admin portal**  
✅ **Role-based authentication system**  
✅ **Cross-app security protection**  
✅ **Professional admin interface**  
✅ **Enhanced customer app security**  
✅ **Scalable multi-app architecture**  

**🚀 Ready for Phase 2: Building core admin management features!**