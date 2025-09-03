# Mobile Setup Guide for HakimAI

## Prerequisites

1. **Node.js** (v16 or higher)
2. **Expo CLI** (`npm install -g @expo/cli`)
3. **Expo Go** app on your mobile device
4. **Git** (for cloning the repository)

## Step 1: Find Your Computer's IP Address

### On Windows:
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually starts with 192.168.x.x)

### On macOS/Linux:
```bash
ifconfig
# or
ip addr show
```

## Step 2: Update Configuration

1. **Update API Configuration** in `frontend/src/config/config.ts`:
   ```typescript
   BASE_URL: __DEV__ ? 'http://YOUR_IP_ADDRESS:5000/api' : 'http://localhost:5000/api',
   ```
   Replace `YOUR_IP_ADDRESS` with your actual IP address (e.g., `192.168.1.100`)

2. **Update Backend CORS** in `backend/server.js`:
   ```javascript
   origin: [
     // ... existing origins ...
     'http://YOUR_IP_ADDRESS:19006',
     'http://YOUR_IP_ADDRESS:3000',
     'exp://YOUR_IP_ADDRESS:19000',
   ],
   ```

## Step 3: Start the Backend Server

```bash
cd backend
npm install
npm start
```

The server should start on `http://localhost:5000`

## Step 4: Start the Frontend

```bash
cd frontend
npm install
npx expo start
```

## Step 5: Connect Mobile Device

1. **Install Expo Go** on your mobile device from App Store/Google Play
2. **Scan the QR code** displayed in the terminal
3. **Make sure your phone and computer are on the same WiFi network**

## Troubleshooting

### Issue: "Network request failed" or "Cannot connect to server"

**Solutions:**
1. Check if your computer's firewall is blocking the connection
2. Verify both devices are on the same WiFi network
3. Try using your computer's IP address instead of localhost
4. Check if the backend server is running on port 5000

### Issue: App loads but API calls fail

**Solutions:**
1. Verify the IP address in `config.ts` is correct
2. Check if the backend CORS settings include your IP
3. Test the API endpoint directly: `http://YOUR_IP:5000/api/health`

### Issue: Chatbot gets stuck after one response

**Solutions:**
1. Check the backend console for error messages
2. Verify the Gemini API key is set in backend `.env` file
3. Check network connectivity between frontend and backend

## Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GEMINI_API_KEY_T=your-gemini-api-key-here
```

## Testing the Setup

1. **Backend Health Check**: Visit `http://YOUR_IP:5000/health`
2. **API Test**: Visit `http://YOUR_IP:5000/api/medicinal-plants`
3. **Frontend Test**: Open the app and try logging in

## Development Tips

1. **Use Expo DevTools**: Press `d` in the terminal to open developer tools
2. **Reload App**: Shake your device or press `r` in the terminal
3. **Debug Network**: Use browser dev tools to check network requests
4. **Logs**: Check both frontend and backend console logs for errors

## Production Deployment

For production, you'll need to:
1. Set up a proper domain and SSL certificate
2. Use environment-specific configurations
3. Set up proper database (currently using JSON files)
4. Configure proper CORS for your domain
5. Set up monitoring and logging

## Common Commands

```bash
# Start backend
cd backend && npm start

# Start frontend
cd frontend && npx expo start

# Clear Expo cache
npx expo start --clear

# Build for production
npx expo build:android
npx expo build:ios
```

## Support

If you encounter issues:
1. Check the console logs in both frontend and backend
2. Verify network connectivity
3. Ensure all dependencies are installed
4. Check if ports are not being used by other applications
