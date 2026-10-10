# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio site for Nicolás Tovar ("Niko"), served by GitHub Pages at the custom domain in `CNAME` (`nikotov.dev`). It's a Jekyll site that GitHub Pages builds on every push to `main`, so pushing to `main` publishes. There's no bundler, linter or test suite, and nothing is committed pre-built.

Do redesign or other large work on a branch and merge to `main` only when it's ready to go live.

### Local preview

`Gemfile` pins the `github-pages` gem, so a local build matches GitHub's:

```sh
bundle install && bundle exec jekyll serve      # http://localhost:4000
```

Without Ruby/Bundler, the same build runs in Docker:

```sh
docker run --rm -u $(id -u):$(id -g) -e HOME=/tmp -e BUNDLE_PATH=/srv/.bundle \
  -v "$PWD":/srv -w /srv -p 4000:4000 ruby:3.3 \
  sh -c 'bundle install && bundle exec jekyll serve --host 0.0.0.0'
```

`_site/`, `.bundle/` and `Gemfile.lock` are git-ignored.

## Architecture

- **Config** (`_config.yml`) is the single source of truth for the name, email, address, university, profile URLs and integrations. Templates read `site.author.name`, `site.author.full_name`, `site.author.university.name`, `site.email`, `site.github_url`, etc. rather than hard-coding them; print the location with `{% include location.html %}` (built from `site.address`). Integrations are turned on by filling in a value:
  - `formspree_id`: the contact form posts to Formspree. When it's empty, `js/contact.js` falls back to a pre-filled `mailto:`.
  - `itch.url` and `itch.embed_*`: the "Play on itch.io" button and the itch.io embed under the Get Otter Here! spotlight.
  - `cv`: the "Download CV" button on About.
  - `webmaster_verifications`: Search Console and Bing verification meta tags.
- **Layout**: every page uses `_layouts/default.html` (applied through `defaults` in `_config.yml`). It renders the `<head>`, the header, `<main>` and the footer. Pages hold only front matter plus their own content.
  - Front matter keys the layout reads: `title`, `description` (both required on every page except `index.html`, which uses `site.title`, `site.tagline` and `site.description`; keep descriptions under 160 characters), `css` (loads `css/<css>.css`), `scripts` (list of JS files, loaded with `defer`), `image` (OG image), `preload_image` (`file`, `widths` and `sizes` of an above-the-fold image to preload), `signature_font`, `schema`, `nav_title`, `noindex`.
- **Includes** (`_includes/`):
  - `header.html` and `footer.html`. Nav items come from `_data/nav.yml`, and the current page gets `aria-current="page"`.
  - `social-links.html`.
  - `logo.svg`: the logo, inlined with `fill="currentColor"`. This is the only copy of the logo; `resources/favicon.svg` and the share images were made from it.
  - `icon.html`: inline SVG icons by name, e.g. `{% include icon.html name="github" %}`. Add new icons there; there's no icon font.
  - `project-spotlight.html`: one Projects page spotlight, rendered from an entry in `_data/projects.yml`.
  - `srcset.html`: builds `srcset` candidates (through `relative_url`) for an image's WebP sizes.
  - `location.html` and `timeline.html`.
  - `schema.html`: JSON-LD for Person, breadcrumbs, the projects list and the image gallery.
- **Data** (`_data/`): `projects.yml` (Projects page spotlights, home cards and Projects JSON-LD), `gallery.yml` (Gallery page, home photo strip and Gallery JSON-LD), `skills.yml`, `timeline.yml` (About), `nav.yml`. Content that appears in more than one place belongs here. Escape data used inside HTML attributes (`alt="{{ photo.alt | escape }}"`).
- **URLs**: pages keep their original filenames but publish at clean permalinks: `aboutme.html` → `/about/`, plus `/projects/`, `/gallery/` and `/contact/`. Each page's `redirect_from` (`jekyll-redirect-from`) keeps the old `.html` URLs working. Link internally with `{{ '/about/' | relative_url }}`.
- **SEO**:
  - `jekyll-seo-tag` (`{% seo %}` in the layout) outputs the title, description, canonical, Open Graph and Twitter tags.
  - `jekyll-sitemap` builds `sitemap.xml`. `robots.txt` points to it.
  - Pages with `noindex: true` (like `404.html`) get a robots `noindex` tag and are left out of the sitemap via `sitemap: false`.
- **CSS**: `css/base.css` holds the design tokens on `:root` and every shared component.
  - Tokens: `--bg`, `--surface`, `--text`, `--text-muted`, `--accent` for text on dark, `--accent-deep` for fills behind white text, `--game`, `--crm`, `--container`, `--gutter`, `--stripes`.
  - Components: header, nav, footer, `.btn` variants, `.card`, `.chips`, `.eyebrow`, `.page-title` with `.stripes`, and `.shot`.
  - Per-project accents: a `.spot-game` or `.spot-crm` class sets `--spot`, which eyebrows, chips and `.btn--spot` pick up.
  - Page files (`home.css`, `aboutme.css`, `projects.css`, `gallery.css`, `contact.css`) only add layout for their own page. The site is dark-only.
- **JavaScript**: `js/gallery.js` is the `<dialog>` lightbox; without JS, photos are plain links to their large versions. `js/contact.js` handles the form submit (Formspree or the mailto fallback). There are no frameworks and no CDN scripts.
- **Images**: web images live in `resources/img/` as WebP, named `<descriptive-name>-<long-edge>.webp`.
  - Create them with `scripts/optimize-images.sh <source> <name> <size>...`, which prints the real pixel sizes for `width`/`height` attributes and `_data/gallery.yml`.
  - Gallery photos need `-800` and `-1600` versions. Every `<img>` needs `alt`, `width` and `height`, and `loading="lazy"` unless it's in the first screen.
  - Keep full-size originals outside the repo.
  - `resources/` also holds `favicon.svg`, `apple-touch-icon.png` and the 1200×630 `og-*.jpg` share images.
