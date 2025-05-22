const net = require('net');

class ModbusTCP {
  constructor(host = '169.254.167.30', port = 5000) {
    this.host = host;
    this.port = port;

    this.client = new net.Socket();

    this.client.connect(this.port, this.host, () => {
      console.log(`🟢 Connected to ${host}:${port}`);
    });

    this.client.on('data', (data) => {
      console.log('📥 Received:', data.toString('hex').toUpperCase());
    });

    this.client.on('error', (err) => {
      console.error('🔴 TCP Error:', err.message);
    });

    this.client.on('close', () => {
      console.log('🔌 Connection closed');
    });
  }

  readCustomPacket() {
    const hexString = '010000000006010303E8000A'; // 12 bytes as hex string
    const buf = Buffer.from(hexString, 'hex');

    console.log('📤 Sending packet:', buf.toString('hex').toUpperCase());
    this.client.write(buf);
  }
}

module.exports = ModbusTCP;


// 01 00 00 00 00 06 01 03 03 E8 00 0A