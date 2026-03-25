const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'src/assets/scammer_list.json');
const outputPath = path.join(__dirname, 'src/app/scammer-data.ts');

const raw = fs.readFileSync(inputPath, 'utf8');
const data = JSON.parse(raw);

if (data['0']) { data['O'] = data['0']; delete data['0']; }

const keys = Object.keys(data);
const scrambled = {};
for (const k of keys) {
  scrambled[k] = data[k].map(item => {
    const entries = Object.entries(item);
    for (let i = entries.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [entries[i], entries[j]] = [entries[j], entries[i]];
    }
    return Object.fromEntries(entries);
  });
}

const scrambledStr = JSON.stringify(scrambled);

function rot13(str) {
  return str.replace(/[a-zA-Z]/g, c => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

const rot13ed = rot13(scrambledStr);

const XOR_KEY = 'RuC0y$Sc4mm3r!xZ';
function xorEncode(str, key) {
  return Array.from(str).map((c, i) =>
    String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
  ).join('');
}

const xored = xorEncode(rot13ed, XOR_KEY);
const b64 = Buffer.from(xored, 'binary').toString('base64');

const NOISE_CHARS = '!@#$%^&*~`';
let obfuscated = '';
let noiseInserted = 0;
for (let i = 0; i < b64.length; i++) {
  obfuscated += b64[i];
  if ((i + 1) % 7 === 0) {
    obfuscated += NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)];
    noiseInserted++;
  }
}

const tsContent = `export const SCAMMER_DATA = '${obfuscated}';
export const _k = '${XOR_KEY}';
`;

fs.writeFileSync(outputPath, tsContent, 'utf8');
console.log(`[encode] Done: ${Object.values(data).flat().length} entries -> ${obfuscated.length} chars`);
