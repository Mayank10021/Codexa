import { initializeApp, getApps } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
  increment,
} from 'firebase/firestore'

// ─── Check if all required keys are present and not placeholders ──────────────
export function isFirebaseConfigured() {
  const k = import.meta.env
  return !!(
    k.VITE_FIREBASE_API_KEY &&
    k.VITE_FIREBASE_PROJECT_ID &&
    k.VITE_FIREBASE_AUTH_DOMAIN &&
    !k.VITE_FIREBASE_API_KEY.includes('your_key') &&
    !k.VITE_FIREBASE_API_KEY.includes('AIzaSy_your') &&
    !k.VITE_FIREBASE_PROJECT_ID.includes('your-project') &&
    k.VITE_FIREBASE_API_KEY.startsWith('AIzaSy')
  )
}

// ─── Safe Firebase init (only if configured) ─────────────────────────────────
let app = null
let auth = null
let db = null

if (isFirebaseConfigured()) {
  try {
    const firebaseConfig = {
      apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId:             import.meta.env.VITE_FIREBASE_APP_ID,
    }
    // Prevent duplicate app initialization
    app  = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
    db   = getFirestore(app)
  } catch (err) {
    console.warn('Firebase init failed:', err.message)
    app = null; auth = null; db = null
  }
}

export { auth, db }

// ─── Save user to Firestore ───────────────────────────────────────────────────
export async function saveUserToFirestore(firebaseUser, provider = 'email') {
  if (!db || !firebaseUser) return
  try {
    const userRef = doc(db, 'users', firebaseUser.uid)
    const existing = await getDoc(userRef)
    const data = {
      uid:         firebaseUser.uid,
      name:        firebaseUser.displayName || 'User',
      email:       firebaseUser.email,
      avatar:      firebaseUser.photoURL || null,
      provider,
      lastLoginAt: serverTimestamp(),
    }
    if (!existing.exists()) {
      await setDoc(userRef, { ...data, createdAt: serverTimestamp(), loginCount: 1, toolsUsed: 0 })
    } else {
      await updateDoc(userRef, { ...data, loginCount: increment(1) })
    }
  } catch (err) {
    console.warn('Firestore save failed:', err.message)
  }
}

// ─── Google Sign-In ───────────────────────────────────────────────────────────
export async function signInWithGoogle() {
  if (!auth) throw new Error('FIREBASE_NOT_CONFIGURED')
  const provider = new GoogleAuthProvider()
  provider.addScope('email')
  provider.addScope('profile')
  const result = await signInWithPopup(auth, provider)
  await saveUserToFirestore(result.user, 'google')
  return formatUser(result.user)
}

// ─── GitHub Sign-In ───────────────────────────────────────────────────────────
export async function signInWithGitHub() {
  if (!auth) throw new Error('FIREBASE_NOT_CONFIGURED')
  const provider = new GithubAuthProvider()
  provider.addScope('user:email')
  const result = await signInWithPopup(auth, provider)
  await saveUserToFirestore(result.user, 'github')
  return formatUser(result.user)
}

// ─── Email/Password Sign-In ───────────────────────────────────────────────────
export async function signInWithEmail(email, password) {
  if (!auth) throw new Error('FIREBASE_NOT_CONFIGURED')
  const result = await signInWithEmailAndPassword(auth, email, password)
  await saveUserToFirestore(result.user, 'email')
  return formatUser(result.user)
}

// ─── Register with Email ──────────────────────────────────────────────────────
export async function registerWithEmail(name, email, password) {
  if (!auth) throw new Error('FIREBASE_NOT_CONFIGURED')
  const result = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(result.user, {
    displayName: name,
    photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4338CA&color=fff&bold=true`,
  })
  await result.user.reload()
  await saveUserToFirestore(result.user, 'email')
  return formatUser(result.user)
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────
export async function firebaseSignOut() {
  if (auth) await signOut(auth)
}

// ─── Auth State Listener ──────────────────────────────────────────────────────
export function onAuthChange(callback) {
  if (!auth) { callback(null); return () => {} }
  return onAuthStateChanged(auth, (user) => callback(user ? formatUser(user) : null))
}

// ─── Format user ──────────────────────────────────────────────────────────────
function formatUser(u) {
  return {
    uid:    u.uid,
    name:   u.displayName || u.email?.split('@')[0] || 'User',
    email:  u.email,
    avatar: u.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.displayName||'U')}&background=4338CA&color=fff&bold=true`,
  }
}
