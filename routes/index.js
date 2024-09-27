const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// MongoDB connection URL
const dbURI = 'mongodb://localhost:27017/myDatabase'; // Use the local MongoDB URL

// Connect to MongoDB using Mongoose
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err);
    });

// Define a simple route to verify the app works
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
