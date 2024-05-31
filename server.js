const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATABASE_FILE = path.join(__dirname, 'consultations.json');

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors()); // Enable CORS for all routes



// Function to read the JSON file
const readDatabase = () => {
    try {
        const data = fs.readFileSync(DATABASE_FILE);
        console.log('Data read from database:', data); // Add this line to log the data
        return JSON.parse(data);
    } catch (error) {
        // If file does not exist or is empty, return an empty array
        return [];
    }
};

// Function to write to the JSON file
const writeDatabase = (data) => {
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(data, null, 2));
};

// Endpoint to save a consultation
app.post('/save', (req, res) => {
    const consultation = req.body;
    const data = readDatabase();
    data.push(consultation);
    writeDatabase(data);
    res.status(200).json({ message: 'Consulta guardada con éxito' });
});

// Endpoint to search consultations by name
app.get('/search', (req, res) => {
    const keyword = req.query.keyword.toLowerCase();
    const data = readDatabase();
    // If keyword is empty, return all consultations
    const results = keyword ? data.filter(consulta => consulta.moneda.toLowerCase().includes(keyword)) : data;
    res.status(200).json(results);
});

// Add error handling middleware
app.use((req, res, next) => {
    res.status(404).send("Sorry, the requested resource was not found.");
});

// Error handling middleware for other errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});