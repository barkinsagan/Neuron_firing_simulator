import { useEffect } from 'react'
import useStore from '../../lib/store'

const JOURNEY = [
  { step: '4.1', label: 'Synaptic Cleft', desc: 'The 20–40 nm gap between neurons' },
  { step: '4.2', label: 'Chemical Signaling', desc: 'Why chemical > electrical for learning' },
  { step: '4.3', label: 'Calcium Influx', desc: 'Ca²⁺ channels open at the terminal' },
  { step: '4.4', label: 'Vesicles & NTs', desc: 'Packaged neurotransmitters ready to go' },
  { step: '4.5', label: 'Exocytosis', desc: 'SNARE-mediated vesicle fusion' },
  { step: '4.6', label: 'Diffusion', desc: 'Brownian motion across the cleft' },
  { step: '4.7', label: 'Receptor Binding', desc: 'Lock-and-key ligand recognition' },
  { step: '4.8', label: 'EPSP', desc: 'Postsynaptic depolarization toward threshold' },
  { step: '4.9', label: 'Inhibition', desc: 'IPSP — the braking system' },
  { step: '4.10', label: 'Termination', desc: 'Reuptake, enzymes, diffusion' },
]

const TAKEAWAYS = [
  'Chemical synapses convert electrical → chemical → electrical signals',
  'Ca²⁺ influx triggers vesicle fusion (exocytosis)',
  'Neurotransmitters diffuse across the cleft and bind specific receptors',
  'EPSPs excite, IPSPs inhibit — the balance determines firing',
  'Signal termination resets the synapse for the next transmission',
  'Plasticity at synapses is the basis of learning and memory',
]

export default function Module4_Summary({ onAdvance }) {
  useEffect(() => {
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
    if (window.__cameraAnimateTo) {
      window.__cameraAnimateTo({
        position: [2, 5, 16],
        target: [2, 1, 0],
      })
    }
  }, [])

  return (
    <div className="m4-step m4-step--summary">
      <h3 className="m4-step-title">Module 4 Complete: The Synapse</h3>

      <p className="m4-narration" style={{ textAlign: 'center' }}>
        You've traced the complete journey of a signal across the synapse —
        from calcium influx to postsynaptic response.
      </p>

      {/* Vertical journey timeline */}
      <div className="m4-journey-timeline">
        {JOURNEY.map((j, i) => (
          <div key={i} className="m4-journey-item">
            <div className="m4-journey-marker">
              <div className="m4-journey-dot" />
              {i < JOURNEY.length - 1 && <div className="m4-journey-line" />}
            </div>
            <div className="m4-journey-content">
              <span className="m4-journey-step">{j.step}</span>
              <span className="m4-journey-label">{j.label}</span>
              <span className="m4-journey-desc">{j.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Takeaways */}
      <div className="m4-takeaways">
        {TAKEAWAYS.map((t, i) => (
          <div key={i} className="m4-takeaway">
            <span className="m4-takeaway-check">&#10003;</span>
            <span className="m4-takeaway-text">{t}</span>
          </div>
        ))}
      </div>

      {/* Up Next */}
      <div className="m4-preview-next">
        <p className="m4-preview-text">
          <strong>Up Next:</strong> Module 5 dives deeper into <em>ion channel dynamics</em> —
          the molecular machines that make all of this possible.
        </p>
      </div>

      <div className="m4-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue to Module 5
        </button>
      </div>
    </div>
  )
}
