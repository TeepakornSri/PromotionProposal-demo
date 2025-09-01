import path from 'path';
import fs from 'fs-extra';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

async function copyAssets() {
  const srcDir = path.join(__dirname, 'dist/PromotionProposal/dist/assets');
  const destDir = path.join(__dirname, 'dist/assets');

  try {
    await fs.copy(srcDir, destDir);
    console.log('Assets copied successfully!');
  } catch (err) {
    console.error('Error copying assets:', err);
  }
}

copyAssets();
