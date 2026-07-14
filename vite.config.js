// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import axios from "axios";

// Middleware to detect social media crawlers and proxy to backend
const crawlerMiddleware = () => {
  return {
    name: 'crawler-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const userAgent = req.headers['user-agent'] || '';
        const isCrawler = /facebookexternalhit|WhatsApp|Twitterbot|LinkedInBot|Slackbot|TelegramBot|Pinterest|Googlebot/i.test(userAgent);
        
        // If it's a crawler requesting a gallery path, proxy to backend
        if (isCrawler && req.url && req.url.startsWith('/gallery/')) {
          try {
            const backendUrl = process.env.VITE_BACKEND_URL || 'https://stageapi.360eye.in';
            const fullUrl = `${backendUrl}${req.url}`;
            
            console.log(`[CRAWLER DETECTED] ${userAgent.substring(0, 50)}... -> Proxying to: ${fullUrl}`);
            
            const response = await axios.get(fullUrl, {
              responseType: 'text',
              headers: {
                'User-Agent': userAgent
              }
            });
            
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(response.data);
            return;
          } catch (error) {
            console.error('Error proxying to backend:', error.message);
          }
        }
        
        next();
      });
    }
  };
};

export default defineConfig({
  plugins: [react(), crawlerMiddleware()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      // Proxy API calls to backend, but be specific to avoid React routes
      '^/gallery/(admin|uploads)/.*': {
        target: process.env.VITE_BACKEND_URL,
        changeOrigin: true,
        rewrite: (path) => path,
        secure: false,  // Allow insecure connections for development
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Add headers that might be needed for S3 access
            proxyReq.setHeader('origin', 'https://stagewebsite.360eye.in');
            proxyReq.setHeader('referer', 'https://stagewebsite.360eye.in/');
            proxyReq.setHeader('host', new URL(process.env.VITE_BACKEND_URL).hostname);
            
            // Add debugging headers
            console.log('Proxying:', req.method, req.url);
            console.log('Headers:', JSON.stringify(proxyReq.getHeaders(), null, 2));
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Response from backend:', req.url, 'Status:', proxyRes.statusCode);
          });
        }
      },
      // Your existing proxy for main website
      '/api': {
        target: process.env.VITE_BACKEND_URL,
        changeOrigin: true,
        secure: false
      }
    }
  }
});