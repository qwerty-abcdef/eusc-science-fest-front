import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function TeamEventCard({ event, teamMembership, onChange }) {
  const [teamName, setTeamName] = useState('')
  const [createTxnId, setCreateTxnId] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [members, setMembers] = useState(null)

  useEffect(() => {
    if (teamMembership) {
      loadMembers()
    } else {
      setMembers(null)
    }
  }, [teamMembership])

  async function createTeam(e) {
    e.preventDefault()
    setError(null)
    setSaving(true)

    const { error } = await supabase.rpc('create_team', {
      p_event_id: event.id,
      p_team_name: teamName,
      p_transaction_id: createTxnId
    })

    setSaving(false)
    if (error) setError(error.message)
    else onChange()
  }

  async function joinTeam(e) {
    e.preventDefault()
    setError(null)
    setSaving(true)

    const { error } = await supabase.rpc('join_team', {
      p_code: joinCode,
      p_event_id: event.id
    })

    setSaving(false)
    if (error) setError(error.message)
    else onChange()
  }

  async function loadMembers() {
    const { data, error } = await supabase
      .from('team_members')
      .select('participant_id, participants(name)')
      .eq('team_id', teamMembership.teams.id)

    if (!error) setMembers(data)
  }

  return (
    <div className="card">
      <h3>{event.name}</h3>
      <p className="muted">Team size: 1 to {event.max_participants} participants</p>

      {!teamMembership && (
        <>
          <form onSubmit={createTeam}>
            <strong>Create a team</strong>
            <input
              placeholder="Team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
            <input
              placeholder="Cash App transaction ID"
              value={createTxnId}
              onChange={(e) => setCreateTxnId(e.target.value)}
              required
            />
            <button type="submit" disabled={saving}>
              {saving ? 'Creating...' : 'Create Team'}
            </button>
          </form>

          <form onSubmit={joinTeam}>
            <strong>Join a team</strong>
            <input
              placeholder="Team code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              required
            />
            <button type="submit" disabled={saving}>
              {saving ? 'Joining...' : 'Join Team'}
            </button>
          </form>
        </>
      )}

      {teamMembership && (
        <div>
          <p>Team: <strong>{teamMembership.teams.team_name}</strong></p>
          <p>Team code: <strong>{teamMembership.teams.team_code}</strong> (share this with teammates)</p>
          <p>
            Status:{' '}
            <span className={`status-${teamMembership.teams.status}`}>
              {teamMembership.teams.status}
            </span>
          </p>
          <p>Members:</p>
          {members === null && <p className="muted">Loading members...</p>}
          {members && (
            <ul>
              {members.map((m) => (
                <li key={m.participant_id}>{m.participants?.name ?? 'Unknown member'}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  )
}
