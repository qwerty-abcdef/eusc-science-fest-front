import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function SoloEventCard({ event, registration, onChange }) {
  const [transactionId, setTransactionId] = useState('')
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  async function register(e) {
    e.preventDefault()
    setError(null)
    setSaving(true)

    const { error } = await supabase.from('registrations').insert({
      participant_id: (await supabase.auth.getUser()).data.user.id,
      event_id: event.id,
      transaction_id: transactionId
    })

    setSaving(false)
    if (error) setError(error.message)
    else onChange()
  }

  return (
    <div className="card">
      <h3>{event.name}</h3>

      {!registration && (
        <form onSubmit={register}>
          <input
            placeholder="Cash App transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            required
          />
          <button type="submit" disabled={saving}>
            {saving ? 'Submitting...' : 'Register'}
          </button>
        </form>
      )}

      {registration && (
        <p>
          Status: <span className={`status-${registration.status}`}>{registration.status}</span>
        </p>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  )
}
