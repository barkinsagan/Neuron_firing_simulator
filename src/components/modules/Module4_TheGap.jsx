import { useState, useEffect } from 'react'
import useStore from '../../lib/store'

const STATS = [
  { label: 'Cleft Width', value: '20–40 nm', detail: 'About 1/50,000th of a millimeter' },
  { label: 'Transmission Delay', value: '0.5–5 ms', detail: 'Chemical synapse speed' },
  { label: 'Synapses Per Neuron', value: '~7,000', detail: 'Average in human brain' },
  { label: 'Total in Brain', value: '~100 trillion', detail: 'More than stars in the Milky Way' },
]

export default function Module4_TheGap({ onAdvance }) {
  const [revealedQ, setRevealedQ] = useState(false)

  useEffect(() => {
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
  }, [])

  return (
    <div className="m4-step">
      <h3 className="m4-step-title">The Synaptic Cleft</h3>

      <p className="m4-narration">
        The action potential has raced down the axon and reached the <strong>axon terminal</strong>.
        But there's a problem — there's a <strong>tiny gap</strong> between this neuron and the next.
        This gap is called the <strong>synaptic cleft</strong>.
      </p>

      <div className="m4-stats-grid">
        {STATS.map((s, i) => (
          <div key={i} className="m4-stat-card">
            <div className="m4-stat-value">{s.value}</div>
            <div className="m4-stat-label">{s.label}</div>
            <div className="m4-stat-detail">{s.detail}</div>
          </div>
        ))}
      </div>

      <div className="m4-qa-reveal">
        <button
          className="m4-qa-btn"
          onClick={() => setRevealedQ(true)}
        >
          {revealedQ ? 'Got it!' : 'Why can\'t electricity just jump across?'}
        </button>
        {revealedQ && (
          <div className="m4-qa-answer">
            <p>
              The cleft is filled with <strong>extracellular fluid</strong>, which doesn't
              conduct the electrical signal well enough. The voltage change would dissipate
              almost instantly. Instead, neurons use a clever <strong>chemical messenger</strong> system
              to bridge the gap.
            </p>
          </div>
        )}
      </div>

      <div className="m4-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
