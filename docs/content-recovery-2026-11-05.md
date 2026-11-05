# Code & Tech WordPress content recovery

Source: user-provided InfinityFree phpMyAdmin SQL backup created Dec 5, 2025.

- Restored **45** published posts retaining HTML body, title, slug, post dates and taxonomy relationships.
- Excluded **7** records with original status `future` and **71** revisions; do not publish without editorial approval.
- Included 31 used categories and 314 used tags.
- Did not commit SQL, configuration, database user accounts, passwords, or personal data.
- Source cPanel archive contains zero media files under `htdocs/wp-content/uploads/`; featured image restoration remains blocked.
- Archived posts may reference dead remote images or links, and were not editorially verified.
- WordPress functions now read committed JSON in the Next.js repo instead of fetching the removed VPS backend.
- Before publishing: run `node tests/recovered-content.test.cjs`, `npm ci`, `npm run build`, and test pagination, routes, sitemap, imagery and canonical metadata. No deployment, merging or indexing outcome is claimed.
