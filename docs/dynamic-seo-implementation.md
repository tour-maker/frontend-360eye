# Dynamic SEO Implementation for 360EYE 3D Tours

This document explains how to implement dynamic SEO metadata for individual 3D tour gallery URLs on the 360eye website, ensuring that when these specific tour links are shared on social media platforms like WhatsApp, the correct tour-specific information is displayed.

## Overview

The implementation consists of three main components:

1. **Dynamic Meta Tags**: Using React Helmet Async to inject dynamic meta tags for each 3D tour
2. **Thumbnail Generation**: Ensuring each tour has a proper thumbnail image
3. **Server Configuration**: Configuring nginx to properly handle both React routes and gallery routes

## Implementation Steps

### 1. Dynamic Meta Tags

We've implemented dynamic meta tags using `react-helmet-async`. The key changes are:

- Added `react-helmet-async` to the project dependencies
- Wrapped the application with `HelmetProvider` in `main.jsx`
- Modified the `GalleryViewer` component to extract tour information from the URL and set dynamic meta tags

The component now:
- Parses the tour path from the URL
- Extracts a clean, human-readable tour name
- Dynamically sets SEO metadata (title, description, image URL) based on the tour path
- Uses `<Helmet>` to inject dynamic meta tags for Open Graph, Twitter cards, and standard meta tags

### 2. Thumbnail Generation

For thumbnails to work properly:

1. Each 3D tour should have a `thumbnail.jpg` file in its directory
2. The thumbnail should be 1200x630 pixels (optimal for social sharing)
3. If a thumbnail doesn't exist, the system will fall back to the default `social-share.jpg`

We've created a script to generate thumbnails automatically:
```
node scripts/generate-thumbnails.js
```

### 3. Server Configuration

The nginx configuration needs to be updated to properly handle both React routes and gallery routes:

1. Copy the nginx configuration file from `nginx/360eye-website.conf` to your server
2. Update the paths and domain names as needed
3. Restart nginx to apply the changes

```bash
# On your EC2 server
sudo cp 360eye-website.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/360eye-website.conf /etc/nginx/sites-enabled/
sudo nginx -t  # Test the configuration
sudo systemctl restart nginx
```

## Key Files

- `/src/components/virtualTour/VirtualTourViewer.jsx`: Contains the dynamic SEO implementation
- `/src/main.jsx`: Contains the HelmetProvider setup
- `/scripts/generate-thumbnails.js`: Script to generate thumbnails
- `/nginx/360eye-website.conf`: Nginx configuration template

## Testing

To test if the dynamic SEO is working:

1. Deploy the website with these changes
2. Open a 3D tour URL (e.g., `https://stagewebsite.360eye.in/gallery/3d/raghuvirmastertour/index.html`)
3. Use a social media debugger tool to check if the meta tags are being properly read:
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
4. Share the URL on WhatsApp and verify that the correct title, description, and thumbnail appear

## Troubleshooting

If the thumbnails don't appear when sharing:

1. Check if the thumbnail file exists at the correct path
2. Verify that the nginx configuration is correctly proxying requests to `/gallery/`
3. Use browser developer tools to check if the thumbnail URL returns a 200 status code
4. Clear the cache on social media platforms by using their debugging tools

## Notes

- Social media platforms cache shared URLs. Use their debugging tools to force a refresh of the cache.
- Some platforms may not support client-side rendered meta tags. If issues persist, consider implementing server-side rendering or prerendering.
