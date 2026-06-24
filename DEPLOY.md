# GitHub Pages — deployment notes

## How this site deploys

- **Legacy branch deploy** from `main` (Settings → Pages → Source: Deploy from a branch → `main` / root)
- **One built-in workflow only:** `pages-build-deployment` (automatic on every push)
- **No custom Actions workflow** — a second deploy pipeline causes CDN lock-ups and stuck runs
- **Never cancel** a running `pages-build-deployment` mid-flight

## If deploy fails or looks stuck

1. Wait 5–10 minutes — CDN deploys can take several minutes after conflicts
2. Check status: `gh api repos/atulmishra1996/atulmishra1996.github.io/pages --jq '.status'`
3. Re-trigger one build only: `gh api -X POST repos/atulmishra1996/atulmishra1996.github.io/pages/builds`
4. Do **not** push again or start a second workflow while one is in progress

## Local preview

Open `index.html` in a browser, or:

```bash
python3 -m http.server 8080
```

## Custom domain

See [CUSTOM_DOMAIN.md](./CUSTOM_DOMAIN.md).
