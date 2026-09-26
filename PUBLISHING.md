# GitHub updates and Chrome distribution

## Why this cannot silently self-update today

Chrome extensions installed with **Load unpacked** cannot install new executable files from GitHub or replace their own code. GitHub source files are not an extension update channel. The extension can **notify you** that a newer GitHub release/version exists, but cannot install it. Do not put a GitHub token or private key in the extension. Later, Chrome Web Store publishing can provide automatic Chrome-managed updates.

## Set up a GitHub repo (no developer account required)

1. Sign in to GitHub and create a new **public** repository, e.g. `wacewise`. Do not initialize it with a README (this project already has one).
2. Extract this project folder once, then from a terminal in that folder run:

   ```bash
   git init -b main
   git add .
   git commit -m "Initial WACEwise extension"
   git remote add origin https://github.com/YOUR_USERNAME/wacewise.git
   git push -u origin main
   ```

3. For a clean, updateable install, clone to a permanent location, e.g. `git clone https://github.com/YOUR_USERNAME/wacewise.git C:\\WACEwise`. In `chrome://extensions` enable Developer mode, remove the old unpacked copy and **Load unpacked** from `C:\\WACEwise`. Do this once.
4. In the extension's Settings, enter `https://github.com/YOUR_USERNAME/wacewise` under **GitHub repository**. The extension checks for a newer release (or `main/manifest.json` if there are no releases) once daily and when you press Check for updates.
5. After a notification, run `Update-WACEwise.ps1` in the cloned folder (or run `git pull --ff-only` there), then click **Reload** on the extension card in `chrome://extensions`. Updating code is **not** automatic in unpacked mode. Chrome may require accepting new permissions when the manifest changes.

To publish a version: change the version in `manifest.json` (for example 2.9.0), commit and push. Optionally create a GitHub Release tagged `v2.9.0`. The checker compares numeric version components. It only checks public repositories and never executes remote code.

## Later: automatic browser updates

When you have a Chrome Web Store developer account, package and submit the extension using the Chrome Web Store developer dashboard. Chrome then handles automatic, signed updates to installed store versions after review. A GitHub Actions workflow can prepare a ZIP for submission, but it cannot publish without account credentials and approval. The GitHub update checker is informational; it is not a replacement for Chrome's update service.
