/**
 * Allowlisted WordPress HTML sanitization.
 * Fail closed if the sanitizer is missing: never serve regex-cleaned markup.
 */
const sanitizeConfig = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre', 'span',
    'div', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'hr',
  ],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
};

function escapeHtml(html: string): string {
  return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function sanitizeHtml(html: string): string {
  if (!html) return '';
  try {
    if (typeof window === 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { JSDOM } = require('jsdom');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const createDOMPurify = require('dompurify');
      const virtualWindow = new JSDOM('').window;
      return createDOMPurify(virtualWindow as unknown as Window).sanitize(html, sanitizeConfig);
    }
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('dompurify').sanitize(html, sanitizeConfig);
  } catch (error) {
    console.error('HTML sanitization unavailable:', error);
    return escapeHtml(html);
  }
}
