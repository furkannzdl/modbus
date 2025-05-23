const net = require('net');

class ModbusTCP {
  constructor(host = '169.254.167.30', port = 5000) {
    this.host = host;
    this.port = port;
    this.client = new net.Socket();
    this.responseResolver = null;

    this.client.connect(this.port, this.host, () => {
      console.log(`🟢 Connected to ${host}:${port}`);
    });

    this.client.on('data', (data) => {
      const hex = data.toString('hex').toUpperCase();
      console.log('📥 Received:', hex);

      if (this.responseResolver) {
        this.responseResolver(hex);
        this.responseResolver = null;
      }
    });

    this.client.on('error', (err) => {
      console.error('🔴 TCP Error:', err.message);
    });

    this.client.on('close', () => {
      console.log('🔌 Connection closed');
    });
  }

sendReadRequest(transactionId, protocolId, unitId, functionCode, startAddress, quantity) {
  return new Promise((resolve, reject) => {
    const buffer = Buffer.alloc(12);
    buffer.writeUInt16BE(transactionId, 0);
    buffer.writeUInt16BE(protocolId, 2);
    buffer.writeUInt16BE(6, 4);
    buffer.writeUInt8(unitId, 6);
    buffer.writeUInt8(functionCode, 7);
    buffer.writeUInt16BE(startAddress, 8);
    buffer.writeUInt16BE(quantity, 10);

    console.log('📤 Sending packet:', buffer.toString('hex').toUpperCase());

    let responseChunks = [];
    let totalExpectedLength = null;

    const onData = (chunk) => {
      responseChunks.push(chunk);

      const combined = Buffer.concat(responseChunks);

      if (combined.length >= 6 && totalExpectedLength === null) {
        // Extract length field from MBAP header
        const lengthFromHeader = combined.readUInt16BE(4);
        totalExpectedLength = lengthFromHeader + 6; // MBAP (7 byte) - Transaction(2), Protocol(2), Length(2), UnitId(1)
      }

      if (totalExpectedLength !== null && combined.length >= totalExpectedLength) {
        this.client.removeListener('data', onData);
        const hexResponse = combined.toString('hex').toUpperCase();
        console.log('📥 Full Response:', hexResponse);
        resolve(hexResponse);
      }
    };

    this.client.on('data', onData);
    this.client.write(buffer);

    setTimeout(() => {
      this.client.removeListener('data', onData);
      reject(new Error('⏱ Timeout: Incomplete Modbus response'));
    }, 3000);
  });
}

}

module.exports = ModbusTCP;
