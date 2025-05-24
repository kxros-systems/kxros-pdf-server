/* server.js — CommonJS */

const express      = require('express');
const path         = require('path');
const puppeteer    = require('puppeteer-with-browser');    // bundled browser
const app          = express();
const PORT         = process.env.PORT || 3000;


app.use(express.json({ limit: '5mb' }));

// ──────────────────────────────────────────────────────────── route
app.post('/generate-pdf', async (req, res) => {
  const { html, filename = 'output.pdf' } = req.body;

  if (!html) {
    return res.status(400).json({ error: 'Missing HTML.' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true
    });

    await browser.close();

    res
      .set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`
      })
      .send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation failed:', err);
    res.status(500).json({ error: 'PDF generation failed.' });
  }
});

// ──────────────────────────────────────────────────────────── start server
app.listen(PORT, () => {
  console.log(`🚀  PDF service listening on http://localhost:${PORT}`);
});