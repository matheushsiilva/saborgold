import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const SOURCE = join(ROOT, 'public', 'brand', 'favicon-source.png');

const OUT_PNG = join(ROOT, 'public', 'favicon.png');
const OUT_ICO = join(ROOT, 'public', 'favicon.ico');

async function main() {
  const square512 = await sharp(SOURCE)
    .resize(512, 512, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toBuffer();

  writeFileSync(OUT_PNG, square512);

  const sizes = [16, 32, 48];
  const pngBuffers = await Promise.all(
    sizes.map((size) =>
      sharp(SOURCE)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer()
    )
  );

  const ico = await pngToIco(pngBuffers);
  writeFileSync(OUT_ICO, ico);

  const meta = await sharp(OUT_PNG).metadata();
  console.log(`favicon.png: ${meta.width}x${meta.height}, ${square512.length} bytes`);
  console.log(`favicon.ico: ${ico.length} bytes`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
