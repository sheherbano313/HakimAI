# HakimAI - Herbal Medicine AI Assistant

A comprehensive herbal medicine application with AI-powered remedy search, user authentication, and a modern React Native frontend.

## 🌟 Features

- 🔐 **User Authentication**: Secure registration, login, and profile management
- 🌿 **Medicinal Plants Database**: Comprehensive herbal medicine information
- 🤖 **AI-Powered Remedies**: OpenAI integration for intelligent remedy search
- 📱 **Cross-Platform App**: React Native app for iOS, Android, and Web
- 🔍 **Advanced Search**: Local database + AI fallback search capabilities
- 📊 **JSON Database**: Simple, efficient file-based data storage

## 🏗️ Project Structure

```
hakimai_project/
├── backend/                 # Node.js Backend API
│   ├── data/               # JSON database files
│   ├── middleware/         # Express middleware
│   ├── routes/             # API route handlers
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # React Native Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── screens/        # App screens
│   │   ├── navigation/     # Navigation setup
│   │   └── api/            # API integration
│   └── package.json        # Frontend dependencies
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (for frontend)
- Expo Go app on your mobile device (for mobile testing)
- Gemini API key (for AI features)

### Mobile Setup
For detailed mobile setup instructions, see [MOBILE_SETUP_GUIDE.md](./MOBILE_SETUP_GUIDE.md)

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env with your values:
# JWT_SECRET=your-secret-key
# GEMINI_API_KEY_T=your-gemini-api-key

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Expo development server
npm start
```

The frontend will open in your browser or Expo Go app.

## 🔧 Backend API

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Medicinal Plants Endpoints

- `GET /api/medicinal-plants` - Get all plants
- `GET /api/medicinal-plants/search` - Search plants
- `GET /api/medicinal-plants/:id` - Get plant by ID
- `POST /api/medicinal-plants` - Add new plant (protected)
- `PUT /api/medicinal-plants/:id` - Update plant (protected)
- `DELETE /api/medicinal-plants/:id` - Delete plant (protected)

### Remedies Endpoints

- `POST /api/remedies/search` - Search remedies (Local + AI)
- `GET /api/remedies/popular` - Get popular remedies
- `GET /api/remedies/symptoms/:symptom` - Get remedies by symptom

## 📱 Frontend Features

- **Authentication Screens**: Login, registration, profile management
- **Main Modules**: Health tips, remedies, hakims directory
- **Search Functionality**: Find remedies by symptoms or plant names
- **Responsive Design**: Works on mobile, tablet, and web

## 🗄️ Database

The application uses JSON files as a simple database:

- `users.json` - User accounts and authentication data
- `medicinal_plants.json` - Herbal medicine information

All data is automatically managed with the `JSONDatabase` utility class.

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes for sensitive operations
- Input validation and sanitization
- CORS configuration for frontend integration

## 🧪 Testing

Test the backend API with the included test script:

```bash
cd backend
node test-api.js
```

This will test all major endpoints and verify the system is working correctly.

## 🚀 Deployment

### Backend Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a process manager like PM2: `pm2 start server.js`
3. Set up reverse proxy with Nginx/Apache
4. Configure SSL certificates

### Frontend Deployment

1. Build the production version: `expo build:web`
2. Deploy the `web-build` folder to your hosting service
3. Update API endpoints to point to your production backend

## 🔮 Recent Fixes & Improvements

### ✅ Fixed Issues
- **Mobile App Connectivity**: Updated API configuration to work on mobile devices
- **Chatbot Stuck Issue**: Improved error handling and timeout management
- **Enter Key Support**: Added proper Enter key handling in chatbot
- **Health Tips Chatbot**: Enhanced with AI-powered responses
- **Better Error Messages**: More user-friendly error handling

### 🚀 New Features
- **Health Tips Chatbot**: Interactive AI assistant for wellness advice
- **Enhanced Chatbot Memory**: Better conversation flow
- **Mobile-Optimized UI**: Improved mobile experience
- **Comprehensive Setup Guide**: Detailed mobile setup instructions

## 🔮 Future Enhancements

For a complete list of planned features, see [FEATURES_ENHANCEMENT_GUIDE.md](./FEATURES_ENHANCEMENT_GUIDE.md)

- [ ] Database migration to PostgreSQL/MongoDB
- [ ] User roles and permissions system
- [ ] File upload for plant images
- [ ] Email verification and password reset
- [ ] User favorites and history
- [ ] Advanced analytics and reporting
- [ ] Mobile app store deployment
- [ ] Multi-language support

## 🐛 Troubleshooting

### Common Issues

1. **Port 5000 already in use**: Change PORT in backend/.env
2. **JWT authentication errors**: Ensure JWT_SECRET is set in backend/.env
3. **OpenAI API errors**: Verify OPENAI_API_KEY is valid
4. **Frontend can't connect to backend**: Check CORS settings and API URLs

### Getting Help

1. Check the console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure both backend and frontend are running
4. Check the backend README for detailed API documentation

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Check the documentation in each directory
- Review the console logs for error details
- Create an issue in the project repository

---

**Happy coding! 🌿💻**
