const express = require('express');
const app = express();
const modbusController = require('./modbusController');
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3001', 
  credentials: true
}));

app.use('/api', modbusController);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


