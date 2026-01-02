# 🚀 Deployment Guide - CareerLens

## Prerequisites
- ✅ Firebase Firestore database created (Production mode)
- ✅ GitHub repository with your code
- ✅ Render account (free tier available)

---

## Step 1: Create Firestore Database (REQUIRED)

🔴 **IMPORTANT**: You must create the Firestore database first!

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **careerlens-7bc8c**
3. Click **Build** → **Firestore Database**
4. Click **Create database**
5. Select **Production mode**
6. Choose location: **us-central1** (or your preferred region)
7. Click **Enable**

---

## Step 2: Prepare Your Repository

### Push to GitHub

```bash
# If not already initialized
git init
git add .
git commit -m "Prepare for deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

**⚠️ SECURITY**: Make sure `.env` and `firebase-service-account.json` are in `.gitignore`!

---

## Step 3: Deploy to Render

### A. Create Web Service for Backend

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:

```
Name: careerlens-backend
Region: Oregon (US West) or closest to you
Branch: main
Root Directory: server
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

5. Click **Advanced** → **Add Environment Variables**:

```
NODE_ENV=production
PORT=10000
GOOGLE_API_KEY=<your-google-api-key>
GOOGLE_CLIENT_ID=<your-google-client-id>.apps.googleusercontent.com
```

6. **Add Firebase Credentials as Environment Variable**:

```
FIREBASE_SERVICE_ACCOUNT=<your-firebase-service-account-json>
```

**Note:** Get credentials from Google Cloud Console and Firebase Console.

7. Click **Create Web Service**

### B. Create Static Site for Frontend

1. Click **New** → **Static Site**
2. Connect your GitHub repository
3. Configure:

```
Name: careerlens-frontend
Branch: main
Root Directory: client
Build Command: npm install && npm run build
Publish Directory: dist
```

4. **Add Environment Variable**:

```
VITE_API_BASE_URL=https://careerlens-backend.onrender.com
```

(Replace with your actual backend URL from step A)

5. Click **Create Static Site**

---

## Step 4: Update Firebase Configuration

You need to update `server/src/utils/firebase.js` to read credentials from environment variable:

This has been configured to use either the JSON file (local) or environment variable (production).

---

## Step 5: Configure Google OAuth Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click your OAuth 2.0 Client ID
5. Add Authorized JavaScript origins:
   - `https://careerlens-frontend.onrender.com` (your Render frontend URL)
6. Add Authorized redirect URIs:
   - `https://careerlens-frontend.onrender.com`
7. Click **Save**

---

## Step 6: Update CORS in Backend

The backend should allow your frontend domain. This is already configured in the code with the environment check.

---

## 🎉 Deployment Complete!

Your URLs will be:
- **Frontend**: `https://careerlens-frontend.onrender.com`
- **Backend**: `https://careerlens-backend.onrender.com`

### ⚠️ Free Tier Limitations:
- Services sleep after 15 minutes of inactivity
- First request after sleep may take 30-60 seconds
- 750 hours/month free

### 🔄 Continuous Deployment:
Every push to your `main` branch will automatically redeploy!

---

## Troubleshooting

### Backend Not Starting?
1. Check Render logs
2. Verify Firestore database is created
3. Verify all environment variables are set
4. Check `FIREBASE_SERVICE_ACCOUNT` is valid JSON (one line, no spaces)

### Frontend Can't Connect?
1. Check `VITE_API_BASE_URL` points to backend URL
2. Verify CORS is configured correctly
3. Check backend logs for errors

### Authentication Not Working?
1. Verify Google OAuth redirect URIs are updated
2. Check `GOOGLE_CLIENT_ID` in backend env vars
3. Test with local signup/login first

---

## Alternative: Vercel Frontend + Render Backend

If you prefer Vercel for frontend:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd client
vercel
```

Environment variable for Vercel:
```
VITE_API_BASE_URL=https://careerlens-backend.onrender.com
```

---

## 📝 Post-Deployment Checklist

- [ ] Firestore database created and accessible
- [ ] Backend deployed and responding
- [ ] Frontend deployed and loads
- [ ] Can create account (test signup)
- [ ] Can login with credentials
- [ ] Google OAuth works
- [ ] Resume upload and analysis works
- [ ] Data persists after page refresh
- [ ] All animations and styling intact

---

Need help? Check Render logs or Firebase Console for detailed error messages!
