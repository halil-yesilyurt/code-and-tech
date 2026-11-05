'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = p => fs.readFileSync(path.resolve(__dirname, '..', p), 'utf8');

test('public sitemap excludes known 404, noindex and fragment URL types', () => {
  const src = read('src/app/sitemap.xml/route.ts');
  assert.ok(!src.includes("'admin/views'"), 'Admin 404 must not be in sitemap');
  assert.ok(!src.includes("'search'"), 'Internal search should not be in sitemap');
  assert.ok(!src.includes('/projects#'), 'Fragment identifiers are not independent crawlable project pages');
  assert.ok(!src.includes('getCategories'), 'Noindexed category-detail pages must not be submitted');
  assert.ok(src.includes('...posts.map('), 'Published blog content remains included');
  assert.ok(src.includes("'blog'") && src.includes("'categories'"), 'Public archives stay included');
});

test('indexable blog and category archives have self canonicals', () => {
  const blog = read('src/app/blog/page.tsx');
  const categories = read('src/app/categories/page.tsx');
  assert.ok(blog.includes("alternates: { canonical: 'https://code-and-tech.halilyesilyurt.com/blog' }"));
  assert.ok(categories.includes("alternates: { canonical: 'https://code-and-tech.halilyesilyurt.com/categories' }"));
});
