# HakimAI Frontend

React Native frontend application for the HakimAI herbal medicine platform with full backend integration.

## 🌟 Features

- 🔐 **User Authentication**: Login, registration, and profile management
- 🌿 **Medicinal Plants**: Browse and search herbal medicine database
- 🤖 **AI-Powered Remedies**: Intelligent remedy search with OpenAI integration
- 📱 **Cross-Platform**: Works on iOS, Android, and Web
- 🔍 **Advanced Search**: Local database + AI fallback search
- 💾 **Local Storage**: Secure token and user data storage

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── api/              # API integration layer
│   │   ├── apiService.ts # Main API service
│   │   └── openaiAPI.ts  # Legacy OpenAI API (can be removed)
│   ├── components/       # Reusable UI components
│   ├── config/           # Configuration files
│   │   └── config.ts     # App configuration
│   ├── navigation/       # Navigation setup
│   ├── screens/          # App screens
│   └── tsconfig.json     # TypeScript configuration
├── package.json          # Dependencies
└── README.md             # This file
```

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Backend URL

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

### 3. Start the Frontend

```bash
npm start
```

## 🔧 Backend Integration

### API Service (`src/api/apiService.ts`)

The frontend uses a comprehensive API service that handles:

- **Authentication**: Login, registration, profile management
- **Medicinal Plants**: CRUD operations for herbal medicine data
- **Remedies**: Search with local database + AI fallback
- **Error Handling**: Automatic token refresh and error management
- **Request/Response Interceptors**: Automatic auth token injection

### Key Features

1. **Automatic Token Management**: JWT tokens are automatically stored and included in requests
2. **Error Handling**: 401 errors automatically clear invalid tokens
3. **Loading States**: Built-in loading indicators for better UX
4. **Type Safety**: Full TypeScript support for API responses

## 📱 Screen Integration

### Authentication Screens

- **LoginScreen**: Integrated with `/api/auth/login`
- **SignupScreen**: Integrated with `/api/auth/register`

### Main Screens

- **RemediesScreen**: Integrated with medicinal plants and remedies APIs
- **ModulesScreen**: Main navigation hub
- **Other screens**: Ready for future API integration

## 🔐 Authentication Flow

1. **User Registration**: Creates account and receives JWT token
2. **User Login**: Authenticates and stores JWT token
3. **Protected Routes**: Automatically includes token in requests
4. **Token Expiry**: Handles 401 errors gracefully
5. **Logout**: Clears stored tokens and user data

## 🌐 API Endpoints Used

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Medicinal Plants
- `GET /api/medicinal-plants` - Get all plants
- `GET /api/medicinal-plants/search` - Search plants
- `GET /api/medicinal-plants/:id` - Get plant by ID

### Remedies
- `POST /api/remedies/search` - Search remedies (Local + AI)
- `GET /api/remedies/popular` - Get popular remedies
- `GET /api/remedies/symptoms/:symptom` - Get by symptom

## 🛠️ Development

### Adding New API Endpoints

1. Add the endpoint to `src/api/apiService.ts`
2. Import and use in your screen component
3. Handle loading states and errors appropriately

### Example Usage

```typescript
import { plantsAPI } from '../api/apiService';

// In your component
const [plants, setPlants] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchPlants = async () => {
    try {
      const response = await plantsAPI.getAll();
      if (response.success) {
        setPlants(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch plants:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchPlants();
}, []);
```

## 🔧 Configuration

### Environment-Specific URLs

The app automatically handles different environments:

- **Web Development**: Uses `localhost:5000`
- **Mobile Development**: Can be configured to use computer's IP address
- **Production**: Configure in `config.ts`

### Storage Configuration

- **Auth Token**: Automatically stored in AsyncStorage
- **User Data**: Cached for offline access
- **Settings**: App configuration storage

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Failed**: Check if backend is running and URL is correct
2. **Authentication Errors**: Verify JWT_SECRET is set in backend
3. **CORS Issues**: Backend has CORS enabled for frontend integration
4. **Token Expiry**: Tokens automatically refresh on 401 errors

### Debug Mode

Enable debug logging by checking the console for:
- API request/response logs
- Authentication status
- Error messages

## 🚀 Future Enhancements

- [ ] Offline data caching
- [ ] Push notifications
- [ ] User preferences
- [ ] Advanced search filters
- [ ] Image upload for plants
- [ ] User favorites system
- [ ] Social features

## 📞 Support

For integration issues:
1. Check the backend is running and accessible
2. Verify API endpoints are working (test with Postman)
3. Check console logs for error details
4. Ensure all dependencies are installed

---

**Happy coding! 🌿📱**
