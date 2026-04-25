# Pretext Playground

A small interactive playground I built to try out [Pretext](https://github.com/chenglou/pretext) - a text measurement library by [Cheng Lou](https://github.com/chenglou) (creator of react-motion, ReasonML). Pretext bypasses expensive DOM reflows by calculating text layout using pure arithmetic, making real-time text wrapping possible at 60fps. I wanted to see what it feels like to build something with it, so I made this page where text reflows live around draggable objects.

### Live Demo: [pretext playground](https://pretext-playgroundd.vercel.app/)

---

## Preview

![Pretext Playground Preview](https://res.cloudinary.com/dhhhr2skx/image/upload/v1777136517/pretext_oq8oij.png)

---

## Features

- Text reflows in real-time around draggable emoji orbs and a floating character
- Orb collision physics with explosion effects on click
- Fully responsive with mobile-optimized layout

---

## Tech Stack

- **Vite** – Dev server & bundler
- **Vanilla JS** – Pure ES modules, no framework
- **Tailwind CSS** (CDN) – Styling
- **@chenglou/pretext** – Text measurement & reflow engine

---

## Setup

```bash
git clone https://github.com/Piyush-20045/pretext.git
cd pretext
npm install
npm run dev
```

---

## Folder Structure

```
pretext/
├── public/             # Static assets (character.webm, favicon)
├── src/editorial/      # Modular JS – orbs, events, reflow, physics, fx
├── index.html          # Page layout & UI
├── style.css           # Keyframe animations
├── main.js             # App entry point
└── package.json
```

---

## What I Learned

- How Pretext decouples text measurement from the DOM using cached segment data and pure math
- Building a `requestAnimationFrame` loop that ties physics, reflow, and rendering together

---

## Author

**Piyush Yadav**

- Twitter/X: [@piyush9436](https://x.com/Piyush9436)
- LinkedIn: [@piyushyadav](https://www.linkedin.com/in/piyushyadav0011/)
