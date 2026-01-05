require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Import database connection
const connectDB = require('./config/database');

// Import models
const User = require('./models/User');
const Consult = require('./models/Consult');
const Appointment = require('./models/Appointment');
const Medicine = require('./models/Medicine');
const Payment = require('./models/Payment');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const ADMIN_SIGNUP_CODE = process.env.ADMIN_SIGNUP_CODE || '';

// Basic CORS to allow file:// origins and localhost
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: false,
}));

app.use(express.json());
app.use(morgan('dev'));

const projectRoot = path.join(__dirname, '..');

// Initialize default medicines if collection is empty
async function initializeMedicines() {
  try {
    const count = await Medicine.countDocuments();
    if (count === 0) {
      const defaultMedicines = [
        { id: 1, name: 'Paracetamol 500mg', price: 15.99, category: 'Pain Relief', stock: 50, image: '💊' },
        { id: 2, name: 'Ibuprofen 400mg', price: 18.50, category: 'Pain Relief', stock: 45, image: '💊' },
        { id: 3, name: 'Aspirin 100mg', price: 12.99, category: 'Pain Relief', stock: 60, image: '💊' },
        { id: 4, name: 'Amoxicillin 500mg', price: 25.99, category: 'Antibiotic', stock: 30, image: '💉' },
        { id: 5, name: 'Azithromycin 250mg', price: 28.50, category: 'Antibiotic', stock: 25, image: '💉' },
        { id: 6, name: 'Cetirizine 10mg', price: 8.99, category: 'Allergy', stock: 70, image: '💊' },
        { id: 7, name: 'Loratadine 10mg', price: 9.50, category: 'Allergy', stock: 65, image: '💊' },
        { id: 8, name: 'Omeprazole 20mg', price: 22.99, category: 'Digestive', stock: 40, image: '💊' },
        { id: 9, name: 'Metformin 500mg', price: 19.99, category: 'Diabetes', stock: 35, image: '💊' },
        { id: 10, name: 'Atorvastatin 20mg', price: 24.99, category: 'Cardiac', stock: 30, image: '💊' },
        { id: 11, name: 'Vitamin D3 1000IU', price: 14.99, category: 'Vitamins', stock: 80, image: '💊' },
        { id: 12, name: 'Vitamin C 1000mg', price: 11.99, category: 'Vitamins', stock: 75, image: '💊' }
      ];
      await Medicine.insertMany(defaultMedicines);
      console.log('Default medicines initialized');
    }
  } catch (error) {
    console.error('Error initializing medicines:', error);
  }
}

// Initialize medicines when MongoDB is connected
mongoose.connection.once('open', async () => {
  await initializeMedicines();
});

// Also try to initialize if already connected
if (mongoose.connection.readyState === 1) {
  initializeMedicines();
}

