/**
 * Generates the social share / OG image at 1200×630 PNG.
 * Run: node scripts/og-image.mjs
 *
 * Used by Open Graph (Facebook/LinkedIn) and Twitter Card meta tags.
 * Mirrors the marketing site's dark gradient + brand mark + tagline.
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", "site", "assets", "og.png");

const W = 1200;
const H = 630;

const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#070912"/>
      <stop offset="100%" stop-color="#1b0f3a"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.2" cy="0.2" r="0.6">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.85" cy="0.85" r="0.55">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.40"/>
      <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#10b981"/>
    </linearGradient>
    <pattern id="dots" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.4" fill="rgba(167, 139, 250, 0.15)"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>

  <!-- Brand mark -->
  <g transform="translate(80, 100)">
    <rect width="80" height="80" rx="18" fill="url(#brand)"/>
    <path d="M12 44 L24 44 L34 16 L44 66 L52 36 L70 36"
          stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>
  <text x="180" y="158" fill="#ffffff"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        font-weight="900" font-size="48" letter-spacing="4">VINTRACT</text>

  <!-- Headline -->
  <text x="80" y="350" fill="#ffffff"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        font-weight="900" font-size="72" letter-spacing="-1">Industry 4.0 SaaS</text>
  <text x="80" y="430" fill="#c4b5fd"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        font-weight="800" font-size="56" letter-spacing="-1">for the Indian factory.</text>

  <!-- Strap line -->
  <text x="80" y="500" fill="#94a3b8"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        font-weight="500" font-size="26">Live material tracking · BOM-driven planning · IoT · AI-native</text>

  <!-- Bottom URL strip -->
  <text x="80" y="580" fill="#a78bfa"
        font-family="JetBrains Mono, 'Courier New', monospace"
        font-weight="600" font-size="22">vintract.com</text>

  <!-- Right-side scan reticle -->
  <g transform="translate(950, 310)" opacity="0.7">
    <circle r="160" fill="none" stroke="rgba(167, 139, 250, 0.18)" stroke-width="1"/>
    <circle r="100" fill="none" stroke="rgba(167, 139, 250, 0.35)" stroke-width="1.5"/>
    <circle r="55"  fill="none" stroke="rgba(167, 139, 250, 0.6)"  stroke-width="2"/>
    <g stroke="#a78bfa" stroke-width="3" stroke-linecap="round" fill="none">
      <path d="M -120 -120 L -120 -90 M -120 -120 L -90 -120"/>
      <path d="M  120 -120 L  120 -90 M  120 -120 L  90 -120"/>
      <path d="M -120  120 L -120  90 M -120  120 L -90  120"/>
      <path d="M  120  120 L  120  90 M  120  120 L  90  120"/>
    </g>
    <path d="M-26 0 L-14 0 L-4 -24 L6 30 L14 -10 L26 -10"
          stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>
</svg>
`.trim();

const out = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync(OUT, out);
console.log(`Wrote ${OUT} (${out.length} bytes, ${W}x${H})`);
