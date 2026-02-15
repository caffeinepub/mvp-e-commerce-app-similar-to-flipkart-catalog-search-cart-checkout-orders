# Specification

## Summary
**Goal:** Make Buyflow accessible via a shareable public URL and add basic SEO/discoverability support for search engines.

**Planned changes:**
- Add static `robots.txt` (allow crawling) served from `/robots.txt`.
- Add static `sitemap.xml` served from `/sitemap.xml` listing main routes (at least `/` and `/products`).
- Improve the HTML entry point metadata with an English meta description, canonical URL support, and Open Graph tags (title, description, url) using Buyflow branding.
- Add a simple in-app UI location that displays the current public site URL (`window.location.origin`) and provides a one-click “Copy URL” action with an English success message.
- Add an in-app English help section explaining discoverability steps (including submitting the URL to Google Search Console) and clarifying custom domain/DNS setup is external to the app.

**User-visible outcome:** Users can see and copy the app’s current public URL from within Buyflow, and the deployed site exposes basic SEO files/metadata so search engines and link previews can better index and represent the site.
