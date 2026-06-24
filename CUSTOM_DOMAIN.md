# Custom domain for your portfolio

Your site is live at **https://atulmishra1996.github.io/** by default.

To use a custom domain (e.g. `atulmishra.dev`):

## 1. Add a CNAME file

Create a file named `CNAME` in the repo root with **only** your domain:

```
yourdomain.com
```

Commit and push. GitHub Pages will serve the site from that domain.

## 2. Configure DNS at your registrar

For apex domain (`yourdomain.com`):

| Type | Name | Value |
|------|------|-------|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

For `www`:

| Type | Name | Value |
|------|------|-------|
| CNAME | `www` | `atulmishra1996.github.io` |

## 3. Enable in GitHub

Repo → **Settings** → **Pages** → **Custom domain** → enter your domain → **Save**.

Enable **Enforce HTTPS** once DNS propagates (can take up to 24 hours).

## 4. Remove custom domain

Delete the `CNAME` file and clear the custom domain in GitHub Pages settings.
