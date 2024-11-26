const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Simple update route
router.put('/:id', async (req, res) => {
  console.log('Update route hit:', req.params.id);
  console.log('Update data:', req.body);
  
  try {
    const result = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!result) {
      console.log('Student not found');
      return res.status(404).json({ message: 'Student not found' });
    }
    
    console.log('Update successful:', result);
    res.json(result);
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Export router
module.exports = router;
