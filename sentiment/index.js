require('dotenv').config();
const express = require('express');
const axios = require('axios');
const logger = require('./logger');
const expressPino = require('express-pino-logger')({ logger });
const natural = require('natural'); // Task 1: Import the Natural library

const app = express(); // Task 2: Initialize the Express server
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(expressPino);

// Define the sentiment analysis route
app.post('/sentiment', async (req, res) => {
    // Extract the sentence parameter from the query string instead of the body
    const { sentence } = req.query; // Adjusted to retrieve from query string

    if (!sentence) {
        logger.error('No sentence provided');
        return res.status(400).json({ error: 'No sentence provided' });
    }

    // Initialize the sentiment analyzer with Natural's PorterStemmer and "English" language
    const Analyzer = natural.SentimentAnalyzer;
    const stemmer = natural.PorterStemmer;
    const analyzer = new Analyzer("English", stemmer, "afinn");

    // Perform sentiment analysis
    try {
        const analysisResult = analyzer.getSentiment(sentence.split(' '));

        let sentiment = "neutral";

        // Assign sentiment based on the analysis score
        if (analysisResult < 0) {
            sentiment = "negative";
        } else if (analysisResult >= 0 && analysisResult <= 0.33) {
            sentiment = "neutral";
        } else {
            sentiment = "positive";
        }

        logger.info(`Sentiment analysis result: ${analysisResult}`);
        res.status(200).json({ sentimentScore: analysisResult, sentiment: sentiment });
    } catch (error) {
        logger.error(`Error performing sentiment analysis: ${error}`);
        res.status(500).json({ message: 'Error performing sentiment analysis' });
    }
});

app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});
