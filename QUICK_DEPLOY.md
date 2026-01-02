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
GOOGLE_API_KEY=AIzaSyDUw_14QZdXZj0NnIkLpPxEVtUMCTJve8o
GOOGLE_CLIENT_ID=423855747564-gsal0bj58gr4dbanin9r1urfdkk4oe3m.apps.googleusercontent.com
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"careerlens-7bc8c","private_key_id":"1ad8d6b13cf629e58528553c22d5b67f14610137","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCtTRjC1d10pejh\ngoePws3dhZT6LXZVb19Nz5v85cKHs9B8/GtquBQ+Jgic+LiZu227QXIgQME2Rufl\n6qn00TNYTafQBn1eeLmrNYwACczeNMQLNMc62vzpZF8O4JOA4VHNvesXYqGGPcve\nuAzfr20knRvQMrG1mwYWR2ONHHVcSph0PUYm65NaYvl0VQSvrj8j6hYQaYS3hiJD\nyfDyk1ptthw5Hw/PFRjngYaW9Uxcuwe6gMzdCJ0juLEuDo+OeiAnVWrK76aCGhL9\ne+9K562LAXnTFQzyNBz821flE/7G1b+l0Fa8YNts01eOHkiDC51sWZQCOYDoDqKB\n5XDKFiBlAgMBAAECgf8WVtnaQ7dIUhqy9yCCZ5oh9BZAKZwXZ0Phw+FXuEZbN9Ko\nSeGO4Cu71ytFEMq7Bm4etVEA11gQpxM9kAJYjJ8RwvDe3/dJNka4yy5A0wKVojej\nOip0a8YuT8HxKQHamzDwVIr5eL1ZkJ23GAKQ0ww+rAHp1J8Tyef+9zTd+80lGEI/\nRORAtvbE6tNVwy7VLLf1n2hZUs1eTvy9j4UbM/a711vZt4MuipKY59zAOMF24+Fd\nVLwzpGwCZtjRTHZ/yk1gpjkTlIhUtjbFxZkACgExfPEbDTCb458ql4mAog4GWPRb\nJFAQbJSpEOnsBOCUrQppYjfya4k+eOThGxzxQmECgYEA1hrB6m3GN9RLJwQkHPSk\n5U+IC9WzFzdQ6WOc7JykryeOCu9FckiyCkSUb72Zll2whUjHsDzl/OXJSw5nSBSo\nEBdZDDn9b5K+D/Ovjl2MLjthAL6CppEfL3p+BvZZO5+VRr6wen5UL9e26HN8+sER\ns7VMGyk3yUYOHIqUOsb3hykCgYEAzzZbQGbd26YLc2PfT7hDInxm8y1IpjHF22eP\n2F/W2k9tKvPuEqzCDY+zOIshel7hDBrAGH4tTZxk4IshOYdfPU5sEx4cCRRAgyjw\nS2xL8d8y0ZC+pxLkl77EdvzsvgzbyMdYu50udJ+b282TWJ6nhC/hy52/6Mi5okTk\nqgA7It0CgYBTUdZlBJM+5r7YUCQ9oHcLRggLkv4+6qfyK3HGIq9z+lCssLC16NRg\nao/ZbE941Lz9IXWUgB6AbGwJaXGH+4HrwSpGN8sIwHJ2gr6vCHilBTaas4jkiVU5\nhNHGo9fV/CR7g3nqMX9RnwDvNQJOExRwev1DFKdBDKIxOTy2IvfxAQKBgQCzZsdo\noecxtbgyRmTgW5Ncd0KXBjzhDzTTuf0zg/678op85sbXylUUcrbjnKn2jdDgrwRj\n8FJ+4IoCUtMIQOk3Zf9yKd5yCeO06yvo0TGLjwgrots+QcBClTr6Hg9GmFFtqxJr\nFTJUbJ//lSQeVPaKHv6qUMEH5Um7cVRcz2hjzQKBgQCRi7exWShXkyyXSWwv+KWz\npGRKVrx6MRRVgjuxU03L0L/EeGiavIeNSgwG3drJPLD5LX6PewREOUZbFa0aqyFa\n6Wi1FjOvTb0Mpt8iZ+SHxd/X7xfpQfn7v9FnLxlthutqNoZQZ4On59/fs4V2qn3P\n5xVXF8FAbQhe0w2ZKxS73g==\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-fbsvc@careerlens-7bc8c.iam.gserviceaccount.com","client_id":"102964768927457133155","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40careerlens-7bc8c.iam.gserviceaccount.com","universe_domain":"googleapis.com"}
```

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
VITE_GOOGLE_CLIENT_ID=423855747564-gsal0bj58gr4dbanin9r1urfdkk4oe3m.apps.googleusercontent.com
```
(Use YOUR actual backend URL from Step 3; keep VITE_GOOGLE_CLIENT_ID in sync with GOOGLE_CLIENT_ID from the backend)

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
