import { useEffect } from 'react'
import useStore from '../../lib/store'

const SOURCES = [
  { name: 'Motor cortex', desc: 'Voluntary control' },
  { name: 'Cerebellum', desc: 'Coordination' },
  { name: 'Spinal reflexes', desc: 'Automatic responses' },
  { name: 'Sensory feedback', desc: 'Proprioception' },
]

export default function Module5_Convergence({ onAdvance }) {
  useEffect(() => {
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
  }, [])

  return (
    <div className="m5-step">
      <h3 className="m5-step-title">Convergence: Many → One</h3>

      <p className="m5-narration">
        <strong>Convergence</strong> is when many neurons feed into one target neuron.
        This allows integration of information from different sources.
      </p>

      {/* Convergence diagram */}
      <div className="m5-circuit-diagram m5-circuit-diagram--converge">
        <div className="m5-circuit-sources">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="m5-circuit-node m5-circuit-node--source" style={{ '--i': i }}>
              <div className="m5-node-dot" />
            </div>
          ))}
        </div>
        <div className="m5-circuit-lines m5-circuit-lines--converge" />
        <div className="m5-circuit-target">
          <div className="m5-circuit-node m5-circuit-node--target">
            <div className="m5-node-dot m5-node-dot--large" />
          </div>
        </div>
      </div>

      <div className="m5-example-box">
        <div className="m5-example-title">Example: Motor Neuron (Bicep)</div>
        <p className="m5-example-desc">
          Your motor neuron that controls your bicep receives input from:
        </p>
        <div className="m5-source-list">
          {SOURCES.map((s, i) => (
            <div key={i} className="m5-source-item">
              <span className="m5-source-dot" style={{ '--delay': `${i * 0.2}s` }} />
              <span className="m5-source-name">{s.name}</span>
              <span className="m5-source-desc">{s.desc}</span>
            </div>
          ))}
        </div>
        <p className="m5-example-result">
          The motor neuron integrates all these inputs to produce smooth,
          coordinated contraction.
        </p>
      </div>

      <div className="m5-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