// JWT auth middleware
function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, username, role }
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Require admin role
function requireAdmin(req, res, next) {
  const role = req.user?.role || 'user';
  if (role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
}

// Routes
// API routes must come before static file serving to avoid conflicts
// API info endpoint (for checking API status)
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'HealthCare API is running',
    health: '/api/health',
    auth: {
      signup: '/api/auth/signup',
      login: '/api/auth/login',
      me: '/api/auth/me'
    },
    data: {
      consults: '/api/consults',
      appointments: '/api/appointments',
      medicines: '/api/medicines',
      payments: '/api/payments'
    }
  });
});
// Favicon handler to avoid CSP warnings when browser requests /favicon.ico
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, email, username, password, code } = req.body || {};
    if (!fullName || !email || !username || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Protect or disable signup unless an admin code is configured
    if (!ADMIN_SIGNUP_CODE) {
      return res.status(503).json({ message: 'Signup disabled by server' });
    }
    if (code !== ADMIN_SIGNUP_CODE) {
      return res.status(401).json({ message: 'Invalid admin signup code' });
    }
    
    const exists = await User.findOne({
      $or: [
        { username: new RegExp(`^${username}$`, 'i') },
        { email: new RegExp(`^${email}$`, 'i') }
      ]
    });
    if (exists) return res.status(409).json({ message: 'Username or email already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      email: email.toLowerCase(),
      username,
      passwordHash,
      role: 'admin'
    });
    await user.save();
    return res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Signup failed', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ message: 'Missing credentials' });

    // Demo fallback admin
    if (username === 'admin' && password === 'admin123') {
      const token = jwt.sign({ id: 'demo', username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { id: 'demo', username: 'admin', fullName: 'Default Admin', role: 'admin' } });
    }

    const user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });
    if (!user) return res.status(401).json({ message: 'Invalid username or password' });
    
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid username or password' });

    const role = user.role || 'admin';
    const token = jwt.sign({ id: user._id.toString(), username: user.username, role }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ 
      token, 
      user: { 
        id: user._id.toString(), 
        username: user.username, 
        fullName: user.fullName, 
        email: user.email, 
        role 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

app.get('/api/auth/me', auth, async (req, res) => {
  try {
    if (req.user.id === 'demo') {
      return res.json({ id: 'demo', username: 'admin', fullName: 'Default Admin', role: 'admin' });
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ 
      id: user._id.toString(), 
      username: user.username, 
      fullName: user.fullName, 
      email: user.email, 
      role: user.role || 'admin' 
    });
  } catch (error) {
    console.error('Auth me error:', error);
    return res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// List admins (protected)
app.get('/api/admins', auth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'admin' }).select('fullName username email createdAt');
    const items = users.map(u => ({ 
      id: u._id.toString(), 
      fullName: u.fullName, 
      username: u.username, 
      email: u.email, 
      createdAt: u.createdAt 
    }));
    // include demo admin for visibility
    items.unshift({ 
      id: 'demo', 
      fullName: 'Default Admin', 
      username: 'admin', 
      email: 'demo@example.com', 
      createdAt: new Date().toISOString() 
    });
    return res.json({ items });
  } catch (error) {
    console.error('Admins fetch error:', error);
    return res.status(500).json({ message: 'Error fetching admins', error: error.message });
  }
});

// Consultations: public POST (from website), protected GET (for dashboard)
app.post('/api/consults', async (req, res) => {
  try {
    const { name, email, phone, specialty, symptoms } = req.body || {};
    if (!name || !email || !phone || !specialty || !symptoms) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const consult = new Consult({ name, email, phone, specialty, symptoms });
    await consult.save();
    return res.status(201).json({ message: 'Consultation recorded', item: consult });
  } catch (error) {
    console.error('Consult creation error:', error);
    return res.status(500).json({ message: 'Error recording consultation', error: error.message });
  }
});

app.get('/api/consults', auth, requireAdmin, async (req, res) => {
  try {
    const consults = await Consult.find().sort({ date: -1 });
    return res.json({ items: consults });
  } catch (error) {
    console.error('Consults fetch error:', error);
    return res.status(500).json({ message: 'Error fetching consultations', error: error.message });
  }
});

// Appointments: public POST (from website), protected GET (for dashboard)
app.post('/api/appointments', async (req, res) => {
  try {
    const { name, email, phone, doctor, date, time } = req.body || {};
    if (!name || !email || !phone || !doctor || !date || !time) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const appointment = new Appointment({ name, email, phone, doctor, date, time });
    await appointment.save();
    return res.status(201).json({ message: 'Appointment booked', item: appointment });
  } catch (error) {
    console.error('Appointment creation error:', error);
    return res.status(500).json({ message: 'Error booking appointment', error: error.message });
  }
});

app.get('/api/appointments', auth, requireAdmin, async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    return res.json({ items: appointments });
  } catch (error) {
    console.error('Appointments fetch error:', error);
    return res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
});

// Medicines: public GET (for store), protected POST/PUT/DELETE (for admin management)
app.get('/api/medicines', async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ id: 1 });
    return res.json({ items: medicines });
  } catch (error) {
    console.error('Medicines fetch error:', error);
    return res.status(500).json({ message: 'Error fetching medicines', error: error.message });
  }
});

