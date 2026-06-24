# GitHub Pages — deployment notes

## How this site deploys

- **One workflow only:** `.github/workflows/deploy.yml` ("Deploy site")
- **Publishing source:** GitHub Actions (Settings → Pages → Source: GitHub Actions)
- **Do not** add a second Pages workflow
- **Do not cancel** a running deploy — the CDN step can take **5–10 minutes** and looks stuck while it is working

## If deploy fails

1. Wait 10 minutes — do not push again or start another workflow
2. Re-run the failed workflow once from Actions → Deploy site → Re-run
3. Never cancel mid-flight; that wedges the Pages CDN queue

## Local preview

```bash
python3 -m http.server 8080
```

## Custom domain

See [CUSTOM_DOMAIN.md](./CUSTOM_DOMAIN.md).
