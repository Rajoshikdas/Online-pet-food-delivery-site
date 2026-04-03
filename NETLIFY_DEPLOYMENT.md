# Netlify Deployment Guide

## Important Note
Netlify is primarily designed for **frontend deployment**. While Netlify Functions can be used for backend APIs, they have limitations:
- 10s timeout limit (free tier)
- Memory constraints
- Cold start delays
- Better suited for serverless functions, not full Express servers

**Recommended Approach:**
- ✅ **Frontend**: Deploy on Netlify (works perfectly)
- ✅ **Backend**: Keep on Render, Railway, or AWS Lambda

---

## Option 1: Frontend on Netlify + Backend on Render (RECOMMENDED)

### Deploy Frontend to Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Click **"Add New Site"** → **"Import an existing project"**
3. Select GitHub and authorize Netlify
4. Choose repository: `Rajoshikdas/Online-pet-food-delivery-site`
5. Configure build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add environment variables:
   - `VITE_API_URL`: `https://your-render-backend.onrender.com/api`
7. Click **Deploy site**

### Keep Backend on Render
- Your backend stays on Render with all environment variables set
- Update CORS in `server/server.js` with Netlify URL:
  ```javascript
  app.use(cors({ 
    origin: [
      'http://localhost:5173',
      'https://your-netlify-site.netlify.app'
    ], 
    credentials: true 
  }))
  ```

---

## Option 2: Frontend + Backend on Netlify (Advanced)

### Limitations:
- ⚠️ Express server won't work well with Netlify Functions
- ⚠️ 10-second timeout (free tier)
- ⚠️ Not ideal for real-time/long-running operations

### If you still want to try:

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Update `client/.env.production`:
   ```
   VITE_API_URL=/api
   ```

3. Initialize Netlify in your project:
   ```bash
   netlify init
   ```

4. Deploy:
   ```bash
   netlify deploy --prod
   ```

**Note:** This approach requires significant refactoring of the server code to work with Netlify Functions, and may not be stable in production.

---

## Best Practice Recommendation

Deploy using this setup:

| Component | Platform | Why |
|-----------|----------|-----|
| **Frontend** | Netlify | Fast builds, excellent for SPAs, integrated CDN, form handling |
| **Backend** | Render/Railway | Full Node.js server support, no timeouts, persistent connections |
| **Database** | MongoDB Atlas | Fully managed, no setup needed |
| **Storage** | Cloudinary | Image/file hosting, included in your app |

---

## Quick Setup Steps (Recommended Approach)

### 1. Deploy Frontend to Netlify
```bash
# No changes needed, just connect to GitHub
# Netlify will auto-detect and use netlify.toml for build config
```

### 2. Keep Backend on Render
- Ensure all environment variables are set
- Update CORS with Netlify frontend URL

### 3. Test Everything
- Visit your Netlify URL
- Test login, product upload, orders, etc.

---

## Troubleshooting

### If using Netlify for both:
- Check build logs in Netlify dashboard
- Verify environment variables are set
- Check function logs for API errors

### If using Netlify + Render:
- Verify CORS configuration
- Check API_URL in frontend .env
- Test with: `curl https://your-render-backend/api/products`

---

## Environment Variables for Netlify

**Frontend (.env deployed to Netlify):**
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

**Backend (if on Netlify Functions - not recommended):**
```
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Summary

✅ **Ready to deploy** - Your project is configured for Netlify
✅ **Frontend** - Works perfectly with Netlify
⚠️ **Backend** - Better on Render/Railway than Netlify Functions

**Proceed with:**
1. Dashboard frontend on Netlify
2. Backend on Render (keep existing setup)
3. Both services talking via API calls
