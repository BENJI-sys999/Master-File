# Sunny Farm

Simple static farm website for animal husbandry and products.

How to view
- Open `farmweb.html` in your browser (double-click or `File > Open`).

Files added
- `farmweb.html` — homepage
- `css/styles.css` — styles
- `js/script.js` — client interactivity
- `js/products.js` — product seed data
- `assets/` — small SVG placeholders

Notes
- This site renders products dynamically from `js/products.js`.
- You can add products locally using the admin panel: click the gear button (⚙️) in the header, fill the form and submit. Items are saved to your browser `localStorage` (no server required).

To reset custom products
- Open browser devtools (Application / Storage) and clear `localStorage` key `customProducts`, or run in console:

```javascript
localStorage.removeItem('customProducts')
```
