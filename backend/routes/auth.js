const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JSONDatabase = require('../utils/database');
const auth = require('../middleware/auth');

const router = express.Router();
const userDB = new JSONDatabase('users.json');

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = userDB.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = userDB.insert({
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      role: 'user'
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    console.log('Backend: Login request received');
    console.log('Backend: Request body:', req.body);
    console.log('Backend: Request headers:', req.headers);
    
    const { email, password } = req.body;
    
    console.log('Backend: Extracted email:', email);
    console.log('Backend: Extracted password:', password);
    console.log('Backend: Email type:', typeof email);
    console.log('Backend: Password type:', typeof password);
    console.log('Backend: Email length:', email ? email.length : 'undefined');
    console.log('Backend: Password length:', password ? password.length : 'undefined');

    // Validation
    if (!email || !password) {
      console.log('Backend: Validation failed - missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    console.log('Backend: Searching for user with email:', email);
    const allUsers = userDB.read ? userDB.read() : [];
    console.log('Backend: All users in database:', allUsers.map(u => ({ email: u.email, name: u.name })));
    
    const user = userDB.findOne({ email });
    console.log('Backend: User lookup result:', user ? 'User found' : 'User not found');
    if (!user) {
      console.log('Backend: User not found in database');
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    console.log('Backend: User found:', { id: user.id, name: user.name, email: user.email });
    console.log('Backend: Stored password hash:', user.password);

    // Check password
    console.log('Backend: About to compare passwords...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Backend: Password comparison result:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('Backend: Password validation failed');
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    console.log('Backend: Password validation successful, generating token...');

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get User Profile (Protected Route)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = userDB.findOne({ id: req.user.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update User Profile (Protected Route)
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (phone) updates.phone = phone;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const updatedUser = userDB.update(req.user.userId, updates);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change Password (Protected Route)
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    const user = userDB.findOne({ id: req.user.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    userDB.update(req.user.userId, { password: hashedNewPassword });

    res.json({ 
      success: true,
      message: 'Password changed successfully' 
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
