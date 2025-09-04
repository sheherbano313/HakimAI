require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT;

// Enhanced CORS configuration for mobile development
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:19006', // Expo web
    'http://localhost:8081',  // React Native Metro
    'http://localhost:8082',  // React Native Metro (alternative port)
    'exp://localhost:19000',  // Expo Go
    'http://192.168.18.36:19006', // Local network (your actual IP)
    'http://192.168.18.36:3000', // Alternative local network
    'http://192.168.18.36:8081', // Alternative local network
    'http://192.168.18.36:8082', // Alternative local network
    'exp://192.168.18.36:19000', // Expo Go on local network
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (for debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.method === 'POST' && req.body) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Import routes
const authRoutes = require('./routes/auth');
const medicinalPlantsRoutes = require('./routes/medicinalPlants');
const remediesRoutes = require('./routes/remedies');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/medicinal-plants', medicinalPlantsRoutes);
app.use('/api/remedies', remediesRoutes);

// Additional API endpoints
app.get('/api/health-tips', (req, res) => {
  res.json({
    success: true,
    tips: [
      {
        id: '1',
        title: 'Stay Hydrated',
        content: 'Drink at least 8 glasses of water daily for optimal health.',
        category: 'General Health'
      },
      {
        id: '2',
        title: 'Regular Exercise',
        content: 'Aim for at least 30 minutes of moderate exercise daily.',
        category: 'Fitness'
      },
      {
        id: '3',
        title: 'Herbal Tea Benefits',
        content: 'Green tea and chamomile tea have antioxidant properties.',
        category: 'Herbal Medicine'
      },
      {
        id: '4',
        title: 'Balanced Diet',
        content: 'Include fruits, vegetables, and whole grains in your daily meals.',
        category: 'Nutrition'
      }
    ]
  });
});

app.get('/api/hakims', (req, res) => {
  res.json({
    success: true,
    hakims: [
      {
        id: '1',
        name: 'Dr. Ahmed Khan',
        specialization: 'Herbal Medicine',
        experience: '15 years',
        location: 'Karachi',
        phone: '+92-300-1234567',
        rating: 4.8
      },
      {
        id: '2',
        name: 'Dr. Fatima Ali',
        specialization: 'Traditional Medicine',
        experience: '20 years',
        location: 'Lahore',
        phone: '+92-300-2345678',
        rating: 4.9
      },
      {
        id: '3',
        name: 'Dr. Muhammad Hassan',
        specialization: 'Unani Medicine',
        experience: '12 years',
        location: 'Islamabad',
        phone: '+92-300-3456789',
        rating: 4.7
      }
    ]
  });
});

app.post('/api/feedback', (req, res) => {
  const { name, email, message, rating } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Name, email, and message are required'
    });
  }

  // In a real app, you'd save this to a database
  console.log('Feedback received:', { name, email, message, rating });
  
  res.json({
    success: true,
    message: 'Thank you for your feedback! We appreciate your input.',
    data: { name, email, message, rating, timestamp: new Date().toISOString() }
  });
});

app.get('/api/contact', (req, res) => {
  res.json({
    success: true,
    contact: {
      email: 'support@hakimai.com',
      phone: '+92-300-1234567',
      address: 'Karachi, Pakistan',
      website: 'https://hakimai.com',
      socialMedia: {
        facebook: 'https://facebook.com/hakimai',
        twitter: 'https://twitter.com/hakimai',
        instagram: 'https://instagram.com/hakimai'
      }
    }
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "🌿 HakimAI Backend API is Running",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      medicinalPlants: "/api/medicinal-plants",
      remedies: "/api/remedies"
    },
    documentation: "API documentation coming soon..."
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `The route ${req.originalUrl} does not exist on this server`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 HakimAI Backend Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
  console.log(`🌿 Medicinal Plants: http://localhost:${PORT}/api/medicinal-plants`);
  console.log(`💊 Remedies: http://localhost:${PORT}/api/remedies`);
});
