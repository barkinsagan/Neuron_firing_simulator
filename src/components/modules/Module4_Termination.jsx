import { useState, useEffect } from 'react'
import useStore from '../../lib/store'

const MECHANISMS = [
  {
    title: 'Reuptake',
    icon: '⟲',
    desc: 'The presynaptic neuron reabsorbs NTs through specialized transporter proteins. This is the most common termination mechanism.',
    example: 'SSRIs (like Prozac) block serotonin reuptake, keeping serotonin active longer — treating depression.',
  },
  {
    title: 'Enzymatic Breakdown',
    icon: '✂',
    desc: 'Enzymes in the cleft break down NTs into inactive fragments. For example, acetylcholinesterase destroys acetylcholine.',
    example: 'Nerve agents (like sarin) block this enzyme, causing continuous muscle stimulation.',
  },
  {
    title: 'Diffusion Away',
    icon: '↗',
    desc: 'Some NT molecules simply drift away from the synapse and are absorbed by surrounding glial cells.',
    example: 'Glial cells (astrocytes) actively take up excess glutamate, preventing excitotoxicity.',
  },
]

export default function Module4_Termination({ onAdvance }) {
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
  }, [])

  return (
    <div className="m4-step">
      <h3 className="m4-step-title">Signal Termination</h3>

      <p className="m4-narration">
        The signal can't last forever — neurotransmitters must be <strong>cleared</strong> from
        the cleft to reset the synapse for the next signal. There are three main mechanisms:
      </p>

      <div className="m4-term-cards">
        {MECHANISMS.map((m, i) => (
          <div
            key={i}
            className={`m4-term-card ${expanded === i ? 'm4-term-card--expanded' : ''}`}
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            <div className="m4-term-header">
              <span className="m4-term-icon">{m.icon}</span>
              <span className="m4-term-title">{m.title}</span>
              <span className="m4-term-expand">{expanded === i ? '−' : '+'}</span>
            </div>
            <p className="m4-term-desc">{m.desc}</p>
            {expanded === i && (
              <div className="m4-term-example">
                <strong>Clinical:</strong> {m.example}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="m4-key-fact">
        <strong>Why it matters:</strong> Without termination, signals would never stop.
        Many drugs and toxins work by interfering with these clearance mechanisms.
      </div>

      <div className="m4-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
