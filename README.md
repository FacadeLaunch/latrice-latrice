# Latrice Latrice

Storefront landing page for **Latrice Latrice** — heritage graphic tees and
elevated essentials.

Static site. No build step, no dependencies.

## Structure

```
index.html          # single page
styles.css          # all styling, light + dark
script.js           # email capture (localStorage only)
brand/              # logo lockups
products/           # product photography, 1024×1024 on white
```

## Local preview

```bash
npx serve .
```

## Deploy

Pushes to `main` deploy automatically via Vercel.

## Known gaps

- Email capture has **no backend**. Addresses land in `localStorage` only.
  Wire to a real list provider before launch.
- Prices are placeholders.
- No cart or checkout — this is a pre-launch landing page.
- Four source product images are excluded from the site because the garment
  print reads "Latrese" instead of "Latrice", or carries garbled text. They
  need regenerating before use.
