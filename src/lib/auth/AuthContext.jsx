import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    signUp: async (data) => {
      const result = await supabase.auth.signUp(data)
      if (result.error) throw result.error
      return result
    },
    signIn: async (data) => {
      const result = await supabase.auth.signInWithPassword(data)
      if (result.error) throw result.error
      return result
    },
    signOut: async () => {
      const result = await supabase.auth.signOut()
      if (result.error) throw result.error
      return result
    },
    user,
    loading
  }

  if (loading) {
    return null
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
