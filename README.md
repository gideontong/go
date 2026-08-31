# Gideon's Travel Guide 🗺️

An interactive, responsive world travel map showcasing curated travel guides and destination highlights across global regions.

🌐 **Live Website**: [go.gideontong.com](https://go.gideontong.com/)

---

## ✨ Features

- 🗺️ **Interactive Vector Map**: Powered by `jsVectorMap` with custom responsive scaling, smooth zooming, panning, and rich destination tooltips.
- 🎨 **Modern Design & Theming**:
  - Glassmorphic floating HUD navigation with backdrop blur.
  - Light & Dark mode support with automatic system preference detection and localStorage persistence.
  - Dynamic SVG vector map recoloring matching the active theme.
- ⚡ **Command Palette / Live Search (`⌘K` or `/`)**:
  - Instant keyboard-driven fuzzy search across 60+ countries and 9 regions.
  - Arrow-key navigation, instant region focus, and one-click guide links.
- 📂 **Regions Directory Drawer**:
  - Slide-over explorer listing all 9 travel guide regions with country badges, descriptions, and map highlight actions.
- 📌 **Destination Preview Cards**:
  - Floating details card for selected countries with quick actions, links, and share utility.
- 🏷️ **Quick Region Legend Dock**:
  - Interactive bottom dock for instant filtering and visual region highlights.
- 📱 **Mobile & Tablet Optimized**:
  - Responsive HUD, bottom sheets, and touch-friendly controls.
- 🚀 **100% Static & Blazing Fast**:
  - Zero build steps or heavy dependencies required. Fully static HTML5, CSS3, and modern ES6+ JavaScript.

---

## 📁 Project Structure

```text
├── index.html              # Main semantic HTML5 entrypoint
├── CNAME                   # Custom domain configuration (go.gideontong.com)
├── favicon.svg             # Modern vector favicon
├── site.webmanifest        # Web application manifest
├── css/
│   ├── style.css           # Design tokens, CSS variables (dark/light), reset, typography, base layout
│   ├── components.css      # Floating HUD, search modal, regions drawer, preview card, legend dock
│   └── map.css             # jsVectorMap theme overrides, tooltip styling, and canvas transitions
├── js/
│   ├── config.js           # Regions configuration, ISO country mappings, flags, and helper functions
│   ├── search.js           # Live search engine and command palette controller
│   ├── ui.js               # Theme manager, drawer, preview card, fullscreen, and toast notifications
│   └── app.js              # Vector map initialization, hover/click interactions, and zoom controls
```

---

## 🛠️ Adding or Modifying Destinations

To add a new country or update region links, edit [`js/config.js`](file:///Users/gideontong/Code/go/js/config.js):

1. **Add ISO Country Code to a Region**:
   ```javascript
   "Europe": {
     id: "europe",
     name: "Europe",
     tagline: "Historic Capitals, Alpine Lakes & Mediterranean Sun",
     countries: ["FR", "IT", "DE", "ES", ...], // Add 2-letter ISO code here
     link: "https://europe.gideontong.com/",
     color: "#f59e0b",
     icon: "🏰",
   }
   ```

2. **Add Country Name and Flag to `COUNTRY_LOOKUP`**:
   ```javascript
   FR: { name: "France", flag: "🇫🇷" },
   ```

---

## 💻 Local Development

Since this is a static website, you can serve it with any static web server:

```bash
# Python 3
python3 -m http.server 8000

# or with npx serve
npx serve .
```

Then visit `http://localhost:8000` in your web browser.
