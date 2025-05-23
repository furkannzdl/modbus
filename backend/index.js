const express = require('express');
const app = express();
const ModbusTcpRouter = require('./Routers/ModbusTcpRouter');
const cors = require('cors');
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3001', 
  credentials: true
}));

// Router 
app.use('/modbus', ModbusTcpRouter);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
