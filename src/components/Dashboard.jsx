import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import SoloEventCard from './SoloEventCard.jsx'
import TeamEventCard from './TeamEventCard.jsx'

export default function Dashboard({ session }) {
  const [events, setEvents] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [teamMemberships, setTeamMemberships] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)

    const { data: eventsData } = await supabase.from('events').select('*').order('name')
    setEvents(eventsData || [])

    const { data: regData } = await supabase
      .from('registrations')
      .select('*')
      .eq('participant_id', session.user.id)
    setRegistrations(regData || [])

    const { data: teamData, error: teamError } = await supabase
      .from('team_members')
      .select('team_id, teams(*)')
      .eq('participant_id', session.user.id)

    // TEMP DEBUG — remove once the visibility bug is confirmed fixed
    console.log('teamMemberships raw data:', teamData)
    console.log('teamMemberships error:', teamError)

    setTeamMemberships(teamData || [])

    setLoading(false)
  }

  if (loading) return <p>Loading events...</p>

  const soloEvents = events.filter((e) => e.type === 'solo')
  const teamEvents = events.filter((e) => e.type === 'team')

  return (
    <div>
      <h2>Solo Events</h2>
      {soloEvents.map((event) => (
        <SoloEventCard
          key={event.id}
          event={event}
          registration={registrations.find((r) => r.event_id === event.id)}
          onChange={loadAll}
        />
      ))}

      <h2>Team Events</h2>
      {teamEvents.map((event) => (
        <TeamEventCard
          key={event.id}
          event={event}
          teamMembership={teamMemberships.find((tm) => tm.teams?.event_id === event.id)}
          onChange={loadAll}
        />
      ))}
    </div>
  )
}
