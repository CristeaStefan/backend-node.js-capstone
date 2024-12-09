const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

// Search for gifts
router.get('/', async (req, res, next) => {
    try {
        // Task 1: Connect to MongoDB using connectToDatabase. Remember to use the await keyword and store the connection in `db`
        const db = await connectToDatabase();

        const collection = db.collection("gifts");

        // Initialize the query object
        let query = {};

        // Task 2: Add the name filter to the query if the name parameter exists and is not empty
        if (req.query.name && req.query.name.trim() !== '') {
            query.name = { $regex: req.query.name, $options: "i" }; // Using regex for partial match, case-insensitive
        }

        // Task 3: Add other filters to the query
        if (req.query.category && req.query.category.trim() !== '') {
            query.category = req.query.category; // Match exact category
        }
        if (req.query.condition && req.query.condition.trim() !== '') {
            query.condition = req.query.condition; // Match exact condition
        }
        if (req.query.age_years) {
            query.age_years = { $lte: parseInt(req.query.age_years, 10) }; // Match items less than or equal to the specified age
        }

        // Task 4: Fetch filtered gifts using the find(query) method
        const gifts = await collection.find(query).toArray();

        // Send the filtered results back as JSON
        res.json(gifts);
    } catch (e) {
        next(e); // Pass errors to the error handling middleware
    }
});

module.exports = router;
