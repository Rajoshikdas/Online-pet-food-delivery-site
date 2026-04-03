# Pet Food Delivery App - Deployment Guide

## Prerequisites
- GitHub account with the repository pushed
- MongoDB Atlas account (you have this)
- Vercel account (free)
- Render account (free)
- Cloudinary account (for image uploads)

---

## Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Log in to your account
3. Create a cluster or use existing one
4. Click "Connect" button
5. Choose "Drivers" → copy your connection string
6. Replace the username and password in the URI
7. Example: `mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/pet-food-delivery?retryWrites=true&w=majority`

---

## Step 2: Cloudinary Setup (For Image Uploads)

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up or log in
3. Go to Dashboard
4. Copy your:
   - Cloud Name
   - API Key
   - API Secret (keep this secure!)

---

## Step 3: Backend Deployment on Render

### 3.1 Prepare Backend for Render

1. Create a `render.yaml` file in your server directory:

```yaml
services:
  - type: web
    name: pet-food-server
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: MONGO_URI
        scope: build
        value: your_mongodb_atlas_connection_string
      - key: JWT_SECRET
        scope: build
        value: your_jwt_secret_here
      - key: CLOUDINARY_CLOUD_NAME
        scope: build
        value: your_cloudinary_cloud_name
      - key: CLOUDINARY_API_KEY
        scope: build
        value: your_cloudinary_api_key
      - key: CLOUDINARY_API_SECRET
        scope: build
        value: your_cloudinary_api_secret
```

### 3.2 Deploy to Render

1. Go to [Render](https://render.com/)
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Fill in the form:
   - **Name**: pet-food-server
   - **Root Directory**: server
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables in Render dashboard:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a random secret (e.g., use `openssl rand -hex 32`)
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `PORT`: 8080 (optional, Render assigns automatically)

7. Click "Create Web Service"
8. Wait for deployment (can take 2-5 minutes)
9. Your backend URL will be: `https://pet-food-server.onrender.com`

---

## Step 4: Frontend Deployment on Vercel

### 4.1 Update Frontend Configuration

1. Update [client/src/services/api.js](client/src/services/api.js) to use environment variables:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export default API_URL;
```

2. Create [client/.env.production](client/.env.production):

```
VITE_API_URL=https://pet-food-server.onrender.com/api
```

### 4.2 Deploy to Vercel

1. Go to [Vercel](https://vercel.com/)
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Select your pet-food-delivery-app repository
5. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: client
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
   - **Install Command**: `npm install`
6. Add Environment Variables:
   - `VITE_API_URL`: https://pet-food-server.onrender.com/api
7. Click "Deploy"
8. Wait for deployment (usually 1-2 minutes)
9. Your frontend URL will be: `https://your-project.vercel.app`

---

## Step 5: Update Backend CORS

After getting your Vercel URL, update [server/server.js](server/server.js):

```javascript
app.use(cors({ 
  origin: [
    'http://localhost:5173',
    'https://your-project.vercel.app'
  ], 
  credentials: true 
}))
```

Redeploy the backend on Render.

---

## Step 6: Update Admin User (Optional)

If needed, create a new admin user via MongoDB Atlas:

1. Go to MongoDB Atlas
2. Collections → Users
3. Insert a document:
```json
{
  "name": "Admin",
  "email": "admin@petfood.com",
  "password": "$2a$10/...", // bcrypt hashed password
  "role": "admin"
}
```

---

## Step 7: Testing

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Test the application:
   - Sign up a new user
   - Log in as admin
   - Upload pet food products
   - Place orders
   - Check prescriptions

---

## Troubleshooting

### Backend not connecting to MongoDB
- Check MongoDB Atlas IP whitelist (allow all IPs)
- Verify connection string format
- Check username/password in connection string

### Frontend API calls failing
- Check CORS configuration in server
- Verify VITE_API_URL environment variable
- Check browser console for errors

### Images not uploading
- Verify Cloudinary credentials
- Check file size limits
- Verify Cloudinary account is active

### Render app keeps restarting
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure server.js is properly configured

---

## Environment Variables Summary

### Server (.env)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pet-food-delivery
JWT_SECRET=your_random_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=8080
```

### Client (.env.production)
```
VITE_API_URL=https://pet-food-server.onrender.com/api
```

---

## Next Steps

1. Push your code to GitHub
2. Follow deployment steps above
3. Monitor logs in Render and Vercel dashboards
4. Test all features in production
5. Set up custom domain (optional, both Vercel and Render support this)
