const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

let db;

const connectDB = async () => {
  if (db) return db;

  try {
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(dbName);
    console.log('Connected to MongoDB Atlas');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas', error);
    throw error;
  }
};

module.exports = connectDB;
