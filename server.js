const express   = require('express');
const puppeteer = require('puppeteer');
const app       = express();
const PORT      = process.env.PORT || 3000;

app.use(express.json({ limit: '5mb' }));

app.post('/generate-pdf', async (req, res) => {
  const { html, filename = 'output.pdf' } = req.body;
  if (!html) return res.status(400).json({ error: 'Missing HTML.' });

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res
      .set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`
      })
      .send(pdf);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'PDF generation failed.' });
  }
});

app.listen(PORT, () =>
  console.log(`🚀  PDF service listening on http://localhost:${PORT}`)
);
