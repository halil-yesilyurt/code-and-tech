# CodeAndTech Blog - WordPress Headless CMS

A modern, fast blog built with Next.js 15, TypeScript, and Tailwind CSS, powered by WordPress as a headless CMS.

## 🚀 Features

- **⚡ Lightning Fast**: Built with Next.js 15 and optimized for performance
- **📱 Responsive Design**: Beautiful, mobile-first design with Tailwind CSS
- **🔧 TypeScript**: Full type safety and better developer experience
- **📝 WordPress CMS**: Easy content management with WordPress backend
- **🔍 SEO Optimized**: Built-in SEO features and metadata
- **🎨 Modern UI**: Clean, professional design with smooth animations
- **📊 Analytics Ready**: Easy integration with analytics tools
- **🔒 Secure**: JWT authentication and security best practices

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   WordPress     │    │   Vercel        │
│   Frontend      │◄──►│   Headless CMS  │    │   Deployment    │
│                 │    │                 │    │                 │
│ • React 18      │    │ • REST API      │    │ • Edge Network  │
│ • TypeScript    │    │ • JWT Auth      │    │ • Auto Deploy   │
│ • Tailwind CSS  │    │ • Content Mgmt  │    │ • Analytics     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- WordPress hosting (InfinityFree recommended for free tier)
- Git

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd blog
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up WordPress:**
   - Follow the guide in `wordpress-setup-guide.md`
   - Install WordPress on InfinityFree or your preferred hosting
   - Configure essential plugins (JWT Auth, Security, etc.)

4. **Configure environment variables:**
   ```bash
   # Copy the example and update with your WordPress URL
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your WordPress configuration:
   ```env
   WORDPRESS_API_URL=https://yourblog.infinityfreeapp.com
   NEXT_PUBLIC_WORDPRESS_API_URL=https://yourblog.infinityfreeapp.com
   WORDPRESS_JWT_SECRET=your-super-secret-jwt-key-here
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
blog/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   └── posts/              # Blog posts
│   │       ├── page.tsx        # Posts listing
│   │       └── [slug]/         # Individual posts
│   │           └── page.tsx
│   └── lib/
│       └── wordpress.ts        # WordPress API utilities
├── public/                     # Static assets
├── wordpress-setup-guide.md    # WordPress setup instructions
├── env-config.md              # Environment configuration
└── package.json
```

## 🔧 WordPress Setup

### 1. Hosting Setup
- **InfinityFree** (Recommended for free tier)
- **000WebHost** (Alternative free option)
- **Paid hosting** (For production use)

### 2. Essential Plugins
- **JWT Authentication for WP REST API**
- **WPS Hide Login** (Security)
- **Wordfence Security** (Security)
- **Yoast SEO** (SEO optimization)

### 3. Configuration
- Set permalinks to "Post name"
- Configure JWT authentication
- Set up security measures
- Create sample content

See `wordpress-setup-guide.md` for detailed instructions.

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Connect your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Configure environment variables in Vercel:**
   ```
   WORDPRESS_API_URL=https://yourblog.infinityfreeapp.com
   WORDPRESS_JWT_SECRET=your-super-secret-jwt-key-here
   ```

### Other Platforms
- **Netlify**: Similar to Vercel
- **Railway**: Good for full-stack apps
- **DigitalOcean App Platform**: Scalable option

## 📝 Content Management

### Creating Posts
1. Log into your WordPress admin panel
2. Go to Posts → Add New
3. Write your content with the WordPress editor
4. Add featured images, categories, and tags
5. Publish or schedule the post

### Managing Content
- **Categories**: Organize posts by topic
- **Tags**: Add keywords for better SEO
- **Featured Images**: Add visual appeal
- **Excerpts**: Control post previews

## 🔍 SEO Features

- **Meta tags**: Automatic generation from WordPress
- **Open Graph**: Social media sharing
- **Twitter Cards**: Twitter sharing
- **Structured data**: Rich snippets
- **Sitemap**: Automatic generation
- **RSS feeds**: WordPress built-in

## 🎨 Customization

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Custom components**: Easy to modify
- **Responsive design**: Mobile-first approach
- **Dark mode**: Ready to implement

### Adding Features
- **Comments**: WordPress comments system
- **Search**: Full-text search
- **Newsletter**: Email integration
- **Analytics**: Google Analytics, Plausible, etc.

## 🔒 Security

### WordPress Security
- JWT authentication
- Hidden login URL
- Security plugins
- Regular updates
- Strong passwords

### Next.js Security
- Environment variables
- Input validation
- XSS protection
- CSRF protection

## 📊 Performance

### Optimizations
- **Static Generation**: Pre-rendered pages
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic optimization
- **Caching**: ISR and CDN caching
- **Bundle Analysis**: Built-in tools

### Monitoring
- **Core Web Vitals**: Performance metrics
- **Lighthouse**: SEO and performance
- **Vercel Analytics**: Real user metrics

## 🐛 Troubleshooting

### Common Issues

1. **WordPress API not accessible:**
   - Check if REST API is enabled
   - Verify WordPress URL is correct
   - Check for CORS issues

2. **Images not loading:**
   - Verify media URLs in WordPress
   - Check image permissions
   - Test direct image access

3. **Build errors:**
   - Check TypeScript errors
   - Verify environment variables
   - Clear Next.js cache

### Debug Mode
Enable debug mode in WordPress:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Next.js Team**: Amazing React framework
- **WordPress Community**: Robust CMS platform
- **Tailwind CSS**: Utility-first CSS framework
- **Vercel**: Excellent hosting platform

## 📞 Support

- **Issues**: Create GitHub issues
- **Documentation**: Check the guides in this repo
- **Community**: WordPress and Next.js communities

---

**Happy coding! 🚀**
