# HakimAI Backend API

A Node.js backend API for the HakimAI herbal medicine application with user authentication and AI-powered remedy search.

## Features

- 🔐 **User Authentication**: Registration, login, profile management
- 🌿 **Medicinal Plants Database**: CRUD operations for herbal medicine data
- 🤖 **AI-Powered Remedies**: OpenAI integration for intelligent remedy search
- 📊 **JSON Database**: Simple file-based data storage
- 🛡️ **JWT Authentication**: Secure token-based authentication
- 🔍 **Advanced Search**: Local database + AI fallback search

## Project Structure

```
backend/
├── data/                   # JSON database files
│   ├── users.json         # User data
│   └── medicinal_plants.json  # Herbal medicine data
├── middleware/             # Express middleware
│   └── auth.js            # JWT authentication middleware
├── routes/                 # API route handlers
│   ├── auth.js            # Authentication routes
│   ├── medicinalPlants.js # Medicinal plants CRUD
│   └── remedies.js        # Remedy search and AI
├── utils/                  # Utility functions
│   └── database.js        # JSON database operations
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
└── env.example            # Environment variables template
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy the environment template and configure your variables:

```bash
cp env.example .env
```

Edit `.env` file with your actual values:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-api-key
```

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | User registration | No |
| POST | `/login` | User login | No |
| GET | `/profile` | Get user profile | Yes |
| PUT | `/profile` | Update user profile | Yes |
| PUT | `/change-password` | Change password | Yes |

### Medicinal Plants (`/api/medicinal-plants`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all plants | No |
| GET | `/search` | Search plants | No |
| GET | `/:id` | Get plant by ID | No |
| POST | `/` | Add new plant | Yes |
| PUT | `/:id` | Update plant | Yes |
| DELETE | `/:id` | Delete plant | Yes |

### Remedies (`/api/remedies`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/search` | Search remedies (Local + AI) | No |
| GET | `/popular` | Get popular remedies | No |
| GET | `/symptoms/:symptom` | Get remedies by symptom | No |
| POST | `/save` | Save remedy to favorites | Yes |

## Authentication

### Registration

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Using Protected Routes

Include the JWT token in the Authorization header:

```bash
GET /api/auth/profile
Authorization: Bearer <your-jwt-token>
```

## Database Schema

### Users

```json
{
  "id": "unique-id",
  "name": "User Name",
  "email": "user@example.com",
  "password": "hashed-password",
  "phone": "phone-number",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Medicinal Plants

```json
{
  "id": "unique-id",
  "Scientific Name": "Plant scientific name",
  "Local Name": "Common/local name",
  "Uses": "Medicinal uses and applications",
  "Symptoms": "Symptoms it treats",
  "addedBy": "user-id",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Adding New Routes

1. Create a new route file in `routes/` directory
2. Import and use it in `server.js`
3. Follow the existing pattern for consistency

### Database Operations

Use the `JSONDatabase` utility class for all database operations:

```javascript
const JSONDatabase = require('../utils/database');
const db = new JSONDatabase('filename.json');

// Read all data
const data = db.read();

// Find specific items
const item = db.findOne({ key: 'value' });

// Insert new item
const newItem = db.insert({ key: 'value' });

// Update item
const updated = db.update(id, { key: 'new-value' });

// Delete item
const deleted = db.delete(id);
```

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- Input validation on all endpoints
- CORS enabled for frontend integration
- Environment variables for sensitive data

## Future Enhancements

- [ ] Database migration to PostgreSQL/MongoDB
- [ ] Rate limiting
- [ ] API documentation with Swagger
- [ ] User roles and permissions
- [ ] File upload for plant images
- [ ] Email verification
- [ ] Password reset functionality
- [ ] User favorites system
- [ ] Search analytics

## Troubleshooting

### Common Issues

1. **Port already in use**: Change PORT in .env file
2. **JWT errors**: Ensure JWT_SECRET is set in .env
3. **OpenAI errors**: Verify OPENAI_API_KEY is valid
4. **Database errors**: Check file permissions for data directory

### Logs

Check console output for detailed error messages and API request logs.

## Support

For issues and questions, check the logs or create an issue in the project repository.
