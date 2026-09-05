import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Simple CRC32 table & calculator
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcTarget = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(crcTarget);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function createPng(width, height, drawFn) {
  const pngSig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Generate raster data (1 filter byte 0x00 per row + RGBA)
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // No filter

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([pngSig, ihdrChunk, idatChunk, iendChunk]);
}

// Draw MediQueue Brand Icon (Deep Teal #0F766E with progressive queue arcs & pulse dot)
function drawMediQueueIcon(x, y, w, h, isMaskable = false) {
  // Normalize coordinates (-1 to 1)
  const nx = (x / w) * 2 - 1;
  const ny = (y / h) * 2 - 1;
  const r = Math.sqrt(nx * nx + ny * ny);

  // Background color: Deep Teal (#0F766E -> 15, 118, 110)
  const bgR = 15, bgG = 118, bgB = 110;
  
  if (!isMaskable) {
    // Rounded squircle / rounded rect for standard icon
    const cornerRadius = 0.38;
    const absX = Math.abs(nx);
    const absY = Math.abs(ny);
    const maxBound = 0.90;
    
    // Smooth rounded rect bounds
    const dx = Math.max(0, absX - (maxBound - cornerRadius));
    const dy = Math.max(0, absY - (maxBound - cornerRadius));
    const distCorner = Math.sqrt(dx * dx + dy * dy);
    
    if (distCorner > cornerRadius) {
      return [0, 0, 0, 0]; // transparent
    }
  }

  // Draw Icon Content:
  // Center Dot (radius 0.12)
  if (r <= 0.13) {
    return [255, 255, 255, 255]; // Pure white central pulse
  }

  // Top-left arc (representing queue progression from A to doctor)
  // Arc radius ~ 0.42, stroke ~ 0.08
  const angle = Math.atan2(ny, nx); // -PI to PI
  const arcR = 0.45;
  const arcDist = Math.abs(r - arcR);
  const strokeW = 0.075;

  // Arc 1: Top-Left quadrant (angle between -PI and -PI/2)
  if (arcDist <= strokeW && angle >= -Math.PI && angle <= -Math.PI / 4) {
    return [255, 255, 255, 255];
  }

  // Arc 2: Bottom-Right quadrant (angle between 0 and 3*PI/4)
  if (arcDist <= strokeW && angle >= 0 && angle <= (3 * Math.PI) / 4) {
    return [255, 255, 255, 225]; // slightly translucent white
  }

  // Soft subtle pulse ring at r = 0.72
  const outerRingDist = Math.abs(r - 0.72);
  if (outerRingDist <= 0.015) {
    return [255, 255, 255, 70]; // subtle faint ring
  }

  // Default deep teal background
  return [bgR, bgG, bgB, 255];
}

const iconsDir = path.resolve('public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 1. Generate 192x192
console.log('Generating 192x192 PNG icon...');
const png192 = createPng(192, 192, (x, y, w, h) => drawMediQueueIcon(x, y, w, h, false));
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), png192);
fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), png192);

// 2. Generate 512x512
console.log('Generating 512x512 PNG icon...');
const png512 = createPng(512, 512, (x, y, w, h) => drawMediQueueIcon(x, y, w, h, false));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), png512);
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), png512);

// 3. Generate 512x512 Maskable (full bleed background for Android Adaptive Icons)
console.log('Generating 512x512 Maskable PNG icon...');
const pngMaskable = createPng(512, 512, (x, y, w, h) => drawMediQueueIcon(x, y, w, h, true));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512.png'), pngMaskable);
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512x512.png'), pngMaskable);

// 4. Generate 180x180 Apple Touch Icon
console.log('Generating 180x180 Apple Touch PNG icon...');
const pngApple = createPng(180, 180, (x, y, w, h) => drawMediQueueIcon(x, y, w, h, true));
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), pngApple);
fs.writeFileSync(path.resolve('public', 'apple-touch-icon.png'), pngApple);

console.log('All PWA PNG icons successfully generated!');
