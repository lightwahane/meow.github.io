# All the Tomorrows — Cinematic Romantic Experience

A zero-dependency, mobile-first romantic microsite built with **HTML5 + CSS3 + vanilla JavaScript + Canvas**.

## Project structure

```text
proposal/
├── index.html
├── style.css
├── script.js
├── README.md
├── photo1.jpg
├── photo2.jpg
├── photo3.jpg
└── love.mp3        <-- YOU ADD THIS
```

The three supplied photos are used in the requested order:

1. `photo1.jpg` — first uploaded photo (hands/wrists)
2. `photo2.jpg` — second uploaded photo (cheek kiss)
3. `photo3.jpg` — third uploaded photo (emotional centerpiece)

`love.mp3` is intentionally **not included**. Add your own music file at exactly:

```text
love.mp3
```

The site will remain functional if that file is absent; the music control will show a subtle unavailable state.

---

## Run locally

No Node, npm, server, framework, or build process is required.

You can open `index.html` directly in a modern browser.

For the most reliable local testing, you can also use any simple static-file server, but it is not required for GitHub Pages.

---

## Deploy to GitHub Pages

### Option A — GitHub web interface

1. Create a new GitHub repository.
2. Upload the entire contents of the `proposal/` folder.
3. Make sure `index.html` is at the repository root.
4. Open **Settings → Pages**.
5. Under **Build and deployment**, select:
   - Source: **Deploy from a branch**
   - Branch: your main branch
   - Folder: **/ (root)**
6. Save.
7. Wait for GitHub Pages to publish the site.
8. Open the generated Pages URL.

### Option B — Git command line

From inside the `proposal` folder:

```bash
git init
git add .
git commit -m "Create cinematic romantic experience"
git branch -M main
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

Then enable GitHub Pages in the repository's **Settings → Pages**.

---

## Important: music

The HTML/JavaScript references:

```text
love.mp3
```

Add your own MP3 there before publishing if you want music.

The site deliberately does **not** autoplay audio. This avoids mobile browser autoplay restrictions.

---

## Customization

The top of `style.css` and `script.js` contains an **EASY CUSTOMIZATION** section.

You can change:

- Photos — image paths in `index.html`
- Music — `love.mp3`
- Story text — text in `index.html`
- Colors — CSS variables in `style.css`
- Animation speed — CSS transitions and `TIMINGS` in `script.js`
- Particle density — `PARTICLE_DENSITY` in `script.js`

The project intentionally avoids external libraries and absolute paths so it can live under a GitHub Pages repository subpath.

---

## Design / performance notes

- Mobile-first portrait layout
- Safe-area support for iPhone
- Responsive typography
- No horizontal scrolling intended
- Canvas-based atmospheric particles rather than a large DOM particle tree
- `IntersectionObserver` scene activation
- Transform/opacity-based animation where practical
- Desktop pointer parallax
- Mobile device-orientation parallax when available
- Reduced-motion support through `prefers-reduced-motion`
- No backend, database, npm dependency, or build step
- All asset references are relative paths

## Browser

Use a current Safari, Chrome, Firefox, or Chromium-based browser for the best experience.
