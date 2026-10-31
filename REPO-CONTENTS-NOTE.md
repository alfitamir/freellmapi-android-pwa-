# Repository contents note

This repository was published from a local working copy through GitHub's API
(the Muse GitHub App). That route transfers **text files only** and carries
one GitHub platform restriction, so two things differ from the local build.
Everything else — all 1,247 source files of the client, server, CLI and
shared packages, plus the PWA additions — is here in full.

## 1. CI workflows are in `workflows-backup/`

GitHub does not allow apps without a dedicated *workflows* permission to
create or update files under `.github/workflows/`, through any API route.
The four workflow files are therefore preserved verbatim in
[`workflows-backup/`](workflows-backup/) (`ci.yml`, `cli-release.yml`,
`desktop-release.yml`, `docker.yml`).

To activate them, move that folder's contents to `.github/workflows/` —
either in a local clone (`git mv` / copy and push) or with GitHub's web
"Add file" editor, both of which run under your own account permissions.

## 2. Binary image assets are not in this repo

The PNG/ICO/ICNS assets (56 files, ~3.9 MB — the `repo-assets/` screenshots
and provider/agent logos, the desktop app icons, and the rendered PWA PNG
icons in `client/public/icons/`) cannot pass through the text-only API
transfer; a test upload confirmed the bytes do not survive it, so none were
included rather than checked in corrupted.

They are all in the project's release packages (`freellmapi-pwa-dist.zip` /
`freellmapi-pwa-source.zip`). The PWA icons can also be regenerated from this
repo alone:

```bash
pip install pillow
python3 client/scripts/generate-pwa-icons.py
```

Vector versions of the app icon (`icon-any.svg`, `icon-maskable.svg`) are in
`client/public/icons/` and are referenced by the web app manifest, so the
installable app has working icons straight from this repository.

## Housekeeping

- The `pwa-upload` branch was a two-file diagnostic branch from setting this
  repo up; it can be deleted from the Branches page.
- This repo was created with a trailing hyphen in its name
  (`freellmapi-android-pwa-`). To rename it, use **Settings → General →
  Repository name** on GitHub.
