const express = require('express');
const router = express.Router();

const modbusTCPService = require('../Service/modbusTCPservice');



function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// Read from 1000 to 1050 for mesaurement datas
const readMesaurement = async (req, res) => {
  try {
    const start = parseInt(req.query.start) || 1000;
    const count = parseInt(req.query.count) || 50;

    const data = await modbusTCPService.readMesaurementDatas(start, count);

    res.json({ message: 'Success', data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Read from 6000 to 6054 for mesaurement datas
const readSettings = async (req, res) => {
  try {
    const start = parseInt(req.query.start) || 6000;
    const count = parseInt(req.query.count) || 26;

    const data = await modbusTCPService.readSettings(start, count);

    res.json({ message: 'Success', data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { readMesaurement, readSettings };







/*
router.get('/measurement', async (req, res) => {
  try {
    const measurements = await modbusTCPService.readMeasurement();

    res.json({
      category: "Measurement Data",
      count: measurements.length,
      data: measurements
    });

  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});



router.get('/language', async (req, res) => {
  try {
    const language = await modbusService.readLangauage();
    res.send(`<html><body><h1>Dil: ${language}</h1></body></html>`);
  } catch (err) {
    res.status(500).send(`<html><body><h1>Error: ${err}</h1></body></html>`);
  }
});

router.get('/light-status', async (req, res) => {
  try {
    const language = await modbusService.readLangauage();
    res.send(`<html><body><h1>Arka Aydınlatma ${language}</h1></body></html>`);
  } catch (err) {
    res.status(500).send(`<html><body><h1>Error: ${err}</h1></body></html>`);
  }
});

module.exports = router;

*/
