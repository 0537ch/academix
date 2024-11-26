const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Basic middleware
app.use(express.json());

// Simple schema
const Student = mongoose.model('Student', {
  name: String,
  email: String
});

// Routes
app.post('/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/test_db')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(5002, () => {
      console.log('Server running on port 5002');
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
