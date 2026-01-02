# 🚀 Quick Deployment Steps

## Step 1: Create Firestore Database (5 minutes)
1. Open https://console.firebase.google.com/project/careerlens-7bc8c/firestore
2. Click "Create database"
3. Select "Production mode"
4. Choose region: us-central1
5. Click "Enable"

## Step 2: Push to GitHub (2 minutes)
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Step 3: Deploy Backend on Render (10 minutes)
1. Go to https://dashboard.render.com/
2. New → Web Service
3. Connect your repo
4. Settings:
   - Name: `careerlens-backend`
   - Root Directory: `.` (dot - project root)
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`

5. Environment Variables (click "Add Environment Variable"):
```
NODE_ENV=production
PORT=10000
GOOGLE_API_KEY=<your-google-api-key>
GOOGLE_CLIENT_ID=<your-google-client-id>.apps.googleusercontent.com
FIREBASE_SERVICE_ACCOUNT=<your-firebase-service-account-json>
```

**Note:** Get your actual credentials from:
- Google API Key: Google Cloud Console → APIs & Services → Credentials
- Google Client ID: Same location, OAuth 2.0 Client IDs
- Firebase Service Account: Firebase Console → Project Settings → Service Accounts → Generate new private key (paste the entire JSON as one line)

6. Click "Create Web Service"
7. Wait 5-10 minutes for deployment
8. Copy your backend URL (e.g., `https://careerlens-backend.onrender.com`)

## Step 4: Deploy Frontend on Render (10 minutes)
1. New → Static Site
2. Connect same repo
3. Settings:
   - Name: `careerlens-frontend`
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

4. Environment Variables:
```
VITE_API_BASE_URL=https://careerlens-backend.onrender.com
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>.apps.googleusercontent.com
```
(Use YOUR actual backend URL from Step 3; use the same Google Client ID from the backend)

5. Click "Create Static Site"
6. Wait 5-10 minutes for deployment

## Step 5: Update Google OAuth (5 minutes)
1. Go to https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client
3. Add Authorized JavaScript origins:
   - Add your frontend URL (e.g., `https://careerlens-frontend.onrender.com`)
4. Add Authorized redirect URIs:
   - Add your frontend URL
5. Click "Save"

## Step 6: Test Deployment (5 minutes)
1. Open your frontend URL
2. Try signing up with test account
3. Test login
4. Upload a resume
5. Check if data persists (refresh page)

## ✅ Done!

**Your live URLs:**
- Frontend: `https://your-app.onrender.com`
- Backend: `https://your-backend.onrender.com`

**Important Notes:**
- Free tier services sleep after 15 min inactivity
- First request after sleep takes 30-60 seconds
- Auto-redeploys on git push

## Troubleshooting

**Backend fails to start:**
- Check logs in Render dashboard
- Verify FIREBASE_SERVICE_ACCOUNT is one line (no line breaks)
- Ensure Firestore database is created

**Frontend can't connect:**
- Verify VITE_API_BASE_URL matches backend URL exactly
- Check CORS errors in browser console
- Wait for backend to fully deploy first

**Authentication fails:**
- Update Google OAuth redirect URIs
- Clear browser cache and cookies
- Test with incognito/private window

Need detailed guide? See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
