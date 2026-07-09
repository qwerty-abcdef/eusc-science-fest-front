import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function ProfileForm({ session, onProfileCreated }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [institution, setInstitution] = useState('')
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSaving(true)

    const { error } = await supabase.from('participants').insert({
      id: session.user.id,
      name,
      phone,
      email: session.user.email,
      institution
    })

    setSaving(false)

    if (error) setError(error.message)
    else onProfileCreated()
  }

  return (
    <div className="card">
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          placeholder="School / College name"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          required
        />
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  )
}
