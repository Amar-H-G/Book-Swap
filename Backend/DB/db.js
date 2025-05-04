// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://Amar:AmarPatra@easy-book-exchange.kzxpkro.mongodb.net/?retryWrites=true&w=majority', {
      dbName: 'Easy-Book-Exchange',
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;