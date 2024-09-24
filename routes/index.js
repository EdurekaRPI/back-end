const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// MongoDB's connection string (local or Atlas)
const mongoURI = 'mongodb://localhost:27017/myapp';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Define a schema and model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});
const User = mongoose.model('User', userSchema);

// Define route to add a user
app.post('/users', async (req, res) => {
  const { name, email, age } = req.body;

  try {
    const newUser = new User({ name, email, age });
    await newUser.save();
    res.status(201).send('User created');
  } catch (error) {
    res.status(500).send('Error creating user');
  }
});

// Start the server
app.listen(port, () => {
  console.log('Server is running on http://localhost:${port}');
});