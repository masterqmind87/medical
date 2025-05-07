const express = require('express');
const XLSX = require('xlsx');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Load Excel
const workbook = XLSX.readFile('./Medical Outpatient & Dental 2025(1).xlsx');
const sheetName = workbook.SheetNames[0];
const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

// API endpoint
app.get('/search', (req, res) => {
  const empCode = req.query.empCode;
  if (!empCode) return res.status(400).json({ error: 'empCode is required' });

  const result = data.filter(row =>
    row['Emp Code'] && row['Emp Code'].toString().includes(empCode)
  );

  res.json(result);
});

// Serve React static files
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
