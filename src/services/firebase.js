import { initializeApp, getApps } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
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

let app = null, auth = null, db = null

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
    app  = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
    db   = getFirestore(app)
  } catch (err) {
    console.warn('Firebase init failed:', err.message)
    app = null; auth = null; db = null
  }
}

export { auth, db }

async function saveUserToFirestore(firebaseUser, provider = 'email') {
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
      emailVerified: firebaseUser.emailVerified,
      lastLoginAt: serverTimestamp(),
    }
    if (!existing.exists()) {
      await setDoc(userRef, { ...data, createdAt: serverTimestamp(), loginCount: 1 })
    } else {
      await updateDoc(userRef, { ...data, loginCount: increment(1) })
    }
  } catch (err) {
    console.warn('Firestore save failed:', err.message)
  }
}

// ── Google Login ──────────────────────────────────────────────────────────────
export async function signInWithGoogle() {
  if (!auth) throw new Error('FIREBASE_NOT_CONFIGURED')
  const provider = new GoogleAuthProvider()
  provider.addScope('email'); provider.addScope('profile')
  const result = await signInWithPopup(auth, provider)
  await saveUserToFirestore(result.user, 'google')
  return formatUser(result.user)
}

// ── Email Login — check verification ─────────────────────────────────────────
export async function signInWithEmail(email, password) {
  if (!auth) throw new Error('FIREBASE_NOT_CONFIGURED')
  const result = await signInWithEmailAndPassword(auth, email, password)

  // Block unverified email users
  if (!result.user.emailVerified) {
    await signOut(auth) // sign them out immediately
    throw new Error('EMAIL_NOT_VERIFIED')
  }

  await saveUserToFirestore(result.user, 'email')
  return formatUser(result.user)
}

// ── Register + Send Verification Email ───────────────────────────────────────
export async function registerWithEmail(name, email, password) {
  if (!auth) throw new Error('FIREBASE_NOT_CONFIGURED')
  const result = await createUserWithEmailAndPassword(auth, email, password)

  await updateProfile(result.user, {
    displayName: name,
    photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4338CA&color=fff&bold=true`,
  })

  // Send verification email
  await sendEmailVerification(result.user, {
    url: window.location.origin + '/login', // redirect after verification
  })

  // Sign them out — they must verify first
  await signOut(auth)

  return { needsVerification: true, email }
}

// ── Resend verification email ─────────────────────────────────────────────────
export async function resendVerificationEmail(email, password) {
  if (!auth) throw new Error('FIREBASE_NOT_CONFIGURED')
  
  // Password nahi hai toh directly current user use karo
  if (!password) {
    const currentUser = auth.currentUser
    if (currentUser && !currentUser.emailVerified) {
      await sendEmailVerification(currentUser, {
        url: window.location.origin + '/login',
      })
      return true
    }
    throw new Error('Please enter your password to resend the email.')
  }

  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    if (!result.user.emailVerified) {
      await sendEmailVerification(result.user, {
        url: window.location.origin + '/login',
      })
      await signOut(auth)
      return true
    }
    // Already verified
    return false
  } catch (err) {
    if (err.message.includes('wrong-password') || err.message.includes('invalid-credential'))
      throw new Error('Incorrect password. Please enter the correct password.')
    if (err.message.includes('too-many-requests'))
      throw new Error('Too many attempts. Please wait a few minutes.')
    if (err.message.includes('user-not-found'))
      throw new Error('No account found with this email.')
    throw new Error(err.message)
  }
}

export async function resetPassword(email) {
  if (!auth) throw new Error('FIREBASE_NOT_CONFIGURED')
  await sendPasswordResetEmail(auth, email, {
    url: window.location.origin + '/login',
  })
}

export async function firebaseSignOut() {
  if (auth) await signOut(auth)
}

export function onAuthChange(callback) {
  if (!auth) { callback(null); return () => {} }
  return onAuthStateChanged(auth, (user) => {
    if (!user) { callback(null); return }
    // Email se login kiya hai aur verify nahi kiya — null bhejo
    const isEmailUser = user.providerData?.[0]?.providerId === 'password'
    if (isEmailUser && !user.emailVerified) {
      callback(null)
    } else {
      callback(formatUser(user))
    }
  })
}

function formatUser(u) {
  return {
    uid:    u.uid,
    name:   u.displayName || u.email?.split('@')[0] || 'User',
    email:  u.email,
    avatar: u.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.displayName||'U')}&background=4338CA&color=fff&bold=true`,
  }
}
