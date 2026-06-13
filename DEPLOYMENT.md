# FM-Lead Site - Deployment Guide

## Fixes Applied

### 1. Removed Duplicate CSS Configuration
- **Issue**: The `custom_CSS` parameter in `hugo.toml` was redundant because the Blowfish theme already loads `assets/css/custom.css` automatically.
- **Fix**: Removed the `custom_CSS = ["css/custom.css"]` line from the `[params]` section in `hugo.toml`.

### 2. Added Netlify Deployment Configuration
- **Issue**: No deployment configuration file existed for Netlify.
- **Fix**: Created `netlify.toml` with:
  - Hugo version specification (0.155.3)
  - Build command with garbage collection and minification
  - Security headers
  - Cache control headers for static assets
  - Environment-specific build configurations

## Build & Deployment

### Local Development
```bash
# Start development server
hugo server -D

# Build for production
hugo --gc --minify
```

### Deploy to Netlify
1. Push your changes to your Git repository
2. Connect your repository to Netlify
3. Netlify will automatically use the `netlify.toml` configuration
4. Site will be deployed to your custom domain (fmlead.com)

### Deploy to Cloudflare Pages
1. Push your changes to your Git repository
2. Connect your repository to Cloudflare Pages
3. Set build command: `hugo --gc --minify`
4. Set build output directory: `public`
5. Set environment variable: `HUGO_VERSION=0.155.3`

## Site Structure

- **Base URL**: https://fmlead.com/
- **Theme**: Blowfish
- **Content Sections**:
  - Focus Mindset (`/focus/`)
  - Free Muser (`/muser/`)

## Key Features

- Custom CSS with section-specific styling
- Responsive design with mobile optimization
- SEO optimized with meta tags and structured data
- Math rendering support via MathJax
- Image optimization and WebP support
- Custom hero sections for each content area

## Files Modified

1. `hugo.toml` - Removed redundant custom_CSS parameter
2. `netlify.toml` - **NEW** - Added deployment configuration

## Verification

All checks passed:
- ✅ Site builds successfully (642ms)
- ✅ No build errors or warnings
- ✅ 45 pages generated
- ✅ 39 images processed
- ✅ robots.txt generated
- ✅ sitemap.xml generated
- ✅ Custom CSS bundled correctly
- ✅ Favicons configured
- ✅ Static assets present

## Next Steps

1. Commit these changes to your repository
2. Push to your main branch
3. Deploy via Netlify or Cloudflare Pages
4. Verify the site is live at fmlead.com

## Support

If you encounter any issues, check:
1. Hugo version matches (0.155.3)
2. Build command includes `--gc --minify`
3. Public directory is set as output
4. Environment variables are set correctly
