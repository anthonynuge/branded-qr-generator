# Branded QR Code Generator

A browser-based tool that generates scannable QR codes with your logo embedded as the background — keeping your brand visually dominant while remaining fully readable by any QR scanner.

## What it does

Upload a logo, enter a URL or text, and the app produces a QR code where your logo shows through the pattern. The QR dots are only drawn where the logo's brightness would confuse a scanner — everywhere else, the logo itself provides the correct light/dark value. The result looks like a branded image but scans reliably.

**Key features:**
- Upload any logo (PNG, JPG, SVG, etc.)
- Auto-extracts your brand's dominant color and applies it to the QR finder squares
- Customize dot style (square, rounded, circle), dot size, and colors
- Export as PNG or SVG
- Everything runs in the browser — no files are sent to a server

## How it works

1. Your logo is drawn as the full canvas background
2. The app checks the brightness of each QR module position against the logo pixels at that location
3. A dot is only drawn if the logo's brightness doesn't already match what the QR code needs (dark vs. light)
4. The three finder squares (corner markers) and alignment patterns are always drawn on top in your brand color
5. Error correction level H (30% tolerance) handles any modules left uncovered by the logo

This means the logo stays visually dominant — dots only appear where necessary for scannability.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Other commands

```bash
npm run build   # Production build + TypeScript check
npm run lint    # ESLint
```

## Tech stack

- Next.js 14 (App Router, client-side only)
- TypeScript
- Tailwind CSS
- `qrcode` — QR matrix generation
- `color-thief-browser` — dominant color extraction from logo
