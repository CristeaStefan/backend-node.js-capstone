require('dotenv').config();
const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URL;
let dbInstance = null;

async function connectToDatabase() {
    if (dbInstance) return dbInstance;

    const client = new MongoClient(url);
    await client.connect();
    dbInstance = client.db(process.env.MONGO_DB);

    console.log("Connected successfully to MongoDB");
    return dbInstance;
}

module.exports = connectToDatabase;
