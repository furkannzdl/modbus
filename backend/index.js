const express = require('express');
const app = express();
//const modbusController = require('./Controller/modbusController');

//const modbusService = require('./Service/modbusRTUservice');
const cors = require('cors');
const exportRoutes = require('./Controller/exportController'); // veya export.js
const ModbusTCP = require('./Protocol/modbusTCP');

/*
app.use(cors({
  origin: 'http://localhost:3001', 
  credentials: true
}));
*/

const modbus = new ModbusTCP();
setTimeout(() => {
  modbus.readCustomPacket();
}, 1000);
/*

setInterval(async () => {
  try {
    const result = await modbusService.readMeasurement();
    console.log("Measurement stored at", new Date().toISOString());
  } catch (err) {
    console.error("❌ Error while polling Modbus:", err);
  }
}, 10000); // 10,000 ms = 10 seconds

app.use('/api', modbusController);
app.use('/download', exportRoutes);

*/
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


