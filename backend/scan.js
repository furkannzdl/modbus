const { SerialPort } = require('serialport');
const crc = require('crc');

const port = new SerialPort({ path: "COM3", baudRate: 9600 });
let address = 6000;

function buildRequest(addr) {
  const buf = Buffer.alloc(6);
  buf.writeUInt8(0x01, 0);
  buf.writeUInt8(0x03, 1);
  buf.writeUInt16BE(addr, 2);
  buf.writeUInt16BE(2, 4);

  const crcVal = crc.crc16modbus(buf);
  const full = Buffer.concat([buf, Buffer.alloc(2)]);
  full.writeUInt16LE(crcVal, 6);
  return full;
}

port.on('open', () => {
  console.log("✅ Seri port açıldı. Parametre taraması başlıyor...\n");
  sendNext();
});

function sendNext() {
  if (address > 6020) return port.close(() => console.log("✅ Tarama tamamlandı."));

  port.flush(() => {
    const req = buildRequest(address);
    port.write(req);
  });
}

port.on('data', (data) => {
  const hex = data.toString('hex');

  if (data.length >= 7 && data[1] === 0x03 && data[2] === 4) {
    const float = Buffer.from(data.slice(3, 7)).readFloatBE();
    console.log(`⚙️  Parametre [${address}]: ${float}`);
  } else if (data[1] === 0x83) {
    console.log(`❌ Parametre [${address}]: Modbus Hata ${data[2]}`);
  } else {
    console.log(`⚠️  Parametre [${address}]: Tanınmayan veri → ${hex}`);
  }

  address += 2;
  setTimeout(sendNext, 1000);
});
