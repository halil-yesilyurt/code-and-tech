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

## Readiness audit (2026-11-05)

- Preview deployment at original recovery head `575c0db` was READY. The archive's 45 posts render under `/blog/{slug}` (sample checked: `kotlin-on-the-backend-the-jetbrains-spring-alliance`) and `/blog?page=2` responds HTTP 200. This preview preceded the canonical-link patch; retest the final head.
- `/blog`, homepage cards, recommendations, slider, category and search references previously linked to legacy `/{slug}` aliases; internal hrefs have now been updated to `/blog/{slug}`. Existing legacy aliases still return HTTP 200 with canonical pointing to `/blog/{slug}`; evaluate 308 redirects separately to prevent duplicate crawl paths.
- **All 45 posts lack featured-image source files.** The backup contained no uploads, so no original artwork can be claimed restored; the article view hides missing hero media and the metadata uses the existing generic fallback.
- HTML audit: **34/45** contain inherited `model-response-message` wrapper IDs; the sanitizer removes unsafe elements, but these imported posts have **not been editorially rewritten or independently fact-checked**.
- Duplicate headline: `the-command-line-is-talking-back-ai-powered-clis` and `the-command-line-is-talking-back-ai-powered-clis-2`. Preserve both historical slugs until a reviewed editorial decision identifies whether consolidation is appropriate.
- The archive contains **109 content hyperlinks**, including **53** pointing to the old `code-and-tech.vercel.app` hostname and **22** pointing to the `www.halilyesilyurt.com` portfolio. Do not blindly rewrite cross-site links; validate targets and redirects.
- No images are embedded in recovered post HTML. Seven formerly scheduled posts remain excluded. The Dec 2025 SQL backup does not prove that no newer articles were published afterward.
- `main` received Code & Tech [PR #40](https://github.com/halil-yesilyurt/code-and-tech/pull/40) after this recovery branch started. Merge must preserve its public sitemap and canonical fixes; the 45 articles should increase the sitemap post count, not reinstate 404/fragment entries.
- **Hold publication** until final-head preview and source tests pass, broken links and editorial quality are reviewed, and the missing artwork decision is explicit.

## Final-head preview verification

- Recovery commit `82084269761c6d97ae2ad444d88a793ef722693e` built to Vercel **READY**: deployment `dpl_4hhYb6EwnqNchcdYReFzgXjAKHxb`. The build executed `npm run test:recovery` and passed the 45-post, canonical-link and preservation assertions before Next.js compiled.
- An earlier attempt for the same intermediate build encountered the known intermittent Next 16 Turbopack `next/font/google queries have exactly one entry` error; an exact-SHA retry succeeded, without code changes. Avoid attributing that particular failure to imported content.
- All **45/45** recovered `/blog/{slug}` URLs returned **HTTP 200**, had a visible H1, their own canonical and no HTML robots noindex during preview sampling. Preview URLs intentionally have an HTTP `X-Robots-Tag: noindex`; this header is not evidence that production content would be blocked.
- Verified legacy same-site article links are changed **at render time only**: for the Kotlin article, `href="https://code-and-tech.vercel.app/the-ai-infused-terminal-coding-in-a-single-workspace"` now renders as `href="/blog/the-ai-infused-terminal-coding-in-a-single-workspace"`. The original JSON archive remains untouched.
- Because this branch predates Code & Tech PR #40, its preview sitemap includes earlier obsolete fragments and its blog-archive canonical inherits the homepage; **do not publish this branch as-is**. Merge on top of current main only while retaining PR #40's 11 valid static+sample URL sitemap structure; with the restored archive, the expected total is 8 static + 45 restored post URLs = 53, subject to live verification.
- Current production continues serving sample content. The recovery PR remains **Draft/unmerged** pending original media recovery or accepted placeholders and editorial acceptance of historic articles.
