const { SerialPort } = require('serialport');

class Modbus {
  constructor(portName = 'COM3', baudRate = 9600) {
    this.buffer = Buffer.alloc(0);

    this.port = new SerialPort({
      path: portName,
      baudRate: baudRate,
      dataBits: 8,
      stopBits: 1,
      parity: 'none',
    });

    this.port.on('open', () => {
      console.log(`\u{1F7E2} Port ${portName} opened at ${baudRate} baud.`);
    });

    this.port.on('error', (err) => {
      console.error('\u{1F534} Serial Port Error:', err.message);
    });

    this.port.on('data', (data) => {
      this.buffer = Buffer.concat([this.buffer, data]);

      if (this.buffer.length >= 5) {
        const byteCount = this.buffer[2];
        const totalLength = 3 + byteCount + 2;

        if (this.buffer.length >= totalLength) {
      
          this.buffer = Buffer.alloc(0);
        }
      }
    });
  }

  static calculateCRC(buffer) {
    let crc = 0xFFFF;

    for (let pos = 0; pos < buffer.length; pos++) {
      crc ^= buffer[pos];

      for (let i = 0; i < 8; i++) {
        if ((crc & 0x0001) !== 0) {
          crc >>= 1;
          crc ^= 0xA001;
        } else {
          crc >>= 1;
        }
      }
    }

    return Buffer.from([crc & 0xFF, (crc >> 8) & 0xFF]);
  }

  readHoldingRegisters(slaveId = 0x01, address = 0x03E8, quantity = 6) {
    const request = Buffer.alloc(6);
    request[0] = slaveId;
    request[1] = 0x03;
    request.writeUInt16BE(address, 2);
    request.writeUInt16BE(quantity, 4);

    const crc = Modbus.calculateCRC(request);
    const message = Buffer.concat([request, crc]);

    console.log('\u{1F4E4} Sending:', message.toString('hex').toUpperCase());
    this.port.write(message);
  }


}

module.exports = Modbus;