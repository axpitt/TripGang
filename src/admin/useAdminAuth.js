import { useState, useEffect } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as fbSignOut } from 'firebase/auth'
import { auth } from '../lib/firebase'

export const useAdminAuth = () => {
  const [user, setUser] = useState(undefined) // undefined = loading
  const [error, setError] = useState('')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u ?? null))
    return unsub
  }, [])

  const signIn = async (email, password) => {
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (e) {
      const msg = {
        'auth/invalid-credential': 'Wrong email or password.',
        'auth/user-not-found': 'No account found.',
        'auth/wrong-password': 'Wrong password.',
        'auth/too-many-requests': 'Too many attempts. Try again later.',
      }[e.code] || 'Login failed. Try again.'
      setError(msg)
    }
  }

  const signOut = () => fbSignOut(auth)

  return { user, error, signIn, signOut }
}
