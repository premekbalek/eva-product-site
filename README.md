# EVA Product Site

Standalone product presentation for EVA, an AI Banking Service Hub.

This is intentionally independent from PremekWiki. It is a static frontend with:

- corporate landing page
- customer-facing knowledge base
- technical solution section
- demo product chat seeded with EVA knowledge

## Run locally

```bash
python3 -m http.server 5180
```

Then open:

```text
http://localhost:5180/
```

## Publish with GitHub Pages

1. Create a new GitHub repository, for example `eva-product-site`.
2. Push this folder to the repository.
3. In GitHub, open `Settings` -> `Pages`.
4. Set source to `Deploy from a branch`.
5. Select branch `main` and folder `/root`.
6. Save.

The site will be available at:

```text
https://<your-github-username>.github.io/eva-product-site/
```

This project is plain HTML/CSS/JS and is already compatible with GitHub Pages.
