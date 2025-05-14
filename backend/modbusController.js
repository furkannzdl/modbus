const express = require('express');
const router = express.Router();
const modbusService = require('./modbusService');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


router.get('/measurement', async (req, res) => {
  try {
    const measurements = await modbusService.readMeasurement();

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
