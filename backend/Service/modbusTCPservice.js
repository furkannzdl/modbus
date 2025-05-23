const ModbusTCP = require('../Protocol/modbusTCP');
const { storeModbusRegisters } = require('../Connection/influxdb');
const modbusInstance = new ModbusTCP('169.254.167.30', 5000);

const registerMeta = [
    { address: 1000, name: "MB_ADD_R_VTR", label: "Voltage Transformer Ratio", unit: "", scale: 0.1 },
    { address: 1001, name: "MB_ADD_R_CTR", label: "Current Transformer Ratio", unit: "", scale: 0.1 },
    { address: 1002, name: "MB_ADD_R_VL1", label: "L1 Phase Voltage", unit: "V", scale: 0.01 },
    { address: 1003, name: "MB_ADD_R_VL2", label: "L2 Phase Voltage", unit: "V", scale: 0.01 },
    { address: 1004, name: "MB_ADD_R_VL3", label: "L3 Phase Voltage", unit: "V", scale: 0.01 },
    { address: 1005, name: "MB_ADD_R_VL12", label: "L12 Line Voltage", unit: "V", scale: 0.01 },
    { address: 1006, name: "MB_ADD_R_VL23", label: "L23 Line Voltage", unit: "V", scale: 0.01 },
    { address: 1007, name: "MB_ADD_R_VL31", label: "L31 Line Voltage", unit: "V", scale: 0.01 },
    { address: 1008, name: "MB_ADD_R_IL1", label: "I1 Phase Current", unit: "mA", scale: 0.1 },
    { address: 1009, name: "MB_ADD_R_IL2", label: "I2 Phase Current", unit: "mA", scale: 0.1 },
    { address: 1010, name: "MB_ADD_R_IL3", label: "I3 Phase Current", unit: "mA", scale: 0.1 },
    { address: 1011, name: "MB_ADD_R_ILN", label: "Neutral Current", unit: "mA", scale: 0.1 },
    { address: 1012, name: "MB_ADD_R_FREQ", label: "Frequency", unit: "Hz", scale: 0.01 },
    { address: 1013, name: "MB_ADD_R_Pmean1", label: "L1-N Active Power", unit: "W", scale: 0.1 },
    { address: 1014, name: "MB_ADD_R_Pmean2", label: "L2-N Active Power", unit: "W", scale: 0.1 },
    { address: 1015, name: "MB_ADD_R_Pmean3", label: "L3-N Active Power", unit: "W", scale: 0.1 },
    { address: 1016, name: "MB_ADD_R_PTotalImport", label: "Total Import Power", unit: "W", scale: 0.1 },
    { address: 1017, name: "MB_ADD_R_PTotalExport", label: "Total Export Power", unit: "W", scale: 0.1 },
    { address: 1018, name: "MB_ADD_R_Qmean1", label: "L1 Reactive Power", unit: "VAr", scale: 0.1 },
    { address: 1019, name: "MB_ADD_R_Qmean2", label: "L2 Reactive Power", unit: "VAr", scale: 0.1 },
    { address: 1020, name: "MB_ADD_R_Qmean3", label: "L3 Reactive Power", unit: "VAr", scale: 0.1 },
    { address: 1021, name: "MB_ADD_R_Quad1_T", label: "Quadrant 1 Total Reactive", unit: "VAr", scale: 0.1 },
    { address: 1022, name: "MB_ADD_R_Quad2_T", label: "Quadrant 2 Total Reactive", unit: "VAr", scale: 0.1 },
    { address: 1023, name: "MB_ADD_R_Quad3_T", label: "Quadrant 3 Total Reactive", unit: "VAr", scale: 0.1 },
    { address: 1024, name: "MB_ADD_R_Quad4_T", label: "Quadrant 4 Total Reactive", unit: "VAr", scale: 0.1 },
    { address: 1025, name: "MB_ADD_R_QTotal", label: "Total Reactive Power", unit: "VAr", scale: 0.1 },
    { address: 1026, name: "MB_ADD_R_Smean1", label: "L1 Apparent Power", unit: "VA", scale: 0.1 },
    { address: 1027, name: "MB_ADD_R_Smean2", label: "L2 Apparent Power", unit: "VA", scale: 0.1 },
    { address: 1028, name: "MB_ADD_R_Smean3", label: "L3 Apparent Power", unit: "VA", scale: 0.1 },
    { address: 1029, name: "MB_ADD_R_STotalImport", label: "Total Import Apparent Power", unit: "VA", scale: 0.1 },
    { address: 1030, name: "MB_ADD_R_STotalExport", label: "Total Export Apparent Power", unit: "VA", scale: 0.1 },
    { address: 1031, name: "MB_ADD_R_PFmean1", label: "L1 Power Factor", unit: "", scale: 0.001 },
    { address: 1032, name: "MB_ADD_R_PFmean2", label: "L2 Power Factor", unit: "", scale: 0.001 },
    { address: 1033, name: "MB_ADD_R_PFmean3", label: "L3 Power Factor", unit: "", scale: 0.001 },
    { address: 1034, name: "MB_ADD_R_PFmeanT", label: "Total Power Factor", unit: "", scale: 0.001 },
    { address: 1035, name: "MB_ADD_R_CosFi_1", label: "CosFi L1", unit: "", scale: 0.0001 },
    { address: 1036, name: "MB_ADD_R_CosFi_2", label: "CosFi L2", unit: "", scale: 0.0001 },
    { address: 1037, name: "MB_ADD_R_CosFi_3", label: "CosFi L3", unit: "", scale: 0.0001 },
    { address: 1038, name: "MB_ADD_R_CosFi_T", label: "CosFi Total", unit: "", scale: 0.0001 },
    { address: 1039, name: "MB_ADD_R_VOLT_UNBALANCE", label: "Voltage Unbalance", unit: "%", scale: 0.01 },
    { address: 1040, name: "MB_ADD_R_CURR_UNBALANCE", label: "Current Unbalance", unit: "%", scale: 0.01 },
    { address: 1041, name: "MB_ADD_R_PAngle1", label: "Phase Angle L1-I1", unit: "°", scale: 0.1 },
    { address: 1042, name: "MB_ADD_R_PAngle2", label: "Phase Angle L2-I2", unit: "°", scale: 0.1 },
    { address: 1043, name: "MB_ADD_R_PAngle3", label: "Phase Angle L3-I3", unit: "°", scale: 0.1 },
    { address: 1044, name: "MB_ADD_R_Uangle1", label: "Voltage Angle L1-L2", unit: "°", scale: 0.1 },
    { address: 1045, name: "MB_ADD_R_Uangle2", label: "Voltage Angle L2-L3", unit: "°", scale: 0.1 },
    { address: 1046, name: "MB_ADD_R_Uangle3", label: "Voltage Angle L3-L1", unit: "°", scale: 0.1 },
    { address: 1047, name: "MB_ADD_R_WORK_HOUR", label: "Work Time Since Power On", unit: "min", scale: 1 },
    { address: 1048, name: "MB_ADD_R_UNUSED", label: "Unused", unit: "", scale: 1 },
    { address: 1049, name: "MB_ADD_R_WORK_HOUR_SUM", label: "Total Work Time", unit: "min", scale: 1 },
];

