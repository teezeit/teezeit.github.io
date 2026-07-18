# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Local Development

Start the HTTPS development server (HTTPS is required because `DeviceOrientationEvent` only works in a secure context on iOS Safari):

```bash
uv run server.py
```

Serves at `https://localhost:8443` and `https://<local-ip>:8443` (for mobile testing on the same network). Self-signed `cert.pem`/`key.pem` are already in the repo root.

## Architecture

This is a static personal website — no build step, no package manager. Files are served directly as-is to GitHub Pages (`teezeit.github.io`, CNAME → `tobiashoelzer.com`).

**Wave animation** (`js/index.js`): A Three.js r88 particle wave rendered onto a 2D canvas. The file bundles `THREE.CanvasRenderer` and `THREE.Projector` inline because those classes were removed from Three.js before r88. Three.js itself is loaded from CDN. jQuery is used only to select `#home_wave` and append the canvas.

**Gyroscope permission** (`js/gyroscope-permission.js`): Handles the iOS 13+ `DeviceOrientationEvent.requestPermission()` flow. On mobile it renders a "move around" button; on desktop it skips directly to notifying the main script. Communication to `index.js` is via the `window.onGyroPermissionGranted` callback — `gyroscope-permission.js` must be loaded before `index.js`.

**Input modes**: `index.js` switches between mouse tracking (desktop) and gyroscope (mobile) at runtime via `useGyroscope`. The first `deviceorientation` event after permission captures a reference position so subsequent movement is relative.

**Layout**: `#wrapper` is `position: relative`. `.background` (the canvas) is `position: absolute; z-index: -100` so it sits behind `.content` which carries the text overlay.
