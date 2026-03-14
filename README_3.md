# ✦ Codexa — AI Developer Platform

🚀 **Codexa** is an AI-powered developer productivity platform designed to help programmers **generate, debug, understand, and optimize code faster using AI.**

Instead of switching between multiple tools, Codexa brings everything into **one powerful developer workspace** — with live preview, auto-fix, Google login, and more.

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🤖 AI Code Generator | Generate code instantly with **Live Browser Preview** |
| 🐛 Bug Checker | Analyze code and **Auto-Fix all issues in one click** |
| 📖 Code Explainer | Step-by-step AI explanations of complex code |
| 🔄 Code Converter | Convert between **20+ programming languages** |
| ⚡ Code Optimizer | Improve performance, readability and best practices |
| 🔧 AI Debugger | Paste any error — AI diagnoses and fixes it |
| 📚 Snippet Manager | Save, tag, favorite and reuse useful code snippets |
| 🐙 Repo Analyzer | Analyze GitHub repositories with AI insights |
| 🔐 Authentication | **Google Login**, **GitHub Login** and Email via Firebase |
| 👁️ Live Preview | HTML, CSS, JS and React render live in the browser |
| ⬇️ Download Code | Export generated or fixed code instantly |

---

## 🖥️ Screenshots

(Add screenshots after uploading them to your repository)

![Landing Page](screenshots/landing.png)
![Dashboard](screenshots/dashboard.png)
![Code Generator](screenshots/generator.png)
![Bug Checker](screenshots/checker.png)

---

## 🚀 Quick Setup

```bash
# 1. Clone the repository
git clone https://github.com/mayankaneja/codexa.git
cd codexa

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Add your API keys (see below)
# Then start the development server
npm run dev

# Visit
http://localhost:5173
```

---

## 🔑 API Key Setup

### Groq API (AI Features — Required)

To allow **all visitors to use AI features without their own key**:

1. Get a **free API key** from
   https://console.groq.com/keys

2. Open the `.env` file and add:

```
VITE_GROQ_API_KEY=gsk_xxxxxxxxxxxxx
```

⚠️ Never commit your `.env` file to GitHub.
The `.gitignore` already excludes it.

---

### Firebase (Google & GitHub Login — Optional)

To enable social login and auto-save users to a database:

1. Go to https://console.firebase.google.com → Create project
2. **Authentication → Sign-in method** → Enable **Google** and **GitHub**
3. **Firestore Database** → Create → Start in test mode
4. **Project Settings ⚙️ → Your apps → Web app** → Copy config

Then add to your `.env` file:

```
VITE_FIREBASE_API_KEY=AIzaSy_your_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc
```

Full guide available in [`FIREBASE_SETUP.md`](FIREBASE_SETUP.md)

---

## 🌍 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel deploy
```

Then add your environment variables in
**Vercel Dashboard → Project Settings → Environment Variables**

```
VITE_GROQ_API_KEY
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

After deploying, add your live URL in
**Firebase Console → Authentication → Authorized Domains**

---

### Netlify

```bash
npm run build
```

Upload the **dist** folder to Netlify.
Add environment variables in Site Settings → Environment Variables.

---

### GitHub Pages

```bash
npm run build
```

Deploy the **dist** folder to the `gh-pages` branch.

---

## 🧱 Tech Stack

- **React 18**
- **Vite**
- **React Router v6**
- **Tailwind CSS**
- **Monaco Editor** (VS Code's editor engine)
- **Groq API** (Llama 3.3 70B — free and ultra-fast)
- **Firebase** (Authentication + Firestore Database)

Fonts used:
- Bricolage Grotesque
- Figtree
- Fira Code

---

## 📂 Project Structure

```
codexa/
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── CodeEditor.jsx
│   │   ├── AIResponse.jsx
│   │   ├── LivePreview.jsx
│   │   ├── FirebaseSetupBanner.jsx
│   │   ├── SettingsModal.jsx
│   │   ├── LoadingState.jsx
│   │   ├── ErrorState.jsx
│   │   └── Footer.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Generator.jsx
│   │   ├── Checker.jsx
│   │   ├── Explainer.jsx
│   │   ├── Converter.jsx
│   │   ├── Optimizer.jsx
│   │   ├── Debugger.jsx
│   │   ├── Snippets.jsx
│   │   └── GitHub.jsx
│   │
│   ├── services/
│   │   ├── firebase.js
│   │   ├── authService.js
│   │   ├── aiService.js
│   │   └── snippetService.js
│   │
│   ├── hooks/
│   │   └── useAI.js
│   │
│   └── utils/
│       └── helpers.js
│
├── public/
├── .env.example
├── .gitignore
├── FIREBASE_SETUP.md
├── package.json
└── README.md
```

---

## 👥 User Data

Every user who signs in is **automatically saved to Firebase Firestore** with:

- Name, Email, Profile Photo
- Login provider (Google / GitHub / Email)
- Account created date
- Last login time and login count

**To export as Excel:**
Firebase Console → Authentication → Users → ⋮ → **Download CSV** → Open in Excel ✅

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a Pull Request

---

## ⭐ Support

If you like this project, consider **starring the repository ⭐**

It helps the project grow and motivates further development.

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

Built with ❤️ by **Mayank Aneja**
