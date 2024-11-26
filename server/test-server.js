const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Test endpoint
app.put('/update/:id', (req, res) => {
    console.log('Update endpoint hit');
    console.log('ID:', req.params.id);
    console.log('Body:', req.body);
    res.json({
        success: true,
        message: 'Update endpoint working',
        id: req.params.id,
        receivedData: req.body
    });
});

// Start server
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Test server running on http://localhost:${PORT}`);
});
