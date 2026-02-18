import { useEffect } from 'react'
import useStore from '../../lib/store'

const TARGETS = [
  { name: 'Visual cortex', desc: 'Conscious perception' },
  { name: 'Superior colliculus', desc: 'Eye movements' },
  { name: 'Suprachiasmatic nucleus', desc: 'Circadian rhythms' },
  { name: 'Pretectum', desc: 'Pupil reflex' },
]

export default function Module5_Divergence({ onAdvance }) {
  useEffect(() => {
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
  }, [])

  return (
    <div className="m5-step">
      <h3 className="m5-step-title">Divergence: One → Many</h3>

      <p className="m5-narration">
        <strong>Divergence</strong> is when one neuron projects to many target neurons.
        This allows broadcast of a signal to multiple targets simultaneously.
      </p>

      {/* Divergence diagram */}
      <div className="m5-circuit-diagram m5-circuit-diagram--diverge">
        <div className="m5-circuit-target" style={{ order: 0 }}>
          <div className="m5-circuit-node m5-circuit-node--target">
            <div className="m5-node-dot m5-node-dot--large" />
          </div>
        </div>
        <div className="m5-circuit-lines m5-circuit-lines--diverge" />
        <div className="m5-circuit-sources" style={{ order: 2 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="m5-circuit-node m5-circuit-node--source" style={{ '--i': i }}>
              <div className="m5-node-dot" />
            </div>
          ))}
        </div>
      </div>

      <div className="m5-example-box">
        <div className="m5-example-title">Example: Retinal Neuron</div>
        <p className="m5-example-desc">
          A single neuron in your retina that detects light sends information to:
        </p>
        <div className="m5-source-list">
          {TARGETS.map((t, i) => (
            <div key={i} className="m5-source-item">
              <span className="m5-source-dot" style={{ '--delay': `${i * 0.2}s` }} />
              <span className="m5-source-name">{t.name}</span>
              <span className="m5-source-desc">{t.desc}</span>
            </div>
          ))}
        </div>
        <p className="m5-example-result">
          One input affects multiple systems simultaneously — vision, reflexes,
          your sleep cycle, and pupil size.
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
