import { useEffect } from 'react'
import useStore from '../../lib/store'

const NT_TYPES = [
  {
    name: 'Glutamate',
    type: 'Excitatory',
    color: '#4caf50',
    desc: 'The brain\'s main excitatory neurotransmitter. Involved in learning, memory, and most fast signaling.',
  },
  {
    name: 'GABA',
    type: 'Inhibitory',
    color: '#2196f3',
    desc: 'The brain\'s main inhibitory neurotransmitter. Calms neural activity. Target of anti-anxiety drugs.',
  },
  {
    name: 'Dopamine',
    type: 'Modulatory',
    color: '#ff9800',
    desc: 'Reward, motivation, and movement. Implicated in Parkinson\'s disease and addiction.',
  },
  {
    name: 'Serotonin',
    type: 'Modulatory',
    color: '#9c27b0',
    desc: 'Mood, sleep, and appetite regulation. Target of many antidepressants (SSRIs).',
  },
]

const VESICLE_STATS = [
  { label: 'Vesicle diameter', value: '~40 nm' },
  { label: 'NTs per vesicle', value: '~5,000' },
  { label: 'Vesicles released per AP', value: '~100–200' },
  { label: 'Total NTs released', value: '~500,000–1,000,000' },
]

export default function Module4_Vesicles({ onAdvance }) {
  useEffect(() => {
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
  }, [])

  return (
    <div className="m4-step">
      <h3 className="m4-step-title">Vesicles & Neurotransmitters</h3>

      <p className="m4-narration">
        Inside the axon terminal, neurotransmitter molecules are packaged into tiny
        membrane-bound spheres called <strong>synaptic vesicles</strong>. Different
        neurons use different neurotransmitters.
      </p>

      <div className="m4-nt-cards">
        {NT_TYPES.map((nt) => (
          <div key={nt.name} className="m4-nt-card" style={{ borderColor: nt.color }}>
            <div className="m4-nt-header">
              <span className="m4-nt-dot" style={{ background: nt.color }} />
              <span className="m4-nt-name">{nt.name}</span>
              <span className="m4-nt-type" style={{ color: nt.color }}>{nt.type}</span>
            </div>
            <p className="m4-nt-desc">{nt.desc}</p>
          </div>
        ))}
      </div>

      <div className="m4-vesicle-stats">
        <div className="m4-vesicle-stats-title">Vesicle Facts</div>
        <div className="m4-stats-row">
          {VESICLE_STATS.map((s, i) => (
            <div key={i} className="m4-mini-stat">
              <div className="m4-mini-stat-value">{s.value}</div>
              <div className="m4-mini-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="m4-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