// Admin endpoints for managing medicines
app.post('/api/medicines', auth, requireAdmin, async (req, res) => {
  try {
    const { name, price, category, stock, image } = req.body || {};
    if (!name || price === undefined || !category || stock === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const maxIdDoc = await Medicine.findOne().sort({ id: -1 });
    const maxId = maxIdDoc ? maxIdDoc.id : 0;
    const medicine = new Medicine({ 
      id: maxId + 1, 
      name, 
      price: parseFloat(price), 
      category, 
      stock: parseInt(stock), 
      image: image || '💊' 
    });
    await medicine.save();
    return res.status(201).json({ message: 'Medicine added', item: medicine });
  } catch (error) {
    console.error('Medicine creation error:', error);
    return res.status(500).json({ message: 'Error adding medicine', error: error.message });
  }
});

app.put('/api/medicines/:id', auth, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, price, category, stock, image } = req.body || {};
    const medicine = await Medicine.findOne({ id });
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    
    if (name) medicine.name = name;
    if (price !== undefined) medicine.price = parseFloat(price);
    if (category) medicine.category = category;
    if (stock !== undefined) medicine.stock = parseInt(stock);
    if (image) medicine.image = image;
    
    await medicine.save();
    return res.json({ message: 'Medicine updated', item: medicine });
  } catch (error) {
    console.error('Medicine update error:', error);
    return res.status(500).json({ message: 'Error updating medicine', error: error.message });
  }
});

app.delete('/api/medicines/:id', auth, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const medicine = await Medicine.findOneAndDelete({ id });
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    return res.json({ message: 'Medicine deleted' });
  } catch (error) {
    console.error('Medicine deletion error:', error);
    return res.status(500).json({ message: 'Error deleting medicine', error: error.message });
  }
});

// Payments: public POST (from checkout), protected GET (for dashboard)
app.post('/api/payments', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, deliveryAddress, paymentMethod, items, totalAmount, cardNumber, expiryDate, cvv } = req.body || {};
    if (!customerName || !customerEmail || !customerPhone || !deliveryAddress || !paymentMethod || !items || !Array.isArray(items) || totalAmount === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
    const isCashOnDelivery = paymentMethod === 'cash_on_delivery';
    const payment = new Payment({
      transactionId,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      paymentMethod,
      items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
      totalAmount: parseFloat(totalAmount),
      cardNumber: cardNumber ? cardNumber.replace(/\d(?=\d{4})/g, '*') : null, // Mask card number
      expiryDate: expiryDate || null,
      cvv: cvv ? '***' : null, // Never store CVV
      status: isCashOnDelivery ? 'pending' : 'completed' // Cash on delivery is pending until payment received
    });
    await payment.save();
    
    // Update medicine stock
    for (const orderItem of items) {
      const medicine = await Medicine.findOne({ id: orderItem.id });
      if (medicine && medicine.stock >= orderItem.quantity) {
        medicine.stock -= orderItem.quantity;
        await medicine.save();
      }
    }
    
    return res.status(201).json({ message: 'Payment processed successfully', item: payment });
  } catch (error) {
    console.error('Payment processing error:', error);
    return res.status(500).json({ message: 'Error processing payment', error: error.message });
  }
});

app.get('/api/payments', auth, requireAdmin, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ date: -1 });
    return res.json({ items: payments });
  } catch (error) {
    console.error('Payments fetch error:', error);
    return res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
});

// AI Chat endpoint (optional): proxies to OpenAI if OPENAI_API_KEY is set
app.post('/api/ai/chat', async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'messages array is required' });
    }
    if (!apiKey) {
      return res.status(503).json({ message: 'AI service unavailable (missing OPENAI_API_KEY)' });
    }
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.3,
        max_tokens: 300
      })
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return res.status(502).json({ message: 'Upstream AI error', detail: data });
    }
    const content = data?.choices?.[0]?.message?.content?.trim() || "I'm sorry, I couldn't generate a response.";
    return res.json({ content });
  } catch (e) {
    return res.status(500).json({ message: 'AI chat failed', error: String(e) });
  }
});

// Serve static files from the project root (HTML, CSS, JS, etc.)
// This must come AFTER all API routes to avoid conflicts
app.use(express.static(projectRoot));

// Auto-try ports: PORT, PORT+1, PORT+2 (helps when 3000 is busy)
const basePort = Number(PORT) || 3000;
const candidatePorts = [basePort, basePort + 1, basePort + 2];

function startOnIndex(idx) {
  if (idx >= candidatePorts.length) {
    console.error('Failed to bind to any port. Please free a port or set PORT env.');
    process.exit(1);
  }
  const port = candidatePorts[idx];
  const server = app.listen(port, () => {
    console.log(`Auth server running on http://localhost:${port}`);
  });
  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} in use. Retrying on port ${candidatePorts[idx + 1] ?? 'none'}...`);
      startOnIndex(idx + 1);
    } else {
      console.error('Server failed to start:', err);
      process.exit(1);
    }
  });
}

startOnIndex(0);
