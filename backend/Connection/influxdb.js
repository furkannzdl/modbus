const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const token = 'XN5e7WSxUYMFDkrp-PhbNxcgQVWMkWeuKXpF6SpbcPPGclpfhCIvJMN-2CO-xzIgx5lqdGGGhxEH2_LgMrc_6g==';
const org = 'provar';
const bucket = 'modbusDB';
const url = 'http://localhost:8086';

const influxDB = new InfluxDB({ url, token });
const writeApi = influxDB.getWriteApi(org, bucket);
writeApi.useDefaultTags({ host: 'modbus-client' });

const storeModbusRegisters = async (deviceId, parsedRegisters) => {
  try {
    parsedRegisters.forEach(reg => {
      const point = new Point('modbus_register')
        .tag('device_id', deviceId)
        .tag('name', reg.name)
        .tag('unit', reg.unit)
        .floatField('value', reg.value)
        .intField('address', reg.address); 

      writeApi.writePoint(point);
    });

    await writeApi.flush();
    console.log(`✅ InfluxDB: ${parsedRegisters.length} register stored for device ${deviceId}`);
  } catch (err) {
    console.error('❌ Influx write error:', err);
  }
};

module.exports = { storeModbusRegisters };
