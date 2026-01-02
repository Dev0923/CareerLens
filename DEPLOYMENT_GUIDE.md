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
GOOGLE_API_KEY=AIzaSyDUw_14QZdXZj0NnIkLpPxEVtUMCTJve8o
GOOGLE_CLIENT_ID=423855747564-gsal0bj58gr4dbanin9r1urfdkk4oe3m.apps.googleusercontent.com
```

6. **Add Firebase Credentials as Environment Variable**:

```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"careerlens-7bc8c","private_key_id":"1ad8d6b13cf629e58528553c22d5b67f14610137","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCtTRjC1d10pejh\ngoePws3dhZT6LXZVb19Nz5v85cKHs9B8/GtquBQ+Jgic+LiZu227QXIgQME2Rufl\n6qn00TNYTafQBn1eeLmrNYwACczeNMQLNMc62vzpZF8O4JOA4VHNvesXYqGGPcve\nuAzfr20knRvQMrG1mwYWR2ONHHVcSph0PUYm65NaYvl0VQSvrj8j6hYQaYS3hiJD\nyfDyk1ptthw5Hw/PFRjngYaW9Uxcuwe6gMzdCJ0juLEuDo+OeiAnVWrK76aCGhL9\ne+9K562LAXnTFQzyNBz821flE/7G1b+l0Fa8YNts01eOHkiDC51sWZQCOYDoDqKB\n5XDKFiBlAgMBAAECgf8WVtnaQ7dIUhqy9yCCZ5oh9BZAKZwXZ0Phw+FXuEZbN9Ko\nSeGO4Cu71ytFEMq7Bm4etVEA11gQpxM9kAJYjJ8RwvDe3/dJNka4yy5A0wKVojej\nOip0a8YuT8HxKQHamzDwVIr5eL1ZkJ23GAKQ0ww+rAHp1J8Tyef+9zTd+80lGEI/\nRORAtvbE6tNVwy7VLLf1n2hZUs1eTvy9j4UbM/a711vZt4MuipKY59zAOMF24+Fd\nVLwzpGwCZtjRTHZ/yk1gpjkTlIhUtjbFxZkACgExfPEbDTCb458ql4mAog4GWPRb\nJFAQbJSpEOnsBOCUrQppYjfya4k+eOThGxzxQmECgYEA1hrB6m3GN9RLJwQkHPSk\n5U+IC9WzFzdQ6WOc7JykryeOCu9FckiyCkSUb72Zll2whUjHsDzl/OXJSw5nSBSo\nEBdZDDn9b5K+D/Ovjl2MLjthAL6CppEfL3p+BvZZO5+VRr6wen5UL9e26HN8+sER\ns7VMGyk3yUYOHIqUOsb3hykCgYEAzzZbQGbd26YLc2PfT7hDInxm8y1IpjHF22eP\n2F/W2k9tKvPuEqzCDY+zOIshel7hDBrAGH4tTZxk4IshOYdfPU5sEx4cCRRAgyjw\nS2xL8d8y0ZC+pxLkl77EdvzsvgzbyMdYu50udJ+b282TWJ6nhC/hy52/6Mi5okTk\nqgA7It0CgYBTUdZlBJM+5r7YUCQ9oHcLRggLkv4+6qfyK3HGIq9z+lCssLC16NRg\nao/ZbE941Lz9IXWUgB6AbGwJaXGH+4HrwSpGN8sIwHJ2gr6vCHilBTaas4jkiVU5\nhNHGo9fV/CR7g3nqMX9RnwDvNQJOExRwev1DFKdBDKIxOTy2IvfxAQKBgQCzZsdo\noecxtbgyRmTgW5Ncd0KXBjzhDzTTuf0zg/678op85sbXylUUcrbjnKn2jdDgrwRj\n8FJ+4IoCUtMIQOk3Zf9yKd5yCeO06yvo0TGLjwgrots+QcBClTr6Hg9GmFFtqxJr\nFTJUbJ//lSQeVPaKHv6qUMEH5Um7cVRcz2hjzQKBgQCRi7exWShXkyyXSWwv+KWz\npGRKVrx6MRRVgjuxU03L0L/EeGiavIeNSgwG3drJPLD5LX6PewREOUZbFa0aqyFa\n6Wi1FjOvTb0Mpt8iZ+SHxd/X7xfpQfn7v9FnLxlthutqNoZQZ4On59/fs4V2qn3P\n5xVXF8FAbQhe0w2ZKxS73g==\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-fbsvc@careerlens-7bc8c.iam.gserviceaccount.com","client_id":"102964768927457133155","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40careerlens-7bc8c.iam.gserviceaccount.com","universe_domain":"googleapis.com"}
```

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
