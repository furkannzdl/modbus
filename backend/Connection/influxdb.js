const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const token = 'XN5e7WSxUYMFDkrp-PhbNxcgQVWMkWeuKXpF6SpbcPPGclpfhCIvJMN-2CO-xzIgx5lqdGGGhxEH2_LgMrc_6g==';
const org = 'provar';
const bucket = 'modbusDB';
const url = 'http://localhost:8086';

const influxDB = new InfluxDB({ url, token });
const writeApi = influxDB.getWriteApi(org, bucket);
writeApi.useDefaultTags({ host: 'modbus-client' });


function writeMeasurement(label, value, unit) {
  const point = new Point('measurement')
    .tag('type', label)
    .floatField('value', parseFloat(value)) 
    .stringField('unit', unit || '')
    .timestamp(new Date());

  writeApi.writePoint(point);
  console.log(`Influx written: ${label} = ${value} ${unit}`);


}


module.exports = { writeMeasurement };