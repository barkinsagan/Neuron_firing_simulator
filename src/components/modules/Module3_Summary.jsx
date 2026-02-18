import { useEffect } from 'react'
import useStore from '../../lib/store'

const TAKEAWAYS = [
  'Domino effect: each segment triggers the next',
  'Refractory period = one-way propagation',
  'Myelin insulation = saltatory conduction',
  'Nodes of Ranvier contain all the voltage-gated channels',
]

export default function Module3_Summary({ onAdvance }) {
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
    <div className="m3-step m3-step--summary">
      <h3 className="m3-step-title">Module 3 Complete: Propagation</h3>

      <p className="m3-narration" style={{ textAlign: 'center' }}>
        The signal never weakens because it <strong>regenerates at each node</strong>.
        Myelin makes this <strong>50–100x faster</strong> than unmyelinated conduction.
      </p>

      {/* MS callout */}
      <div className="m3-clinical-note">
        <div className="m3-clinical-header">Clinical Connection</div>
        <p className="m3-clinical-text">
          In <strong>Multiple Sclerosis (MS)</strong>, the immune system attacks and
          destroys myelin. Without insulation, signals slow dramatically or fail entirely —
          causing movement difficulties, numbness, and vision problems.
        </p>
      </div>

      {/* Takeaways */}
      <div className="m3-takeaways">
        {TAKEAWAYS.map((t, i) => (
          <div key={i} className="m3-takeaway">
            <span className="m3-takeaway-check">&#10003;</span>
            <span className="m3-takeaway-text">{t}</span>
          </div>
        ))}
      </div>

      {/* Preview */}
      <div className="m3-preview-next">
        <p className="m3-preview-text">
          <strong>Up Next:</strong> The signal has reached the axon terminal.
          How does it cross the gap to the next neuron? Module 4 explores
          <em> synaptic transmission</em>.
        </p>
      </div>

      <div className="m3-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue to Module 4
        </button>
      </div>
    </div>
  )
}