const settings = [
    {
        name: "MB_ADD_RW_LANGUAGE_SELECTION",
        address: 6000,
        hex: "0x1770",
        dataType: "uint16",
        access: "RD/WR",
        multiplier: 1,
        description: "Cihaz dil seçimi: 0→Türkçe, 1→İngilizce"
    },
    {
        name: "MB_ADD_RW_BACK_LIGHT_STATUS",
        address: 6001,
        hex: "0x1771",
        dataType: "uint16",
        access: "RD/WR",
        multiplier: 1,
        description: "Arka Aydınlatma Modu: 0→Kapalı, 1→Açık, 2→Otomatik"
    },
    {
        name: "MB_ADD_RW_VTR",
        address: 6002,
        hex: "0x1772",
        dataType: "uint16",
        access: "RD/WR",
        multiplier: 0.1,
        description: "Gerilim Trafo Oranı (1.0–4000.0)"
    },
    {
        name: "MB_ADD_RW_CTR",
        address: 6003,
        hex: "0x1773",
        dataType: "uint16",
        access: "RD/WR",
        multiplier: 1,
        description: "Akım Trafo Oranı (1–2000)"
    },
    {
        name: "MB_ADD_RW_SAG_LIMIT",
        address: 6004,
        hex: "0x1774",
        dataType: "uint16",
        access: "RD/WR",
        multiplier: 0.1,
        description: "Gerilim Düşme Limiti (%) (70.0–98.0)"
    },
    {
        name: "MB_ADD_RW_SAG_HYST",
        address: 6005,
        hex: "0x1775",
        dataType: "uint16",
        access: "RD/WR",
        multiplier: 0.1,
        description: "Gerilim Düşme Histerisiz (%) (0.5–5.0)"
    },
    {
        name: "MB_ADD_RW_SWELL_LIMIT",
        address: 6006,
        hex: "0x1776",
        dataType: "uint16",
        access: "RD/WR",
        multiplier: 0.1,
        description: "Gerilim Yükselme Limiti (%) (102.0–130.0)"
    },
    {
        name: "MB_ADD_RW_SWELL_HYST",
        address: 6007,
        hex: "0x1777",
        dataType: "uint16",
        access: "RD/WR",
        multiplier: 0.1,
        description: "Gerilim Yükselme Histerisiz (%) (0.5–5.0)"
    },
    {
        name: "MB_ADD_RW_DEMAND_TIME",
        address: 6008,
        hex: "0x1778",
        dataType: "uint16",
        access: "RD/WR",
        multiplier: 1,
        description: "Demand Süresi: 1–60 dk arası"
    },
    {
        name: "MB_ADD_RW_SYSTEM_FREQ",
        address: 6009,
        hex: "0x1779",
        dataType: "uint16",
        access: "RD/WR",
        multiplier: 1,
        description: "Şebeke Frekansı: 50Hz veya 60Hz"
    },
    {
        name: "MB_ADD_RW_SYSTEM_VOLT",
        address: 6010,
        hex: "0x177A",
        dataType: "uint16",
        access: "RD/WR",
        multiplier: 0.1,
        description: "Şebeke Gerilimi: 50.0V–300.0V"
    },
    {
        name: "MB_ADD_RW_CONNECTION_TYPE",
        address: 6011,
        hex: "0x177B",
        dataType: "uint16",
        access: "RD/WR",
        multiplier: 1,
        description: "Bağlantı Tipi: 0→3P4W, 1→3P3W"
    },
    {
        name: "MB_ADD_RW_RS485_ID",
        address: 6012,
        hex: "0x177C",
        dataType: "uint16",
        access: "RD/WR",
        multiplier: 1,
        description: "Modbus ID: 1–247"
    },
    {
        name: "MB_ADD_RW_RS485_BAUD",
        address: 6013,
        hex: "0x177D",
        dataType: "uint16",
        access: "RD/WR",
        multiplier: 1,
        description: "Modbus Baudrate: 0→1200, 1→2400, ..., 5→19200"
    },
    {
        name: "MB_ADD_RW_RS485_STOP_BIT",
        address: 6014,
        hex: "0x177E",
        dataType: "uint16",
        access: "RD/WR",
        multiplier: 1,
        description: "Stop Biti: 0→1, 1→1.5, 2→2"
    },
    {
        name: "MB_ADD_RW_RTC_TIME_STAMP",
        address: 6015,
        hex: "0x177F",
        dataType: "uint32",
        access: "RD/WR",
        multiplier: 1,
        description: "RTC zaman değeri (1900-01-01T00:00:00 bazlı)"
    },
    {
        name: "MB_ADD_RW_GMT_TIME_SELECTION",
        address: 6017,
        hex: "0x1781",
        dataType: "int16",
        access: "RD/WR",
        multiplier: 1,
        description: "Zaman Dilimi (GMT): -1200 → +1200 (örnek: 230 = +2:30)"
    },
    {
        name: "MB_ADD_RW_DST_STATUS",
        address: 6018,
        hex: "0x1782",
        dataType: "uint16",
        access: "RD/WR",
        multiplier: 1,
        description: "Yaz saati: 0→Pasif, 1→Aktif"
    },
    {
        name: "MB_ADD_RW_DST_START_MONTH",
        address: 6019,
        hex: "0x1783",
        dataType: "uint16",
        access: "RD/WR",
        multiplier: 1,
        description: "Yaz Saati Başlangıç Ayı: 1–12"
    },
    {
        name: "MB_ADD_RW_DST_START_WEEK",
        address: 6020,
        hex: "0x1784",
        dataType: "uint16",
        access: "RD/WR",
        multiplier: 1,
        description: "Yaz Saati Başlangıç Haftası: 0–4"
    },
    {
        name: "MB_ADD_RW_DST_START_DAY",
        address: 6021,
        hex: "0x1785",
        dataType: "uint16",
        access: "RD/WR",
        multiplier: 1,
        description: "Yaz Saati Başlangıç Günü: 0→Pazar, ..., 6→Cumartesi"
    },
    {
        name: "MB_ADD_RW_DST_START_HOUR",
        address: 6022,
        hex: "0x1786",
        dataType: "uint16",
        access: "RD/WR",
        multiplier: 1,
        description: "Yaz Saati Başlangıç Saati: 0–23"
    },
    {
        name: "MB_ADD_RW_DST_END_MONTH",
        address: 6023,
        hex: "0x1787",
        dataType: "uint16",
        access: "RD/WR",
        multiplier: 1,
        description: "Yaz Saati Bitiş Ayı: 1–12"
    },
    {
        name: "MB_ADD_RW_DST_END_WEEK",
        address: 6024,
        hex: "0x1788",
        dataType: "uint16",
        access: "RD/WR",
        multiplier: 1,
        description: "Yaz Saati Bitiş Haftası: 0–4"
    },
    {
        name: "MB_ADD_RW_DST_END_DAY",
        address: 6025,
        hex: "0x1789",
        dataType: "uint16",
        access: "RD/WR",
        multiplier: 1,
        description: "Yaz Saati Bitiş Günü: 0→Pazar, ..., 6→Cumartesi"
    },
    {
        name: "MB_ADD_RW_DST_END_HOUR",
        address: 6026,
        hex: "0x178A",
        dataType: "uint16",
        access: "RD/WR",
        multiplier: 1,
        description: "Yaz Saati Bitiş Saati: 0–23"
    }
];




