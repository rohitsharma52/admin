const mongoose = require('mongoose');

const db_url = 'mongodb://localhost:27017/mydatabase';

mongoose.connect(db_url);

const db = mongoose.connection;

db.once('open', () => {
    console.log('MongoDB connected successfully');
});

db.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err.message);
});

module.exports = db;
