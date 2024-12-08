require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

// MongoDB connection URL with authentication options
let url = `${process.env.MONGO_URL}`;

let dbInstance = null;
const dbName = `${process.env.MONGO_DB}`;

async function connectToDatabase() {
    if (dbInstance) {
        // Return the existing database instance if already connected
        return dbInstance;
    }

    try {
        // Task 1: Connect to MongoDB
        const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log("Connected successfully to MongoDB");

        // Task 2: Connect to the secondChance database and store in dbInstance
        dbInstance = client.db(dbName);

        // Task 3: Return the database instance
        return dbInstance;
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        throw err;
    }
}

module.exports = connectToDatabase;
