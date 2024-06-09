const mongoose = require('mongoose');
require('dotenv').config();
const db_url = process.env.db_url; 
mongoose.connect(db_url);

const db = mongoose.connection;

db.once('open', () => {
    console.log('MongoDB connected successfully');
});

db.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err.message);
});

module.exports = db;
