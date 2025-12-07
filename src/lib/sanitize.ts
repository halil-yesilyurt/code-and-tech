/**
 * HTML Sanitization Utility
 * Provides safe HTML sanitization for both server and client-side rendering
 */

const sanitizeConfig = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre', 'span',
    'div', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'hr'
  ],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * Works in both server-side and client-side environments
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  // Server-side (Node.js)
  if (typeof window === 'undefined') {
    try {
      // Use require() to avoid Next.js bundling issues with jsdom
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { JSDOM } = require('jsdom');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const createDOMPurify = require('dompurify');
      const window = new JSDOM('').window;
      const DOMPurify = createDOMPurify(window as unknown as Window);
      return DOMPurify.sanitize(html, sanitizeConfig);
    } catch (error) {
      // Fallback: basic sanitization if DOMPurify fails
      return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/javascript:/gi, '');
    }
  }

  // Client-side (Browser)
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const DOMPurify = require('dompurify');
    return DOMPurify.sanitize(html, sanitizeConfig);
  } catch (error) {
    // Fallback: basic sanitization
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '');
  }
}
