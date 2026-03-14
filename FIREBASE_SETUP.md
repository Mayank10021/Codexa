# 🔥 Firebase Setup Guide — Codexa

Follow these steps to enable Google Login, GitHub Login, and user database.
**Estimated time: 10-15 minutes. All free.**

---

## Step 1 — Create Firebase Project

1. Go to **https://console.firebase.google.com**
2. Click **"Create a project"**
3. Name it: `codexa` (or anything you like)
4. Disable Google Analytics (not needed) → **Create project**

---

## Step 2 — Enable Authentication

1. In left sidebar → **Build → Authentication**
2. Click **"Get started"**
3. Click **"Sign-in method"** tab

### Enable Google Login:
- Click **Google** → Toggle **Enable** → Select your Gmail → **Save**

### Enable GitHub Login:
- Click **GitHub** → Toggle **Enable**
- You'll need GitHub Client ID & Secret:
  1. Go to **https://github.com/settings/developers**
  2. Click **"New OAuth App"**
  3. Fill in:
     - App name: `Codexa`
     - Homepage URL: `http://localhost:5173` (or your live URL)
     - Authorization callback URL: Copy this from Firebase (shown on the GitHub page)
  4. Click **Register application**
  5. Copy **Client ID** and **Client Secret** → paste into Firebase → **Save**

---

## Step 3 — Create Firestore Database

1. In left sidebar → **Build → Firestore Database**
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
4. Choose a region → **Enable**

### Set Security Rules (important for production):
Go to **Rules** tab and paste:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## Step 4 — Get Your Config Keys

1. Go to **Project Settings** (gear icon ⚙️ in sidebar)
2. Scroll down to **"Your apps"**
3. Click **"</>"** (Web app icon)
4. Name it `codexa-web` → Click **Register app**
5. You'll see something like:
```js
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXX",
  authDomain: "codexa-xxxxx.firebaseapp.com",
  projectId: "codexa-xxxxx",
  storageBucket: "codexa-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```
6. Copy these values!

---

## Step 5 — Add Keys to .env File

Open your `.env` file and fill in:
```env
VITE_GROQ_API_KEY=gsk_your_groq_key

VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=codexa-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=codexa-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=codexa-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

---

## Step 6 — Run and Test

```bash
npm install
npm run dev
```

Go to `http://localhost:5173/login` → you should see Google and GitHub buttons!

---

## 👁️ See Your Users (Firebase Console)

1. Go to **Firebase Console → Firestore Database**
2. Click **"users"** collection
3. You'll see every user who signed up with:
   - Name, Email, Profile photo
   - Provider (google/github/email)
   - Login count, Last login time
   - Account created date

### Export to Excel:
- Firebase doesn't have direct Excel export
- Go to **Authentication → Users** tab
- Click the **3 dots menu → Download users** → CSV file
- Open CSV in Excel ✅

---

## 🚀 Deploy to Vercel (Live Site)

```bash
npm run build
npx vercel deploy
```

In Vercel Dashboard → Settings → Environment Variables:
Add all your `.env` variables there too!

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Firebase not configured" | Check .env file has correct values, no quotes |
| Google login popup blocked | Allow popups in browser settings |
| GitHub login error | Check callback URL matches exactly |
| "Permission denied" Firestore | Check security rules, user must be logged in |

---

**Developed by Mayank Aneja** · Powered by Firebase + Groq AI
