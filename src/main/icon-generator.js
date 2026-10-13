const zlib = require('zlib');

// CRC32 table for PNG chunk checksums
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crc = crc32(chunk.subarray(4, 8 + len));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

/**
 * Generate a crisp 32x32 RGBA PNG icon of a red tactical crosshair/target
 */
function generateCrosshairPng(size = 32) {
  const rowLen = 1 + size * 4; // 1 filter byte + RGBA pixels
  const rawData = Buffer.alloc(rowLen * size);

  const center = size / 2;
  const outerR = size * 0.44;
  const innerR = size * 0.22;
  const coreR = size * 0.1;

  for (let y = 0; y < size; y++) {
    const rowOffset = y * rowLen;
    rawData[rowOffset] = 0; // Filter byte: None

    for (let x = 0; x < size; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x + 0.5 - center;
      const dy = y + 0.5 - center;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let r = 0, g = 0, b = 0, a = 0;

      // Dark background circular badge
      if (dist <= outerR + 1) {
        r = 30; g = 30; b = 38; a = 230;
      }

      // Outer ring
      if (Math.abs(dist - outerR) < 1.2) {
        r = 255; g = 60; b = 60; a = 255;
      }
      // Inner ring
      else if (Math.abs(dist - innerR) < 1.0) {
        r = 255; g = 140; b = 50; a = 240;
      }
      // Center bullseye dot
      else if (dist <= coreR) {
        r = 255; g = 50; b = 50; a = 255;
      }
      // Crosshair horizontal line
      else if (Math.abs(dy) <= 0.8 && dist <= outerR + 2 && dist >= innerR - 2) {
        r = 255; g = 60; b = 60; a = 255;
      }
      // Crosshair vertical line
      else if (Math.abs(dx) <= 0.8 && dist <= outerR + 2 && dist >= innerR - 2) {
        r = 255; g = 60; b = 60; a = 255;
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

module.exports = { generateCrosshairPng };
