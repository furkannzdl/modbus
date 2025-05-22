const net = require('net');

class ModbusTCP {
  constructor(host = '169.254.167.30', port = 5000) {
    this.host = host;
    this.port = port;
    this.transactionId = 0;

    this.client = new net.Socket();

    this.client.connect(this.port, this.host, () => {
      console.log(`🟢 Connected to ${host}:${port}`);
    });

    this.client.on('data', (data) => {
      console.log('📥 Received:', data.toString('hex').toUpperCase());
      // Parse response as needed
    });

    this.client.on('error', (err) => {
      console.error('🔴 TCP Error:', err.message);
    });

    this.client.on('close', () => {
      console.log('🔌 Connection closed');
    });
  }

  buildRequestPDU(slaveId, functionCode, startAddr, quantity) {
    const pdu = Buffer.alloc(6);
    pdu[0] = slaveId;
    pdu[1] = functionCode;
    pdu.writeUInt16
  }
}