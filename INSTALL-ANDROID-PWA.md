# FreeLLMAPI — Installable Web App for Android (PWA)

Built directly from the `freellmapi-main.zip` source you provided. The original
project is a React dashboard (`client/`) plus a Node.js server (`server/`) that
encrypts provider keys in SQLite and routes requests across 34 free LLM
providers behind one OpenAI-compatible `/v1` endpoint.

A browser tab alone cannot hold that server, so the installable Android app is
the project's own dashboard, converted into a full PWA, talking to the
project's own server — which can run **on the same phone** (Termux), on a PC,
or on a small server/VPS.

## What was added to the code (and nothing else changed)

| File | Purpose |
|---|---|
| `client/public/manifest.webmanifest` | App name, `standalone` display, theme colors, shortcuts (Playground, Keys, Models, Analytics), icons |
| `client/public/icons/icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png` | Generated from the project's own `favicon.svg` brand mark |
| `client/public/sw.js` | Service worker: caches the app shell for offline launch. `/api`, `/v1`, `/v1beta` and `/mcp` are **never** cached — key and inference traffic always goes to the network |
| `client/public/register-sw.js` | Registers the service worker (external script, so the server's CSP is untouched) and shows a dismissible **Install** button when Chrome offers installation |
| `client/index.html` | Manifest link, theme-color, description, mobile-web-app meta tags, `viewport-fit=cover` |

Verified here: dependencies installed, `npm run build -w client` succeeded,
and the built app served HTTP 200 for `/`, the manifest, the service worker,
and all icons.

## Option A — Everything on the phone (Termux)

1. Install **Termux from F-Droid** (the Play Store build is outdated).
2. In Termux:
   ```bash
   pkg update && pkg install -y nodejs-lts git
   node --version   # must be 22.13+ (24 LTS recommended)
   ```
3. Get the code (clone upstream, or unzip `freellmapi-pwa-source.zip` from this
   package into Termux storage) and build:
   ```bash
   cd freellmapi-pwa
   npm install --no-audit --no-fund
   npm run build
   cd server && node dist/index.js   # serves the app + API on port 3001
   ```
   (On Android the server uses Node's built-in SQLite, so a warning about the
   optional `better-sqlite3` package is harmless.)
4. Keep it awake: install Termux:API from F-Droid, then run
   `termux-wake-lock`, and disable battery optimization for Termux in Android
   Settings.
5. Open **http://localhost:3001** in Chrome on the phone, create your dashboard
   account, and add your provider keys on the **Keys** page.

## Option B — Server elsewhere, app on the phone

Run the server with Docker or Node on a PC/VPS as in the project's README,
then open its address in Chrome on the phone. For installation, Chrome
requires a **secure context**: `https://…` or `localhost`. For a LAN address,
put it behind HTTPS or reach it over a private VPN such as Tailscale — do not
port-forward the dashboard directly to the internet, it holds your API keys.

## Installing the app on Android

1. Open the app URL in **Chrome** on the phone.
2. Either tap the floating **Install FreeLLMAPI as an app → Install** button
   that appears, or use Chrome's menu **⋮ → Install app** (or
   *Add to Home screen*).
3. FreeLLMAPI now sits in your app drawer / home screen, opens full-screen
   (standalone, no browser chrome), and launches from its cached shell even
   with the server temporarily unreachable — live data loads as soon as the
   server is back.

## Updating

Rebuild the client (`npm run build -w client`) and redeploy `client/dist`.
The service worker is network-first for pages, so the new version arrives on
the next launch; bump `CACHE` in `sw.js` if you ever need to force-evict the
cached shell.

## Packages

- `freellmapi-pwa-dist.zip` — the ready-built PWA (the contents of
  `client/dist`). Drop it where the server serves the dashboard
  (`client/dist` in the repo layout, or any static host in front of the API).
- `freellmapi-pwa-source.zip` — the full source tree with the PWA changes
  applied (no `node_modules`), if you prefer to build it yourself.
