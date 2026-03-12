# Sunscreen Frontend

This is the frontend portion of the Sunscreen web application, built with React, Vite, and TypeScript.

## 🛠️ Local Development

### 1. Prerequisites
- Node.js 18+
- npm

### 2. Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
   *The app will be available at [http://localhost:5173](http://localhost:5173)*

## 🏗️ Build and Production
- To create a production build:
  ```bash
  npm run build
  ```
- To preview the production build locally:
  ```bash
  npm run preview
  ```

## 🚢 Vercel Deployment
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Rewrites**: Handled by `vercel.json` for SPA support.
