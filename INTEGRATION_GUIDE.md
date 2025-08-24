# 🚀 HakimAI Frontend-Backend Integration Guide

This guide will help you get both the backend and frontend running together for the HakimAI project.

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (for frontend)
- OpenAI API key (for AI features)

## 🔧 Step 1: Backend Setup

### 1.1 Install Backend Dependencies
```bash
cd backend
npm install
```

### 1.2 Configure Environment
```bash
# Copy environment template
cp env.example .env

# Edit .env with your values:
# JWT_SECRET=your-super-secret-jwt-key-here
# OPENAI_API_KEY=your-openai-api-key-here
# PORT=5000
```

### 1.3 Start Backend Server
```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

✅ **Backend should now be running on `http://localhost:5000`**

## 📱 Step 2: Frontend Setup

### 2.1 Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 2.2 Configure Backend URL
Edit `src/config/config.ts` to point to your backend:

```typescript
export const CONFIG = {
  API: {
    // For local development
    BASE_URL: 'http://localhost:5000/api',
    
    // For physical device testing, use your computer's IP
    // BASE_URL: 'http://192.168.1.100:5000/api',
  },
  // ... other config
};
```

### 2.3 Start Frontend
```bash
npm start
```

✅ **Frontend should now be running and accessible via Expo**

## 🔗 Step 3: Test Integration

### 3.1 Test Backend API
```bash
cd backend
node test-api.js
```

This will test all major endpoints and verify the system is working.

### 3.2 Test Frontend-Backend Connection
1. Open the frontend in Expo
2. Try to register a new user
3. Try to login with the registered user
4. Navigate to the Remedies screen to test data fetching

## 🌐 Step 4: Device Testing

### 4.1 For Physical Device Testing
If you're testing on a physical device with Expo Go:

1. **Find your computer's IP address:**
   ```bash
   # On Windows
   ipconfig
   
   # On Mac/Linux
   ifconfig
   ```

2. **Update the backend URL in `frontend/src/config/config.ts`:**
   ```typescript
   BASE_URL: 'http://YOUR_COMPUTER_IP:5000/api'
   ```

3. **Ensure both devices are on the same network**

### 4.2 For Web Testing
The frontend will work directly with `localhost:5000` in web browsers.

## 🔐 Step 5: Authentication Flow

### 5.1 User Registration
1. Navigate to Signup screen
2. Fill in user details
3. Submit registration
4. Backend creates user and returns JWT token
5. Frontend stores token in AsyncStorage

### 5.2 User Login
1. Navigate to Login screen
2. Enter email and password
3. Backend validates credentials
4. Returns JWT token
5. Frontend stores token and navigates to main app

### 5.3 Protected Routes
- All API calls automatically include the JWT token
- 401 errors automatically clear invalid tokens
- User stays logged in until logout or token expiry

## 🧪 Step 6: Testing Different Features

### 6.1 Medicinal Plants
- Browse all plants: `GET /api/medicinal-plants`
- Search plants: `GET /api/medicinal-plants/search`
- Get plant details: `GET /api/medicinal-plants/:id`

### 6.2 Remedies Search
- Local search: Searches the JSON database first
- AI fallback: Uses OpenAI when no local results found
- Symptom-based search: Find remedies by specific symptoms

### 6.3 User Management
- Profile updates: `PUT /api/auth/profile`
- Password changes: `PUT /api/auth/change-password`
- Logout: Clears stored tokens

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. Backend Won't Start
```bash
# Check if port is in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux

# Change port in .env if needed
PORT=5001
```

#### 2. Frontend Can't Connect to Backend
```bash
# Check backend is running
curl http://localhost:5000/health

# Verify CORS is enabled (should be automatic)
# Check firewall settings
```

#### 3. Authentication Errors
```bash
# Verify JWT_SECRET is set in backend .env
# Check token expiration (default: 7 days)
# Clear frontend storage and re-login
```

#### 4. OpenAI API Errors
```bash
# Verify OPENAI_API_KEY is valid
# Check API quota and billing
# Test API key separately
```

### Debug Mode

#### Backend Debug
```bash
# Check console logs for:
# - API request logs
# - Database operations
# - OpenAI API calls
# - Error details
```

#### Frontend Debug
```bash
# Check console logs for:
# - API request/response
# - Authentication status
# - Error messages
# - Storage operations
```

## 📊 Step 7: Monitor & Verify

### 7.1 Backend Health Check
```bash
curl http://localhost:5000/health
# Should return: {"status":"healthy","timestamp":"...","uptime":...}
```

### 7.2 API Endpoints Test
```bash
# Test root endpoint
curl http://localhost:5000/

# Test auth endpoint
curl http://localhost:5000/api/auth

# Test medicinal plants endpoint
curl http://localhost:5000/api/medicinal-plants
```

### 7.3 Frontend Integration Test
1. ✅ User registration works
2. ✅ User login works
3. ✅ Data fetching works
4. ✅ Search functionality works
5. ✅ AI integration works
6. ✅ Protected routes work

## 🚀 Step 8: Production Considerations

### 8.1 Backend Production
```bash
# Set NODE_ENV=production
# Use PM2 or similar process manager
# Set up reverse proxy (Nginx/Apache)
# Configure SSL certificates
# Set strong JWT_SECRET
```

### 8.2 Frontend Production
```bash
# Build production version
expo build:web

# Update API endpoints to production URLs
# Configure environment variables
# Set up CI/CD pipeline
```

## 📚 Additional Resources

### Backend Documentation
- See `backend/README.md` for detailed API documentation
- Check `backend/routes/` for endpoint details
- Review `backend/utils/database.js` for database operations

### Frontend Documentation
- See `frontend/README.md` for component details
- Check `frontend/src/api/` for API integration
- Review `frontend/src/config/` for configuration options

### API Testing
- Use Postman or similar tool to test endpoints
- Test authentication flow manually
- Verify error handling and responses

## 🎯 Success Criteria

Your integration is successful when:

1. ✅ Backend starts without errors on port 5000
2. ✅ Frontend connects to backend successfully
3. ✅ User registration and login work
4. ✅ Data flows between frontend and backend
5. ✅ AI-powered search works
6. ✅ Protected routes function correctly
7. ✅ Error handling works gracefully

## 🆘 Getting Help

If you encounter issues:

1. **Check the logs** - Both backend and frontend console
2. **Verify configuration** - Environment variables and URLs
3. **Test endpoints** - Use curl or Postman
4. **Check network** - Firewall, CORS, IP addresses
5. **Review documentation** - Backend and frontend READMEs

---

**🎉 Congratulations! You now have a fully integrated HakimAI application!**

The frontend and backend are now working together to provide:
- User authentication and management
- Medicinal plants database access
- AI-powered remedy search
- Secure API communication
- Professional user experience

**Happy coding! 🌿💻📱**
