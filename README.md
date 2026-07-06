<div align="center">

```
██████╗ ██████╗ ███████╗██╗   ██╗██████╗
██╔══██╗╚════██╗██╔════╝██║   ██║╚════██╗
██████╔╝ █████╔╝█████╗  ██║   ██║ █████╔╝
██╔═══╝ ██╔═══╝ ██╔══╝  ██║   ██║ ╚═══██╗
██║     ███████╗██║      ╚██████╔╝██████╔╝
╚═╝     ╚══════╝╚═╝       ╚═════╝ ╚═════╝
```

# Pedro Neves · Portfolio

**Economist → Software Engineer**

[![Live Site](https://img.shields.io/badge/Live%20Site-p2fu2.github.io-00ff88?style=for-the-badge&logo=github-pages&logoColor=white)](https://p2fu2.github.io)
[![GitHub](https://img.shields.io/badge/GitHub-P2FU2-181717?style=for-the-badge&logo=github)](https://github.com/P2FU2)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-pedroqneves-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/pedroqneves/)

</div>

---

## About

Personal portfolio built as a fully static site on **GitHub Pages** — no framework, no build step, just HTML, CSS and vanilla JavaScript.

Highlights an interactive hacker-themed terminal, dynamic GitHub API integration, and a three-tier theme system (Light / Dark / Matrix).

---

## Pages

| Page | Description |
|------|-------------|
| [`/`](https://p2fu2.github.io) | Landing — interactive terminal, profile stats, GitHub strip |
| [`/html/projects.html`](https://p2fu2.github.io/html/projects.html) | Auto-updated project grid via GitHub API (authored repos only) |
| [`/html/cv.html`](https://p2fu2.github.io/html/cv.html) | Curriculum Vitae with PDF export |
| [`/html/analysis.html`](https://p2fu2.github.io/html/analysis.html) | Articles fetched from Medium RSS |

---

## Features

- **Interactive Terminal** — 30+ commands: `netstat`, `ifconfig`, `nmap`, `ps`, `top`, `curl`, `story`, `hack` and more
- **3-Theme System** — Light (blue/white) · Dark (GitHub-style) · Matrix (green neon, unlocked via terminal `theme`)
- **Profile shapes** — Circle · Hexagon · Diamond · Square, each with a unique CSS animation
- **Dynamic GitHub data** — Repos, stars, followers and bio fetched live from the GitHub API
- **Medium RSS** — Articles fetched with multi-proxy fallback (rss2json → AllOrigins → corsproxy.io)
- **PDF Export** — Client-side CV generation with html2pdf.js
- **i18n** — EN / PT / ES / ZH / JA via `translations.js`
- **GitHub Actions** — Custom Pages workflow, no Jekyll

---

## Tech Stack

```
Language    Vanilla HTML5 · CSS3 · JavaScript (ES2022)
Hosting     GitHub Pages + GitHub Actions
Fonts       Fira Code · Inter (Google Fonts)
Icons       Font Awesome 6
Data        GitHub REST API v3
RSS         Medium (multi-proxy fetch)
PDF         html2pdf.js (CDN)
```

---

## Theme System

```
┌────────────────────────────────────────────┐
│  [ dark ]  button  →  Light ↔ Dark         │
│                                            │
│  Terminal command: theme                   │
│  → unlocks Matrix mode (neon green +       │
│    canvas rain + CRT scanlines + glitch)   │
└────────────────────────────────────────────┘
```

---

## Terminal — Quick Reference

```bash
# Info
whoami · neofetch · skills · stack · story · contact

# Navigation
ls · projects · resume · analysis · github · linkedin

# Network / System
netstat · ifconfig · ping · nmap · traceroute
curl · ssh · df · ps · top · env · find · grep

# Terminal
theme · hack · history · clear · date · git · reboot
```

---

## Local Development

No build tools required — open directly in a browser:

```bash
git clone https://github.com/P2FU2/P2FU2.github.io.git
cd P2FU2.github.io

# Option 1 — Python
python -m http.server 8080

# Option 2 — Node
npx serve .

# Option 3 — VS Code
# Install "Live Server" extension → right-click index.html → Open with Live Server
```

---

## Project Structure

```
P2FU2.github.io/
├── index.html          # Main landing page + terminal
├── translations.js     # i18n strings
├── html/
│   ├── projects.html   # GitHub API project grid
│   ├── cv.html         # Curriculum Vitae + PDF export
│   └── analysis.html   # Medium RSS articles
├── images/             # Local assets
├── .github/
│   └── workflows/
│       └── pages.yml   # GitHub Actions deploy
└── README.md
```

---

## Deployment

Deployed automatically via **GitHub Actions** on every push to `main`.

> Settings → Pages → Source: **GitHub Actions**

```yaml
# .github/workflows/pages.yml
on:
  push:
    branches: [main]
jobs:
  deploy:
    uses: actions/deploy-pages@v4
```

---

## Contact

| | |
|--|--|
| **Email** | pedromilani14@gmail.com |
| **GitHub** | [@P2FU2](https://github.com/P2FU2) |
| **LinkedIn** | [pedroqneves](https://linkedin.com/in/pedroqneves/) |
| **Medium** | [@pedromilani14](https://medium.com/@pedromilani14) |
| **Twitter** | [@qpedroneves](https://twitter.com/qpedroneves) |

---

<div align="center">

*// built with vanilla JS and too much coffee*

</div>
