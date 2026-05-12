# james.spry-leverton.com

Personal site of James Spry-Leverton.

A single static page, no build step. The original 2014 incarnation lives in `git log` before commit `8a19b65`.

## Layout

```
index.html       Single page (bio, social icons, canvas mount).
style.css        Styles. Railscast-derived dark palette + self-hosted Fraunces.
wallpaper.js    Triangle canvas wallpaper (vanilla ES module).
assets/         Favicons, apple-touch icons, fraunces.woff2.
manifest.json   Web app manifest.
robots.txt
sitemap.xml
deploy/         AWS setup scripts + CI/CD config. See deploy/README.md.
.github/workflows/deploy.yml   GitHub Actions deploy on push to main.
```

## Local dev

There's no build. Serve the directory with any static server:

```bash
python3 -m http.server 8765
```

## Deploy

Pushes to `main` trigger `.github/workflows/deploy.yml` which syncs
to S3 and invalidates CloudFront. First-time AWS setup is in
[`deploy/README.md`](deploy/README.md).
