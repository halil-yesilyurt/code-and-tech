const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = (file) => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const projectsPage = read('src/app/projects/page.tsx');
const projects = read('src/app/projects/ProjectsClient.tsx');
const filters = read('src/app/components/ProjectFilters.tsx');
const interviews = read('src/app/interviews/page.tsx');
const interviewsAlias = read('src/app/interview/page.tsx');
const interviewGrid = read('src/app/components/InterviewArticlesGrid.tsx');
const categories = read('src/app/categories/page.tsx');
const category = read('src/app/category/[slug]/page.tsx');
const search = read('src/app/search/page.tsx');
const contact = read('src/app/contact/page.tsx');
const dynamic = read('src/app/[slug]/page.tsx');
const shell = read('src/app/components/EditorialPageShell.tsx');
const theme = read('src/app/phase3.css');
const posts = JSON.parse(read('src/content/recovered-posts.json'));
const taxonomy = JSON.parse(read('src/content/recovered-taxonomies.json'));

assert.equal(posts.length, 45, 'Original article content must remain intact');
assert(taxonomy.categories.some((item) => item.name.toLowerCase().includes('interview')), 'Interview taxonomy must still exist');
assert(projectsPage.includes("getProjects()") && projectsPage.includes("getCategories()"), 'Project data adapter must remain unchanged');
assert(projects.includes('ProjectFilters') && projects.includes('ProjectImage'), 'Keep project filters and live cards');
assert(projects.includes('setFiltersKey') && projects.includes('key={filtersKey}'), 'Reset filters must clear the actual control state');
assert(filters.includes('onFilterChange(filtered)'), 'Technology and text filter behavior remains intact');
assert(interviews.includes("decodeHtmlEntities(category.name).toLowerCase().includes('interview')"), 'Preserve interview category membership');
assert(interviewGrid.includes('setVisible') && interviewGrid.includes('EditorialPostGrid'), 'Interview load more must work');
assert(interviewsAlias.includes("from '../interviews/page'"), 'The old /interview route must stay accessible');
assert(categories.includes('category.parent') && categories.includes('CategoryBranch'), 'Preserve taxonomy hierarchy and child links');
assert(categories.includes('/category/${category.slug}'), 'Taxonomy links should be canonical');
assert(category.includes('if (!category) notFound()'), 'Unknown categories still return 404');
assert(category.includes('post.categories?.includes(category.id)'), 'Category pages only show relevant posts');
assert(search.includes('searchPosts(query, 1, 100)'), 'Search must fetch matches before paginating');
assert(search.includes('filtered.slice((currentPage - 1) * perPage'), 'Search pagination must operate after filters');
assert(search.includes('SearchBarWithAutocomplete') && search.includes('SearchFilters') && search.includes('SearchPagination'), 'Search controls are preserved');
assert(contact.includes('https://www.linkedin.com/in/halilyesilyurt/') && contact.includes('SocialMediaLinks'), 'Keep a functional contact channel without exposing a mailbox');
assert(!contact.includes('hi@halilyesilyurt.com'), 'Do not publish the personal mailbox');
assert(shell.includes('ct-editorial-page ct-phase3'), 'All remaining pages must opt into shared styling');
assert(shell.includes("import '../blog/editorial.css'"), 'Reuse existing editorial design tokens');
assert(theme.includes('.ct-phase3') && !theme.includes('body {'), 'No unintended global style reset');
assert(dynamic.includes('permanentRedirect(`/blog/${slug}`)'), 'Legacy root-slug post redirect remains intact');
assert(dynamic.includes('sanitizeHtml(content.content.rendered)'), 'Legacy WordPress pages retain HTML sanitization');
assert(dynamic.includes('ct-p3-dynamic'), 'Legacy WordPress pages receive the new scoped shell');
for (const legalPage of ['privacy-policy', 'cookie-policy', 'terms']) {
  const source = read(`src/app/${legalPage}/page.tsx`);
  assert(source.includes('ct-editorial-page ct-phase3 ct-p3-legal'), legalPage + ': page must match the shared palette');
  assert(source.includes('href="/contact"'), legalPage + ': contact path must remain available');
  assert(source.includes('export const metadata'), legalPage + ': preserve canonical metadata');
}
const notFound = read('src/app/not-found.tsx');
assert(notFound.includes('ct-p3-not-found') && notFound.includes('href="/"'), '404 must be branded and link back to home');
assert(!notFound.includes('from-blue-600 to-purple-600'), 'Old mismatched gradient must not return');
assert(theme.includes('.ct-p3-legal main') && theme.includes('.ct-p3-not-found'), 'Auxiliary pages need scoped styles');

console.log('Phase 3 contract passed: existing content, filters, routes, and scoped design preserved');
