# Environment Configuration

## WordPress API Setup

Create a `.env.local` file in your blog directory with the following variables:

```env
# WordPress API Configuration
# Replace with your actual WordPress site URL
WORDPRESS_API_URL=https://yourblog.infinityfreeapp.com
NEXT_PUBLIC_WORDPRESS_API_URL=https://yourblog.infinityfreeapp.com

# JWT Secret Key (same as in wp-config.php)
WORDPRESS_JWT_SECRET=your-super-secret-jwt-key-here

# Optional: WordPress Admin Credentials (for authenticated requests)
# WORDPRESS_USERNAME=your_admin_username
# WORDPRESS_PASSWORD=your_admin_password

# Development Settings
NODE_ENV=development
```

## Steps to Configure:

1. **Set up WordPress** on InfinityFree following the guide in `wordpress-setup-guide.md`
2. **Get your WordPress URL** (e.g., `https://yourblog.infinityfreeapp.com`)
3. **Create `.env.local** in the blog directory
4. **Replace the URLs** with your actual WordPress site URL
5. **Add your JWT secret** (same one you put in wp-config.php)

## Testing the Connection:

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Visit your blog** at `http://localhost:3000`
3. **Check the browser console** for any API errors
4. **Test the API directly** by visiting:
   ```
   https://yourblog.infinityfreeapp.com/wp-json/wp/v2/posts?_embed
   ```

## Fallback Behavior:

- If WordPress API is not configured, the blog will use sample data
- This allows development without WordPress initially
- Once WordPress is set up, the blog will automatically switch to real content

## Security Notes:

- Never commit `.env.local` to version control
- Use strong, unique JWT secrets
- Keep WordPress admin credentials secure
- Regularly update WordPress and plugins 