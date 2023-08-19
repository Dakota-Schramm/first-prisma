// Flipnote font
// https://en.fontworks.co.jp/fontsearch/PopHappinessStd-EB/?word=FlipnoteRemixed

// OT-Seurat Pro - Main UI font, available from Adobe Typekit.
// FOT-Rodin Pro - Secondary UI font, also available from Adobe Typekit.

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'main-online': '#71ba00',
        'main-offline': '#ff6f1c',
      }
    },
  },
  plugins: [],
}
