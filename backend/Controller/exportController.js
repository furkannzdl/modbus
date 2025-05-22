const express = require('express');
const router = express.Router();
const { fetchMeasurementsAsCSV } = require('../Service/influxService');
const { Parser } = require('json2csv');

// CSV export endpoint
router.get('/export-csv', async (req, res) => {
  const { start, stop, type } = req.query;

  if (!start || !stop || !type) {
    return res.status(400).send("Missing start/stop/type query parameters");
  }

  try {
    const data = await fetchMeasurementsAsCSV({ start, stop, type });

    const fields = ['_time', 'type', '_value', 'unit'];
    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment(`${type.replace(/\s+/g, '_')}_data.csv`);
    res.send(csv);
  } catch (err) {
    console.error("CSV export error:", err);
    res.status(500).send("Failed to export CSV: " + err.message);
  }
});

module.exports = router;

