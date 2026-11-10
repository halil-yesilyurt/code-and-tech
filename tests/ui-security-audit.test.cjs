const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = (file) => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const homepage = read('src/app/page.tsx');
const slider = read('src/app/components/FeaturedStoriesSlider.tsx');
const header = read('src/app/components/Header.tsx');
const globalStyles = read('src/app/globals.css');
const articleStyles = read('src/app/blog/editorial.css');
const favicon = read('public/favicon-code.svg');
const contact = read('src/app/contact/page.tsx');
const social = read('src/app/components/SocialMediaLinks.tsx');
const sanitizer = read('src/lib/sanitize.ts');
const metadata = read('src/app/layout.tsx');
const sitemap = read('src/app/sitemap.xml/route.ts');
const config = read('next.config.ts');
const dependencies = JSON.parse(read('package.json'));
const lock = JSON.parse(read('package-lock.json'));

assert(homepage.includes('FeaturedStoriesSlider') && homepage.includes('posts.slice(6)'), 'Carousel and archive slices should not repeat stories');
assert(slider.includes('prefers-reduced-motion') && slider.includes('document.hidden') && slider.includes('onFocusCapture'), 'Auto carousel must pause responsibly');
assert(header.includes('hidden md:flex items-center') && header.includes('className="block px-4 py-3'), 'Search belongs inside tablet/mobile menu');
assert(globalStyles.includes(':focus:not(:focus-visible)') && globalStyles.includes('outline: 2px solid #8fcfae'), 'Keep keyboard focus, remove blue click outline');
assert(articleStyles.includes('top: 72px') && articleStyles.includes('.ct-reading-progress { display: none; }'), 'No green stripe atop mobile pages');
assert(favicon.includes('#8FCFAE') && favicon.includes('#0B1220'), 'Favicon must follow site branding');
assert(!contact.includes('hi@halilyesilyurt.com') && contact.includes('linkedin.com'), 'Contact page must not expose the former public mailbox');
assert(!social.includes('mailto:hi@halilyesilyurt.com'), 'Shared footer/contact icons must not leak mailbox');
for (const name of ['terms', 'privacy-policy', 'cookie-policy']) {
  assert(read(`src/app/${name}/page.tsx`).includes('href="/contact"'), name + ' must link to contact instead of exposing email');
}
assert(sanitizer.includes('escapeHtml(html)') && !sanitizer.includes('Fallback: basic sanitization'), 'Sanitizer must fail closed');
assert(metadata.includes('/favicon-code.svg?v=2'), 'Favicon version should refresh browser cache');
assert(sitemap.includes("'interviews'") && sitemap.includes('/category/'), 'Sitemap should list key navigable routes');
assert(read('src/app/search/page.tsx').includes('robots: { index: false, follow: true }'), 'Search result pages should not be indexed');
for (const key of ['X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy', 'Permissions-Policy', 'Strict-Transport-Security']) {
  assert(config.includes(key), 'Missing header: ' + key);
}
for (const name of ['next', 'react', 'react-dom', 'dompurify']) {
  assert.equal(lock.packages[''].dependencies[name], dependencies.dependencies[name], name + ' does not match lockfile');
}
assert(dependencies.dependencies.next === '16.4.6', 'Next.js must use current security-patched release');
assert(!fs.existsSync(path.join(__dirname, '../.github/workflows/refresh-security-lock.yml')), 'One-shot workflow must be cleaned up');
console.log('UI / SEO / security audit contracts passed');
