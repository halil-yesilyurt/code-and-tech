                                                                                                                                                                                                                                                               # WordPress Setup Guide for Headless Blog

## Step 1: WordPress Installation ✅

- [ ] Install WordPress on InfinityFree
- [ ] Note your WordPress URL (e.g., `https://yourblog.infinityfreeapp.com`)
- [ ] Access WordPress admin panel

## Step 2: Essential Plugins Installation

### 1. JWT Authentication for WP REST API

1. Go to WordPress Admin → Plugins → Add New
2. Search for "JWT Authentication for WP REST API"
3. Install and activate the plugin
4. **Important:** Add this to your `wp-config.php` file:
   ```php
   define('JWT_AUTH_SECRET_KEY', 'your-super-secret-jwt-key-here');
   define('JWT_AUTH_CORS_ENABLE', true);
   ```

### 2. WPS Hide Login

1. Go to Plugins → Add New
2. Search for "WPS Hide Login"
3. Install and activate
4. Go to Settings → WPS Hide Login
5. Change login URL to something obscure (e.g., `/my-secret-login`)
6. **Save the new login URL!**

### 3. Wordfence Security

1. Go to Plugins → Add New
2. Search for "Wordfence Security"
3. Install and activate
4. Run initial security scan
5. Configure basic firewall settings

## Step 3: WordPress Configuration

### Set Permalinks

1. Go to Settings → Permalinks
2. Select "Post name" (important for SEO)
3. Save Changes

### Disable XML-RPC (Security)

Add this to your `wp-config.php`:

```php
// Disable XML-RPC for security
define('XMLRPC_ENABLED', false);
```

## Step 4: Test WordPress REST API

### Test Public Endpoints

Visit these URLs in your browser to test:

1. **All Posts:** `https://yourblog.infinityfreeapp.com/wp-json/wp/v2/posts`
2. **Posts with Embedded Content:** `https://yourblog.infinityfreeapp.com/wp-json/wp/v2/posts?_embed`
3. **Categories:** `https://yourblog.infinityfreeapp.com/wp-json/wp/v2/categories`
4. **Tags:** `https://yourblog.infinityfreeapp.com/wp-json/wp/v2/tags`

### Test JWT Authentication

1. Go to: `https://yourblog.infinityfreeapp.com/wp-json/jwt-auth/v1/token`
2. Use POST method with your WordPress credentials
3. You should receive a JWT token

## Step 5: Create Sample Content

### Add Some Test Posts

1. Go to Posts → Add New
2. Create 2-3 test posts with:
   - Different titles
   - Featured images (optional)
   - Categories and tags
   - Excerpts
3. Publish the posts

### Test API with Real Content

Visit: `https://yourblog.infinityfreeapp.com/wp-json/wp/v2/posts?_embed`
You should see your posts in JSON format.

## Step 6: Next.js Integration

### Environment Variables

Create `.env.local` in your blog directory:

```env
WORDPRESS_API_URL=https://yourblog.infinityfreeapp.com
NEXT_PUBLIC_WORDPRESS_API_URL=https://yourblog.infinityfreeapp.com
WORDPRESS_JWT_SECRET=your-super-secret-jwt-key-here
```

### Test Connection

1. Update your Next.js code to use WordPress API
2. Test that posts load from WordPress
3. Verify images and content display correctly

## Security Checklist ✅

- [ ] JWT Authentication enabled
- [ ] Login URL changed
- [ ] XML-RPC disabled
- [ ] Wordfence Security active
- [ ] Strong passwords set
- [ ] Regular backups enabled

## Troubleshooting

### Common Issues:

1. **API not accessible:** Check if REST API is enabled
2. **CORS errors:** Verify JWT_AUTH_CORS_ENABLE is set
3. **Images not loading:** Check WordPress media URLs
4. **Authentication fails:** Verify JWT secret key

### Useful WordPress URLs:

- **Admin Login:** `https://yourblog.infinityfreeapp.com/my-secret-login`
- **REST API:** `https://yourblog.infinityfreeapp.com/wp-json/`
- **Posts API:** `https://yourblog.infinityfreeapp.com/wp-json/wp/v2/posts`

## Next Steps

1. ✅ Set up WordPress
2. ✅ Install and configure plugins
3. ✅ Test API endpoints
4. 🔄 Connect Next.js to WordPress
5. 🔄 Deploy to Vercel
6. 🔄 Set up automated rebuilds

Potential Problems with Headless WordPress CMS
Authentication for Editing: By default, only public content is available. For editing, you need secure authentication.
Previewing Drafts: Previewing unpublished content requires extra setup.
Media Handling: Images and media URLs may need special handling for optimization.
SEO: You must ensure meta tags, sitemaps, etc., are handled in Next.js.
Plugin Compatibility: Some WordPress plugins only work with traditional themes, not headless setups.
CORS Issues: If not configured, your frontend may not be able to fetch data from WordPress.
Build/Cache Invalidation: If you statically generate pages, you need to revalidate or rebuild when new content is published.
