const express = require('express');
const router = express.Router();
const modbusController = require('../Controller/modbusController');

router.get('/read-mesaurement', modbusController.readMesaurement);

router.get('/read-settings', modbusController.readSettings);

module.exports = router;
