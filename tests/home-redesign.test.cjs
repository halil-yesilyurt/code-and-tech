const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = (file) => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const page = read('src/app/page.tsx');
const cards = read('src/app/components/HomePostList.tsx');
const css = read('src/app/home.css');
const header = read('src/app/components/Header.tsx');
const footer = read('src/app/components/Footer.tsx');
const posts = JSON.parse(read('src/content/recovered-posts.json'));

assert(posts.length > 0, 'Homepage needs the recovered articles');
assert(page.includes('getPosts(1, 20)'), 'Homepage must use the existing article source');
assert(page.includes('getCategories()'), 'Homepage topics must use actual categories');
assert(!page.includes('Math.random()') && !page.includes('HeroSlider'), 'Featured stories must not reshuffle or autoplay');
assert(page.includes('posts.slice(3)'), 'Latest articles should not repeat the three featured stories');
assert(page.includes('/blog/${lead.slug}') && page.includes('/blog/${post.slug}'), 'Featured links need canonical blog routes');
assert(cards.includes('/blog/${post.slug}'), 'Latest cards need canonical blog routes');
assert(cards.includes('setVisible'), 'Show more should remain interactive');
assert(css.includes('body:has(.ct-home)'), 'Page theme must not bleed into other routes');
assert(css.includes('--ct-accent: #8fcfae'), 'The selected sage palette should be defined once');
assert(header.includes('ct-site-header') && footer.includes('ct-site-footer'), 'Shell styling needs homepage-only hooks');
assert(!page.includes('getFeaturedImageUrl'), 'Recovered articles have no verified featured media');
console.log('Home redesign contract passed: scoped theme, real posts, canonical links, deterministic features');
