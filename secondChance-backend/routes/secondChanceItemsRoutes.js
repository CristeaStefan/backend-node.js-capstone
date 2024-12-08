const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const connectToDatabase = require('../models/db');
const logger = require('../logger');

// Define the upload directory path
const directoryPath = 'public/images';

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, directoryPath); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage: storage });


// Get all secondChanceItems
router.get('/', async (req, res, next) => {
    logger.info('/ called');
    try {
        const db = await connectToDatabase(); // Task 1
        const collection = db.collection("secondChanceItems"); // Task 2
        const secondChanceItems = await collection.find({}).toArray(); // Task 3
        res.json(secondChanceItems); // Task 4
    } catch (e) {
        logger.error('oops something went wrong', e);
        next(e);
    }
});

// Add a new item
router.post('/', upload.single('image'), async (req, res, next) => {
    try {
        const db = await connectToDatabase(); // Task 1
        const { id, name, category, condition, posted_by, zipcode, description } = req.body; // Task 2
        const newItem = { // Task 3
            id,
            name,
            category,
            condition,
            posted_by,
            zipcode,
            description,
            image: `/images/${req.file.originalname}`,
        };
        const collection = db.collection("secondChanceItems"); // Task 4
        const result = await collection.insertOne(newItem);
        res.status(201).json(result.ops[0]); // Task 5
    } catch (e) {
        next(e);
    }
});

// Get a single secondChanceItem by ID
router.get('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase(); // Task 1
        const { id } = req.params; // Task 2
        const collection = db.collection("secondChanceItems");
        const item = await collection.findOne({ id }); // Task 3
        if (item) { // Task 4
            res.json(item);
        } else {
            res.status(404).json({ message: "Item not found" });
        }
    } catch (e) {
        next(e);
    }
});

// Update an existing item
router.put('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase(); // Task 1
        const { id } = req.params; // Task 2
        const updatedItem = req.body; // Task 3
        const collection = db.collection("secondChanceItems");
        const result = await collection.updateOne(
            { id },
            { $set: updatedItem }
        ); // Task 4
        if (result.matchedCount > 0) { // Task 5
            res.json({ message: "Item updated successfully" });
        } else {
            res.status(404).json({ message: "Item not found" });
        }
    } catch (e) {
        next(e);
    }
});

// Delete an existing item
router.delete('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase(); // Task 1
        const { id } = req.params; // Task 2
        const collection = db.collection("secondChanceItems");
        const result = await collection.deleteOne({ id }); // Task 3
        if (result.deletedCount > 0) { // Task 4
            res.json({ message: "Item deleted successfully" });
        } else {
            res.status(404).json({ message: "Item not found" });
        }
    } catch (e) {
        next(e);
    }
});

module.exports = router;
