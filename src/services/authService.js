import {
  signInWithGoogle,
  signInWithEmail,
  registerWithEmail,
  firebaseSignOut,
  onAuthChange,
  isFirebaseConfigured,
} from './firebase'

export { isFirebaseConfigured, onAuthChange }

export async function loginWithGoogle() {
  return signInWithGoogle()
}


export async function login(email, password) {
  if (isFirebaseConfigured()) {
    return signInWithEmail(email, password)
  }
  // localStorage fallback
  const users = JSON.parse(localStorage.getItem('cx_users') || '[]')
  const user = users.find(u => u.email === email && u.password === btoa(password))
  if (!user) throw new Error('Invalid email or password')
  const session = { uid: user.id, name: user.name, email: user.email, avatar: user.avatar }
  localStorage.setItem('cx_user', JSON.stringify(session))
  return session
}

export async function register(name, email, password) {
  if (isFirebaseConfigured()) {
    return registerWithEmail(name, email, password)
  }
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

export async function logout() {
  // Clear the session — but keep per-user data (history/snippets stay for when they log back in)
  localStorage.removeItem('cx_user')
  if (isFirebaseConfigured()) await firebaseSignOut()
}

export function getUser() {
  try {
    const u = localStorage.getItem('cx_user')
    return u ? JSON.parse(u) : null
  } catch { return null }
}

export function persistUser(user) {
  if (user) localStorage.setItem('cx_user', JSON.stringify(user))
  else localStorage.removeItem('cx_user')
}
