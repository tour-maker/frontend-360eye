/**
 * Prerender Tour Pages Script
 * 
 * This script generates static HTML files with proper meta tags for each 3D tour
 * to ensure social media platforms can correctly display thumbnails and descriptions
 * when tour URLs are shared.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const TOURS_DIR = path.resolve(__dirname, '../public/gallery/3d');
const OUTPUT_DIR = path.resolve(__dirname, '../dist/gallery/3d');
const BASE_URL = process.env.VITE_BACKEND_URL || 'https://stageapi.360eye.in';
const WEBSITE_URL = 'https://stagewebsite.360eye.in';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Get all tour directories
function getTourDirectories() {
  try {
    return fs.readdirSync(TOURS_DIR)
      .filter(file => fs.statSync(path.join(TOURS_DIR, file)).isDirectory());
  } catch (error) {
    console.error('Error reading tour directories:', error);
    return [];
  }
}

// Function to check if a URL exists
async function urlExists(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error(`Error checking URL ${url}:`, error);
    return false;
  }
}

// Generate HTML template with proper meta tags
async function generateHtmlTemplate(tourPath, tourName) {
  // Try different thumbnail URL formats
  const possibleThumbnailUrls = [
    `${BASE_URL}/uploads/products/${tourPath}-thumbnail.png`,
    `${BASE_URL}/uploads/products/products-${tourPath}.png`,
    `${BASE_URL}/gallery/3d/${tourPath}/thumbnail.jpg`,
    `${WEBSITE_URL}/social-share.jpg` // Default fallback
  ];
  
  // Find the first working thumbnail URL
  let thumbnailUrl = possibleThumbnailUrls[possibleThumbnailUrls.length - 1]; // Default to fallback
  for (const url of possibleThumbnailUrls) {
    if (await urlExists(url)) {
      thumbnailUrl = url;
      
      break;
    }
  }
  
  const tourUrl = `${WEBSITE_URL}/gallery/3d/${tourPath}/index.html`;
  const title = `${tourName || tourPath} - 360° Virtual Tour by 360EYE`;
  const description = `Experience ${tourName || tourPath}, an immersive 3D virtual tour by 360EYE. Explore this property with interactive 360° navigation.`;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary Meta Tags -->
  <title>${title}</title>
  <meta name="title" content="${title}">
  <meta name="description" content="${description}">
  
  <!-- Open Graph / Facebook Meta Tags -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${tourUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${thumbnailUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="360EYE">
  
  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@360eye">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${thumbnailUrl}">
  
  <style>
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      background: #000;
    }
    .tour-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .tour-frame {
      width: 100%;
      height: 100%;
      border: 0;
    }
  </style>
</head>
<body>
  <div class="tour-container">
    <iframe
      class="tour-frame"
      src="${tourUrl}"
      title="${title}"
      allow="fullscreen; gyroscope; accelerometer; xr-spatial-tracking"
      sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-popups allow-popups-to-escape-sandbox"
    ></iframe>
  </div>
</body>
</html>`;
}

// Process each tour directory
async function processTours() {
  const tours = getTourDirectories();
  
  
  // Process tours sequentially to avoid overwhelming the server with HEAD requests
  for (const tourPath of tours) {
    try {
      // Extract tour name from path (replace hyphens with spaces and capitalize words)
      const tourName = tourPath
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
      
      // Generate HTML with meta tags (async)
      const html = await generateHtmlTemplate(tourPath, tourName);
      
      // Create output directory for this tour
      const tourOutputDir = path.join(OUTPUT_DIR, tourPath);
      if (!fs.existsSync(tourOutputDir)) {
        fs.mkdirSync(tourOutputDir, { recursive: true });
      }
      
      // Write the HTML file
      fs.writeFileSync(path.join(tourOutputDir, 'social.html'), html);
      
      
    } catch (error) {
      
    }
  }
}

// Run the script
(async () => {
  try {
    await processTours();
    
  } catch (error) {
    
    process.exit(1);
  }
})();
