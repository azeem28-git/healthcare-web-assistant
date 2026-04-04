const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/healthcare')
  .then(async () => {
    const db = mongoose.connection.db;
    
    // Admin details
    const adminData = {
      fullName: 'Mohammed Azeem',
      username: 'azeem@2811',
      email: 'mohammedazeem9794@gmail.com',
      password: 'Salman@28', // Updated password
      role: 'admin',
      status: 'approved',
      createdAt: new Date()
    };
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminData.password, salt);
    
    // Insert into Admin collection
    const result = await db.collection('Admin').insertOne({
      ...adminData,
      passwordHash: passwordHash
    });
    
    console.log('Admin created successfully!');
    console.log('Insert Result:', result);
    console.log('\nAdmin Details:');
    console.log('Username:', adminData.username);
    console.log('Password:', adminData.password);
    console.log('Email:', adminData.email);
    console.log('Status:', adminData.status);
    
    process.exit(0);
  })
  .catch(err => {
    console.log('Error:', err.message);
    process.exit(1);
  });
