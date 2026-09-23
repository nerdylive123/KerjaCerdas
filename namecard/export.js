// Export the KerjaCerdas namecard to PDF (vector, print-ready), PNG (300 DPI), and HTML.
// Usage: node export.js
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");

const OUT_DIR = path.join(__dirname, "dist");
const SRC = path.join(__dirname, "index.html");

// Full-bleed canvas: trim 91×55mm + 3mm bleed all sides
const BLEED_W_MM = 97;
const BLEED_H_MM = 61;
// 300 DPI at 97×61mm → pixels for the PNG
const PX_W = Math.round((BLEED_W_MM / 25.4) * 300); // ≈1146
const PX_H = Math.round((BLEED_H_MM / 25.4) * 300); // ≈720

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Give the PNG exactly 300-DPI pixel density via device scale factor.
  // CSS px for 97mm at 96 CSS-px/inch = 97/25.4*96 ≈ 366.6; scale = 300/96 = 3.125
  await page.setViewport({ width: Math.ceil((BLEED_W_MM / 25.4) * 96), height: Math.ceil((BLEED_H_MM / 25.4) * 96), deviceScaleFactor: 300 / 96 });

  await page.goto("file://" + SRC, { waitUntil: "networkidle0" }); // wait for Google Fonts

  // 1) Vector PDF, exact physical size, backgrounds printed
  await page.pdf({
    path: path.join(OUT_DIR, "kerjacerdas-namecard.pdf"),
    width: `${BLEED_W_MM}mm`,
    height: `${BLEED_H_MM}mm`,
    printBackground: true,
    pageRanges: "1",
    preferCSSPageSize: false,
  });

  // 2) PNG at ~300 DPI, cropped to the card element
  const card = await page.$("#card");
  await card.screenshot({ path: path.join(OUT_DIR, "kerjacerdas-namecard.png") });

  await browser.close();

  // 3) Self-contained HTML copy for web/email (plus the logo it references)
  fs.copyFileSync(SRC, path.join(OUT_DIR, "kerjacerdas-namecard.html"));
  fs.copyFileSync(path.join(__dirname, "logo.svg"), path.join(OUT_DIR, "logo.svg"));

  const png = fs.statSync(path.join(OUT_DIR, "kerjacerdas-namecard.png"));
  console.log(`Exported to ${OUT_DIR}`);
  console.log(`  kerjacerdas-namecard.pdf   (vector, ${BLEED_W_MM}x${BLEED_H_MM}mm full-bleed)`);
  console.log(`  kerjacerdas-namecard.png   (~${PX_W}x${PX_H}px @300DPI, ${(png.size / 1024).toFixed(0)} KB)`);
  console.log(`  kerjacerdas-namecard.html  (self-contained)`);
})();
