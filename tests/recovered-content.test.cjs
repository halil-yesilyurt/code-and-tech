const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/content/recovered-posts.json'), 'utf8'));
const tax = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/content/recovered-taxonomies.json'), 'utf8'));
assert.equal(posts.length, 45);
assert.equal(new Set(posts.map(post => post.slug)).size, posts.length);
assert(posts.every(post => post.status === 'publish' && post.content.rendered.trim() && post.slug));
assert(posts.every(post => post.link === 'https://code-and-tech.halilyesilyurt.com/blog/' + post.slug));
assert(posts.every(post => !['Hello world!', 'Sample Page'].includes(post.title.rendered)));
assert(tax.categories.length > 0 && tax.tags.length > 0);
console.log('Recovery data contract passed: 45 published posts and taxonomies');

const sourceFiles = [
  'src/app/blog/BlogPostList.tsx',
  'src/app/blog/FeaturedPosts.tsx',
  'src/app/components/HeroSlider.tsx',
  'src/app/components/Sidebar.tsx',
  'src/app/components/BlogPostLayout.tsx',
  'src/app/components/ArticleCard.tsx',
  'src/app/components/LatestArticlesList.tsx',
  'src/app/components/InterviewArticlesGrid.tsx',
  'src/app/category/[slug]/page.tsx',
  'src/app/[slug]/page.tsx',
  'src/app/search/page.tsx',
  'src/app/api/search/suggestions/route.ts',
];
for (const file of sourceFiles) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  assert(!source.includes('href={`/${post.slug}`}') && !source.includes('href={`/${p.slug}`}'),
    file + ': article links must use canonical /blog/slug URLs');
  assert(!source.includes("linkBase='/'") && !source.includes('linkBase="/"'),
    file + ': article cards must not target the legacy root slug');
  assert(!source.includes('url: `/${post.slug}`'),
    file + ': search suggestion must use canonical article URL');
}
const missingMedia = posts.filter(post => !post._embedded?.['wp:featuredmedia']?.length);
assert.equal(missingMedia.length, 45, 'Archive has no restored featured-media assets; do not claim image coverage');
console.log('Canonical internal-link contract passed; all 45 featured images remain unverified');

const wordpressSource = fs.readFileSync(path.join(__dirname, '../src/lib/wordpress.ts'), 'utf8');
assert(wordpressSource.includes('function withCanonicalArticleLinks(post: WordPressPost)'),
  'Old same-site archive links must be normalized at render time');
assert(wordpressSource.includes('archiveSlugs.has(slug)'),
  'Only known recovered article slugs may be rewritten');
assert(wordpressSource.includes("prefix + '/blog/' + slug + quote"),
  'Recovered links must point to the canonical blog route');
assert(wordpressSource.includes('.map(withCanonicalArticleLinks)'),
  'Archive listing and search must apply render-time link normalization');
assert(posts.some(post => post.content.rendered.includes('https://code-and-tech.vercel.app/')),
  'The original source archive must remain preserved without in-place rewrites');
console.log('Legacy link normalization contract passed, original backup preserved');

// Previously published root-slug aliases must not serve duplicate indexable pages.
const legacyRoute = fs.readFileSync(path.join(__dirname, '../src/app/[slug]/page.tsx'), 'utf8');
assert(legacyRoute.includes("import { notFound, permanentRedirect } from 'next/navigation'"));
assert(legacyRoute.includes('permanentRedirect(`/blog/${slug}`)'), 'Legacy article routes must redirect permanently to the canonical URL');
assert(legacyRoute.indexOf('permanentRedirect(`/blog/${slug}`)') < legacyRoute.indexOf('  try {'), 'Redirect must occur outside catch that converts Next.js control flow to 404');
console.log('Legacy root-slug redirect contract passed');