const readMesaurementDatas = async (startAddress, quantity) => {
    try {
        const hex = await modbusInstance.sendReadRequest(0x0001, 0x0000, 1, 3, startAddress, quantity);
        const buffer = Buffer.from(hex, 'hex');

        const byteCount = buffer[8];
        const dataStartIndex = 9;
        const values = [];

        for (let i = 0; i < byteCount; i += 2) {
            const word = buffer.readUInt16BE(dataStartIndex + i);
            values.push(word);
        }

        const parsed = registerMeta
            .filter(meta => meta.address >= startAddress && meta.address < startAddress + quantity)
            .map(meta => {
                const index = meta.address - startAddress;
                const rawValue = values[index] ?? null;
                const scaled = rawValue != null ? rawValue * meta.scale : null;
                return {
                    name: meta.name,
                    label: meta.label,
                    address: meta.address,
                    value: scaled,
                    unit: meta.unit,
                };
            });
        
        await storeModbusRegisters("1", parsed);
        return parsed;
    } catch (error) {
        throw new Error('Modbus read failed: ' + error.message);
    }
};;;

const readSettings = async (startAddress, quantity) => {
    try {
        const hex = await modbusInstance.sendReadRequest(
            0x0001, // Transaction ID
            0x0000, // Protocol ID
            1,      // Unit ID
            3,      // Function code: Read Holding Registers
            startAddress,
            quantity
        );

        const buffer = Buffer.from(hex, 'hex');
        const byteCount = buffer[8];
        const dataStartIndex = 9;
        const values = [];

        for (let i = 0; i < byteCount; i += 2) {
            if (dataStartIndex + i + 1 >= buffer.length) break;
            const word = buffer.readUInt16BE(dataStartIndex + i);
            values.push(word);
        }

        const parsed = settings
            .filter(meta => meta.address >= startAddress && meta.address < startAddress + quantity)
            .map(meta => {
                const index = meta.address - startAddress;
                const rawValue = values[index] ?? null;
                const scaled = rawValue != null ? rawValue * (meta.multiplier ?? 1) : null;

                return {
                    name: meta.name,
                    label: meta.label ?? meta.name,
                    address: meta.address,
                    value: scaled,
                    unit: meta.unit ?? '', // boş bırakılabilir
                };
            });
        await storeModbusRegisters("1", parsed);
        return parsed;
    } catch (error) {
        throw new Error('Modbus read failed: ' + error.message);
    }
};


module.exports = { readMesaurementDatas, readSettings };
