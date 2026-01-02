# 🚀 Deploy CareerLens on Render - Step by Step

## ✅ Prerequisites Checklist
- [ ] GitHub repo created and code pushed: https://github.com/Dev0923/CareerLens.git
- [ ] Firestore database created in Firebase
- [ ] Render account created: https://render.com/
- [ ] Environment variables ready (see below)

---

## 📋 Environment Variables Ready to Copy

### Backend Variables:
```
NODE_ENV=production
PORT=10000
GOOGLE_API_KEY=<your-google-api-key>
GOOGLE_CLIENT_ID=<your-google-client-id>.apps.googleusercontent.com
FIREBASE_SERVICE_ACCOUNT=<your-firebase-service-account-json>
```

### Frontend Variables:
```
VITE_API_BASE_URL=(will be your backend URL after backend deploys)
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>.apps.googleusercontent.com
```

---

## 🔧 PART 1: Deploy Backend

### Step 1: Go to Render Dashboard
1. Open https://dashboard.render.com/
2. Click **New** → **Web Service**

### Step 2: Connect GitHub Repository
1. Click **Connect your GitHub account** (if not already connected)
2. Search for **CareerLens** repository
3. Select **Dev0923/CareerLens**
4. Click **Connect**

### Step 3: Configure Backend Service
Fill in these settings:

```
Name: careerlens-backend
Environment: Node
Region: Oregon (US West) [recommended] or closest to you
Branch: main
Root Directory: server
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free (Starter)
```

### Step 4: Add Environment Variables
1. Click **Advanced** ↓ to expand
2. Click **Add Environment Variable** and enter each:

```
KEY: NODE_ENV
VALUE: production

KEY: PORT
VALUE: 10000

KEY: GOOGLE_API_KEY
VALUE: <your-google-api-key>

KEY: GOOGLE_CLIENT_ID
VALUE: <your-google-client-id>.apps.googleusercontent.com

KEY: FIREBASE_SERVICE_ACCOUNT
VALUE: (paste the full JSON from above - keep it ALL on one line with no spaces)
```

### Step 5: Deploy
1. Click **Create Web Service**
2. Wait 5-10 minutes for deployment
3. ✅ When complete, you'll see a green checkmark
4. **Copy your backend URL** (e.g., `https://careerlens-backend.onrender.com`)

---

## 🎨 PART 2: Deploy Frontend

### Step 1: Create New Static Site
1. Go back to https://dashboard.render.com/
2. Click **New** → **Static Site**

### Step 2: Connect GitHub Repository
1. Select **Dev0923/CareerLens**
2. Click **Connect**

### Step 3: Configure Frontend Service
Fill in these settings:

```
Name: careerlens-frontend
Branch: main
Root Directory: client
Build Command: npm install && npm run build
Publish Directory: dist
```

### Step 4: Add Environment Variables
1. Click **Add Environment Variable**:

```
KEY: VITE_API_BASE_URL
VALUE: https://careerlens-backend.onrender.com
(Use your actual backend URL from Part 1, Step 5)

KEY: VITE_GOOGLE_CLIENT_ID
VALUE: <your-google-client-id>.apps.googleusercontent.com
```

### Step 5: Deploy
1. Click **Create Static Site**
2. Wait 5-10 minutes for deployment
3. ✅ When complete, you'll see "Live" status
4. **Your frontend URL:** Click the link at the top (e.g., `https://careerlens-frontend.onrender.com`)

---

## 🔐 PART 3: Update Google OAuth

### Step 1: Google Cloud Console
1. Go to https://console.cloud.google.com/apis/credentials
2. Click your OAuth 2.0 Client ID
3. Add your Render URLs to:
   - **Authorized JavaScript origins:** `https://careerlens-frontend.onrender.com`
   - **Authorized redirect URIs:** `https://careerlens-frontend.onrender.com`
4. Click **Save**

---

## ✅ PART 4: Test Your Deployment

### Test Backend
Open this URL in your browser:
```
https://careerlens-backend.onrender.com/api/health
```
You should see:
```json
{"ok":true,"status":"healthy"}
```

### Test Frontend
1. Open: `https://careerlens-frontend.onrender.com`
2. You should see your app loaded!

### Test Features
1. **Signup** - Create a test account
2. **Login** - Login with credentials
3. **Google Login** - Test Google OAuth
4. **Upload Resume** - Upload a PDF
5. **Analyze** - Run resume analysis
6. **Refresh Page** - Verify data persists

---

## 🐛 Troubleshooting

### Backend won't start
```
Error: NOT_FOUND or PERMISSION_DENIED from Firestore
```
**Solution:**
- Go to Firebase Console
- Verify Firestore database is created (not just API enabled)
- Check FIREBASE_SERVICE_ACCOUNT is valid JSON (entire content on ONE line)

### Frontend can't connect
```
CORS error in browser console
```
**Solution:**
- Verify VITE_API_BASE_URL matches backend URL exactly
- Make sure backend is fully deployed and responding
- Check browser console for specific error

### Google login not working
```
Authorization error from Google
```
**Solution:**
- Add your frontend URL to Google Cloud OAuth settings
- Clear browser cache and cookies
- Test in incognito/private window
- Wait 5 minutes for Google settings to sync

### Slow first request
```
Service took 30-60 seconds to respond
```
**Note:** Free tier services sleep after 15 min inactivity - first request wakes them up

---

## 📊 Your Live URLs

After deployment:

**Frontend:** https://careerlens-frontend.onrender.com  
**Backend:** https://careerlens-backend.onrender.com  

**Share this with anyone to use your app!** 🎉

---

## 💡 Next Steps

1. **Share your app** - Send the frontend URL to friends/recruiters
2. **Monitor logs** - Check Render dashboard for any errors
3. **Custom domain** - (Optional) Add your own domain in Render settings
4. **Database backup** - Firestore automatically backs up data

---

## 🆘 Need Help?

1. Check Render logs (click service → Logs tab)
2. Check Firebase Console for database issues
3. Check browser console (F12) for frontend errors
4. Review [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed info

Good luck! Your app will be live in 20-30 minutes! 🚀
