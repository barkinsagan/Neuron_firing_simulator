import { useEffect } from 'react'
import useStore from '../../lib/store'

const STATS = [
  { label: 'Inputs per neuron', value: '1,000–10,000', detail: 'Synaptic connections received' },
  { label: 'Total synapses', value: '~100 trillion', detail: 'In the human brain' },
  { label: 'Decision speed', value: '~5 ms', detail: 'Time to integrate and fire' },
  { label: 'EPSP size', value: '~0.5–3 mV', detail: 'Each synapse contributes a tiny voltage change' },
]

export default function Module5_Integration({ onAdvance }) {
  useEffect(() => {
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
  }, [])

  return (
    <div className="m5-step">
      <h3 className="m5-step-title">The Integration Problem</h3>

      <p className="m5-narration">
        A typical neuron in your brain receives input from <strong>1,000 to 10,000</strong> other
        neurons. How does it process all this information?
      </p>

      <div className="m5-input-visual">
        <div className="m5-input-cluster">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`m5-input-dot ${i >= 10 ? 'm5-input-dot--inhib' : ''}`}
              style={{ '--delay': `${i * 0.15}s` }}
            />
          ))}
        </div>
        <div className="m5-input-arrows">
          <div className="m5-converge-arrow" />
        </div>
        <div className="m5-target-neuron">
          <div className="m5-target-body">?</div>
          <span className="m5-target-label">Fire or not?</span>
        </div>
      </div>

      <div className="m5-stats-grid">
        {STATS.map((s, i) => (
          <div key={i} className="m5-stat-card">
            <div className="m5-stat-value">{s.value}</div>
            <div className="m5-stat-label">{s.label}</div>
            <div className="m5-stat-detail">{s.detail}</div>
          </div>
        ))}
      </div>

      <div className="m5-key-concept">
        <strong>The challenge:</strong> Each synapse produces only a small voltage change
        (EPSP or IPSP). The neuron must "add up" all these inputs and decide:
        <em> Should I fire?</em>
      </div>

      <div className="m5-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
