const { InfluxDB } = require('@influxdata/influxdb-client');

const token = 'XN5e7WSxUYMFDkrp-PhbNxcgQVWMkWeuKXpF6SpbcPPGclpfhCIvJMN-2CO-xzIgx5lqdGGGhxEH2_LgMrc_6g=='; 
const org = 'provar';
const bucket = 'modbusDB';
const url = 'http://localhost:8086';

const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);

async function fetchMeasurementsAsCSV({ start, stop, type }) {
  const flux = `
    from(bucket: "${bucket}")
      |> range(start: ${start}, stop: ${stop})
      |> filter(fn: (r) =>
        r._measurement == "measurement" and
        r._field == "value" and
        r.type == "${type}"
      )
      |> sort(columns: ["_time"])
  `;

  const rows = [];
  return new Promise((resolve, reject) => {
    queryApi.queryRows(flux, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        rows.push(o);
      },
      error(err) {
        reject(err);
      },
      complete() {
        resolve(rows);
      }
    });
  });
}

module.exports = { fetchMeasurementsAsCSV };
