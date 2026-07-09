import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Auth from './components/Auth.jsx'
import ProfileForm from './components/ProfileForm.jsx'
import Dashboard from './components/Dashboard.jsx'

export default function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) {
      setProfile(null)
      return
    }
    checkProfile()
  }, [session])

  async function checkProfile() {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle()

    if (error) console.error(error)
    setProfile(data)
  }

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1>Science Festival Registration</h1>

      {!session && <Auth />}

      {session && !profile && (
        <ProfileForm session={session} onProfileCreated={checkProfile} />
      )}

      {session && profile && (
        <>
          <p className="muted">
            Logged in as {profile.email}{' '}
            <button onClick={() => supabase.auth.signOut()}>Log out</button>
          </p>
          <Dashboard session={session} />
        </>
      )}
    </div>
  )
}
