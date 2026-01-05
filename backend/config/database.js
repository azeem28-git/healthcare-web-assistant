const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
  } catch (error) {
    console.error('\n❌ MongoDB connection error:', error.message);
    console.warn('\n⚠️  Server will continue but database operations may fail.');
    console.log('\n📖 To fix this:');
    console.log('   1. Install MongoDB locally OR use MongoDB Atlas (cloud)');
    console.log('   2. See MONGODB_SETUP.md for detailed instructions');
    console.log('   3. Create backend/.env file with MONGODB_URI');
    console.log('   4. Restart the server\n');
    // Don't exit - allow server to start and handle errors gracefully
  }
};

module.exports = connectDB;

