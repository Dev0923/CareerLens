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
GOOGLE_API_KEY=AIzaSyDUw_14QZdXZj0NnIkLpPxEVtUMCTJve8o
GOOGLE_CLIENT_ID=423855747564-gsal0bj58gr4dbanin9r1urfdkk4oe3m.apps.googleusercontent.com
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"careerlens-7bc8c","private_key_id":"1ad8d6b13cf629e58528553c22d5b67f14610137","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCtTRjC1d10pejh\ngoePws3dhZT6LXZVb19Nz5v85cKHs9B8/GtquBQ+Jgic+LiZu227QXIgQME2Rufl\n6qn00TNYTafQBn1eeLmrNYwACczeNMQLNMc62vzpZF8O4JOA4VHNvesXYqGGPcve\nuAzfr20knRvQMrG1mwYWR2ONHHVcSph0PUYm65NaYvl0VQSvrj8j6hYQaYS3hiJD\nyfDyk1ptthw5Hw/PFRjngYaW9Uxcuwe6gMzdCJ0juLEuDo+OeiAnVWrK76aCGhL9\ne+9K562LAXnTFQzyNBz821flE/7G1b+l0Fa8YNts01eOHkiDC51sWZQCOYDoDqKB\n5XDKFiBlAgMBAAECgf8WVtnaQ7dIUhqy9yCCZ5oh9BZAKZwXZ0Phw+FXuEZbN9Ko\nSeGO4Cu71ytFEMq7Bm4etVEA11gQpxM9kAJYjJ8RwvDe3/dJNka4yy5A0wKVojej\nOip0a8YuT8HxKQHamzDwVIr5eL1ZkJ23GAKQ0ww+rAHp1J8Tyef+9zTd+80lGEI/\nRORAtvbE6tNVwy7VLLf1n2hZUs1eTvy9j4UbM/a711vZt4MuipKY59zAOMF24+Fd\nVLwzpGwCZtjRTHZ/yk1gpjkTlIhUtjbFxZkACgExfPEbDTCb458ql4mAog4GWPRb\nJFAQbJSpEOnsBOCUrQppYjfya4k+eOThGxzxQmECgYEA1hrB6m3GN9RLJwQkHPSk\n5U+IC9WzFzdQ6WOc7JykryeOCu9FckiyCkSUb72Zll2whUjHsDzl/OXJSw5nSBSo\nEBdZDDn9b5K+D/Ovjl2MLjthAL6CppEfL3p+BvZZO5+VRr6wen5UL9e26HN8+sER\ns7VMGyk3yUYOHIqUOsb3hykCgYEAzzZbQGbd26YLc2PfT7hDInxm8y1IpjHF22eP\n2F/W2k9tKvPuEqzCDY+zOIshel7hDBrAGH4tTZxk4IshOYdfPU5sEx4cCRRAgyjw\nS2xL8d8y0ZC+pxLkl77EdvzsvgzbyMdYu50udJ+b282TWJ6nhC/hy52/6Mi5okTk\nqgA7It0CgYBTUdZlBJM+5r7YUCQ9oHcLRggLkv4+6qfyK3HGIq9z+lCssLC16NRg\nao/ZbE941Lz9IXWUgB6AbGwJaXGH+4HrwSpGN8sIwHJ2gr6vCHilBTaas4jkiVU5\nhNHGo9fV/CR7g3nqMX9RnwDvNQJOExRwev1DFKdBDKIxOTy2IvfxAQKBgQCzZsdo\noecxtbgyRmTgW5Ncd0KXBjzhDzTTuf0zg/678op85sbXylUUcrbjnKn2jdDgrwRj\n8FJ+4IoCUtMIQOk3Zf9yKd5yCeO06yvo0TGLjwgrots+QcBClTr6Hg9GmFFtqxJr\nFTJUbJ//lSQeVPaKHv6qUMEH5Um7cVRcz2hjzQKBgQCRi7exWShXkyyXSWwv+KWz\npGRKVrx6MRRVgjuxU03L0L/EeGiavIeNSgwG3drJPLD5LX6PewREOUZbFa0aqyFa\n6Wi1FjOvTb0Mpt8iZ+SHxd/X7xfpQfn7v9FnLxlthutqNoZQZ4On59/fs4V2qn3P\n5xVXF8FAbQhe0w2ZKxS73g==\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-fbsvc@careerlens-7bc8c.iam.gserviceaccount.com","client_id":"102964768927457133155","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40careerlens-7bc8c.iam.gserviceaccount.com","universe_domain":"googleapis.com"}
```

### Frontend Variables:
```
VITE_API_BASE_URL=(will be your backend URL after backend deploys)
VITE_GOOGLE_CLIENT_ID=423855747564-gsal0bj58gr4dbanin9r1urfdkk4oe3m.apps.googleusercontent.com
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
VALUE: AIzaSyDUw_14QZdXZj0NnIkLpPxEVtUMCTJve8o

KEY: GOOGLE_CLIENT_ID
VALUE: 423855747564-gsal0bj58gr4dbanin9r1urfdkk4oe3m.apps.googleusercontent.com

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
VALUE: 423855747564-gsal0bj58gr4dbanin9r1urfdkk4oe3m.apps.googleusercontent.com
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
