/**
 * Thumbnail Generator for 360EYE 3D Tours
 * 
 * This script generates thumbnail images for all 3D tours in the gallery directory.
 * It uses the first panorama image from each tour as the thumbnail.
 * 
 * Usage:
 * node generate-thumbnails.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const GALLERY_DIR = path.resolve(__dirname, '../public/gallery/3d');
const DEFAULT_THUMBNAIL = path.resolve(__dirname, '../public/social-share.jpg');

// Ensure the scripts directory exists
if (!fs.existsSync(GALLERY_DIR)) {
  console.error(`Gallery directory not found: ${GALLERY_DIR}`);
  process.exit(1);
}



// Get all tour directories
const tourDirs = fs.readdirSync(GALLERY_DIR, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);



// Process each tour directory
tourDirs.forEach(tourDir => {
  const tourPath = path.join(GALLERY_DIR, tourDir);
  const thumbnailPath = path.join(tourPath, 'thumbnail.jpg');
  
  // Skip if thumbnail already exists
  if (fs.existsSync(thumbnailPath)) {
    
    return;
  }
  
  
  
  // Look for panorama images in the tour directory
  const files = fs.readdirSync(tourPath, { withFileTypes: true })
    .filter(file => file.isFile() && /\.(jpg|jpeg|png)$/i.test(file.name))
    .map(file => file.name);
  
  if (files.length === 0) {
    
    // Copy default thumbnail
    fs.copyFileSync(DEFAULT_THUMBNAIL, thumbnailPath);
    return;
  }
  
  // Use the first panorama image as the thumbnail
  const firstImage = path.join(tourPath, files[0]);
  
  try {
    // If ImageMagick is available, resize the image to create a proper thumbnail
    try {
      execSync(`convert "${firstImage}" -resize 1200x630^ -gravity center -extent 1200x630 "${thumbnailPath}"`);
    
    } catch (err) {
      // If ImageMagick fails, just copy the image
      fs.copyFileSync(firstImage, thumbnailPath);
    }
  } catch (err) {
    
    // Copy default thumbnail as fallback
    fs.copyFileSync(DEFAULT_THUMBNAIL, thumbnailPath);
  }
});
