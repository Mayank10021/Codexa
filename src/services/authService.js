// ─── authService.js ───────────────────────────────────────────────────────────
// Thin wrapper — uses Firebase when configured, falls back to localStorage auth

import {
  signInWithGoogle,
  signInWithEmail,
  registerWithEmail,
  firebaseSignOut,
  onAuthChange,
  isFirebaseConfigured,
} from './firebase'

export { isFirebaseConfigured, onAuthChange }

// ─── Google Login ─────────────────────────────────────────────────────────────
export async function loginWithGoogle() {
  return signInWithGoogle()
}

// ─── Email/Password Login ─────────────────────────────────────────────────────
export async function login(email, password) {
  if (isFirebaseConfigured()) {
    return signInWithEmail(email, password)
  }
  // Fallback: localStorage auth (no Firebase)
  const users = JSON.parse(localStorage.getItem('cx_users') || '[]')
  const user = users.find(u => u.email === email && u.password === btoa(password))
  if (!user) throw new Error('Invalid email or password')
  const session = { uid: user.id, name: user.name, email: user.email, avatar: user.avatar }
  localStorage.setItem('cx_user', JSON.stringify(session))
  return session
}

// ─── Email/Password Register ──────────────────────────────────────────────────
export async function register(name, email, password) {
  if (isFirebaseConfigured()) {
    return registerWithEmail(name, email, password)
  }
  // Fallback: localStorage
  const users = JSON.parse(localStorage.getItem('cx_users') || '[]')
  if (users.find(u => u.email === email)) throw new Error('Email already registered')
  const user = {
    id: Date.now().toString(), name, email,
    password: btoa(password),
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4338CA&color=fff&bold=true`,
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  localStorage.setItem('cx_users', JSON.stringify(users))
  const session = { uid: user.id, name: user.name, email: user.email, avatar: user.avatar }
  localStorage.setItem('cx_user', JSON.stringify(session))
  return session
}

// ─── Logout ───────────────────────────────────────────────────────────────────
export async function logout() {
  localStorage.removeItem('cx_user')
  if (isFirebaseConfigured()) await firebaseSignOut()
}

// ─── Get stored user (for initial load) ──────────────────────────────────────
export function getUser() {
  const u = localStorage.getItem('cx_user')
  return u ? JSON.parse(u) : null
}

// ─── Persist user to localStorage (called after Firebase auth) ───────────────
export function persistUser(user) {
  if (user) localStorage.setItem('cx_user', JSON.stringify(user))
  else localStorage.removeItem('cx_user')
}
