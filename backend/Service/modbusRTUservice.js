const Modbus = require('../Protocol/modbusRTU');
const { writeMeasurement } = require('../Connection/influxdb');


class ModbusService {
  constructor() {
    this.modbus = new Modbus('COM3');
  }
// 01 03 03 E8 00 32 44 6F
readMeasurement() {
  return new Promise((resolve, reject) => {
    const expectedLength = 3 + (50 * 2) + 2; // 3 header + 100 data + 2 CRC
    let buffer = Buffer.alloc(0);

    const registerMeta = [
      { address: 1000, name: "MB_ADD_R_VTR", label: "Voltage Transformer Ratio", unit: "", scale: 0.1, description: "1.0–4000.0" },
      { address: 1001, name: "MB_ADD_R_CTR", label: "Current Transformer Ratio", unit: "", scale: 0.1, description: "1–2000" },
      { address: 1002, name: "MB_ADD_R_VL1", label: "L1 Phase Voltage", unit: "V", scale: 0.01, description: "Voltage of phase L1" },
      { address: 1003, name: "MB_ADD_R_VL2", label: "L2 Phase Voltage", unit: "V", scale: 0.01, description: "Voltage of phase L2" },
      { address: 1004, name: "MB_ADD_R_VL3", label: "L3 Phase Voltage", unit: "V", scale: 0.01, description: "Voltage of phase L3" },
      
      { address: 1005, name: "MB_ADD_R_VL12", label: "L12 Faz Gerilimi", unit: "V", scale: 0.01, description: "-" },
      { address: 1006, name: "MB_ADD_R_VL23", label: "L23 Faz Gerilimi", unit: "V", scale: 0.01, description: "-" },
      { address: 1007, name: "MB_ADD_R_VL31", label: "L31 Faz Gerilimi", unit: "V", scale: 0.01, description: "-" },

      { address: 1008, name: "MB_ADD_R_IL1", label: "I1 Faz Akımı", unit: "mA", scale: 0.1, description: "-" },
      { address: 1009, name: "MB_ADD_R_IL2", label: "I2 Faz Akımı", unit: "mA", scale: 0.1, description: "-" },
      { address: 1008, name: "MB_ADD_R_IL3", label: "I1 Faz Akımı", unit: "mA", scale: 0.1, description: "-" },
      { address: 1009, name: "MB_ADD_R_ILN", label: "Nötür Akımı", unit: "mA", scale: 0.1, description: "-" }
      
      
    ];

    const onData = (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);

      if (buffer.length >= expectedLength) {
        this.modbus.port.removeListener('data', onData);

        const values = [];

        for (let i = 0; i < registerMeta.length; i++) {
          const hi = buffer[3 + i * 2];
          const lo = buffer[4 + i * 2];
          const raw = (hi << 8) | lo;

          const meta = registerMeta[i];
          const scaled = raw * meta.scale;
          values.push({
            address: meta.address,
            name: meta.name,
            label: meta.label,
            raw,
            value: (raw * meta.scale).toFixed(2),
            unit: meta.unit,
            description: meta.description
          });
          writeMeasurement(meta.label, scaled, meta.unit);
        }

        
       


        resolve(values); // send structured response
      }
    };

    this.modbus.port.on('data', onData);
    this.modbus.readHoldingRegisters(0x01, 0x03E8, 50); // read 1000–1049
  });
}


/*
// 01 03 03 E8 00 32 44 6F
readMeasurement() {
  return new Promise((resolve, reject) => {
    const expectedLength = 3 + (50 * 2) + 2; // 3-byte header + 100 data + 2 CRC
    let buffer = Buffer.alloc(0);

    const onData = (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);

      console.log('📥 Received chunk:', chunk.toString('hex').toUpperCase());
      console.log(`📦 Current buffer length: ${buffer.length} / ${expectedLength}`);

      if (buffer.length >= expectedLength) {
        this.modbus.port.removeListener('data', onData);
        console.log('✅ Full response received');
        resolve(buffer);
      }
    };

    this.modbus.port.on('data', onData);

    // fire the request
    this.modbus.readHoldingRegisters(0x01, 0x03E8, 50);
  });
}
*/


  readVTR() {
    return new Promise((resolve, reject) => {
      this.modbus.readHoldingRegisters(0x01, 0x03E8, 1); // VTR @ address 1000
      this.modbus.port.once('data', (data) => {
        if (data.length >= 5 && data[1] === 0x03) {
          const raw = (data[3] << 8) | data[4];
          const dec = hexToDecimalByDigits(raw);
          const scaled = dec * 0.1;
          console.log("CTR");
 
          resolve(scaled);
        } else {
          reject('Invalid response');
        }
      });
    });
  }

readCTR() {
    return new Promise((resolve, reject) => {
      this.modbus.readHoldingRegisters(0x01, 0x03E9, 1); // CTR @ address 1001
      this.modbus.port.once('data', (data) => {
        if (data.length >= 5 && data[1] === 0x03) {
          const raw = (data[3] << 8) | data[4];
          const dec = hexToDecimalByDigits(raw);
          const scaled = dec * 0.1;
          console.log("CTR");

          resolve(scaled);
        } else {
          reject('Invalid response');
        }
      });
    });
  }

  readLangauage() {
    return new Promise((resolve, reject) => {
      this.modbus.readHoldingRegisters(0x01, 0x1770, 1); // Langauge 0 -> Turkish, 1-> English
      this.modbus.port.once('data', (data) => {
        if (data.length >= 5 && data[1] === 0x03) {
          const raw = (data[3] << 8) | data[4];
          if (raw == 0){
            resolve("Türkçe");
          }
          if (raw == 1){
            resolve("English");
          }
          else{
            reject('Invalid parameter for language');
          }
          
          
          console.log("Langauge");

          
        } else {
          reject('Invalid response');
        }
      });
    });
  }

  readLightStatus() {
    return new Promise((resolve, reject) => {
      this.modbus.readHoldingRegisters(0x01, 0x1770, 1); // Light_status 0 -> kapalı, 1-> Açık, 2-> Otomatik
      this.modbus.port.once('data', (data) => {
        if (data.length >= 5 && data[1] === 0x03) {
          const raw = (data[3] << 8) | data[4];
          if (raw == 0){
            resolve("Kapalı");
          }
          else if (raw == 1){
            resolve("Açık");
          }
          else if (raw == 2){
            resolve("Otomatik");
          }
          else{
            reject('Invalid parameter for light status');
          }
          
          
          console.log("light status");

          
        } else {
          reject('Invalid response');
        }
      });
    });
  }

  
}

function hexToDecimalByDigits(raw) {
  const hexString = raw.toString();

  let decimal = 0;


  for (let i = 0; i < hexString.length; i++) {
    const digit = hexString[hexString.length - 1 -i] * Math.pow(16, i);
    decimal += digit;

  }


  return decimal;
}

function applyLabelsAndScaling(rawValues) {
  const labels = [ /* yukarıdaki JSON dizisi */ ];
  return rawValues.slice(0, 5).map((val, i) => {
    const label = labels[i];
    return {
      ...label,
      raw: val,
      value: (val * label.scale).toFixed(2)
    };
  });
}


module.exports = new ModbusService();
