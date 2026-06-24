# GitHub Pages — deployment notes

## How this site deploys

- **One workflow only:** `.github/workflows/deploy.yml`
- **Publishing source:** GitHub Actions (Settings → Pages → Build and deployment → Source: GitHub Actions)
- **Do not** add a second Pages workflow
- **Do not** cancel a running deploy job mid-flight — it wedges the Pages CDN queue for ~30+ minutes

## If deploy gets stuck

1. Wait 10–15 minutes for the in-progress CDN deploy to finish or time out
2. Re-run the failed workflow from the Actions tab (do not start a second push)
3. If still blocked, cancel the wedged Pages deployment:
   ```bash
   gh api -X POST repos/atulmishra1996/atulmishra1996.github.io/pages/deployments/<PAGES_BUILD_VERSION>/cancel
   ```
   (`PAGES_BUILD_VERSION` is shown in the failed deploy log)

## Local preview

Open `index.html` in a browser, or:

```bash
python3 -m http.server 8080
```

## Custom domain

See [CUSTOM_DOMAIN.md](./CUSTOM_DOMAIN.md).
