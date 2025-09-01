import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// กำหนด __filename และ __dirname สำหรับ ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8004;
const distPath = path.join(__dirname, 'dist/PromotionProposal/dist');

app.use('/PromotionProposal/dist', express.static(distPath, {
  setHeaders: (res, filePath) => {
    if (path.extname(filePath) === '.js') {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
